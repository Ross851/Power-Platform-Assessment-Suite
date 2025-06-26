"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { GeneralDocument } from "@/lib/types"

export async function getDocumentsForProject(projectName: string): Promise<GeneralDocument[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("general_documents")
    .select("*")
    .eq("project_name", projectName)
    .order("uploaded_at", { ascending: false })

  if (error) {
    console.error("Error fetching documents:", error)
    return []
  }

  // Get public URLs for each document
  const documentsWithUrls = await Promise.all(
    data.map(async (doc) => {
      const { data: urlData } = supabase.storage.from("project_documents").getPublicUrl(doc.file_path)
      return { ...doc, url: urlData.publicUrl }
    }),
  )

  return documentsWithUrls
}

export async function uploadDocument(formData: FormData) {
  const file = formData.get("file") as File
  const description = formData.get("description") as string
  const projectName = formData.get("projectName") as string

  if (!file || !projectName) {
    return { error: "File and project name are required." }
  }

  const supabase = createClient()
  const filePath = `${projectName}/${Date.now()}-${file.name}`

  // Upload file to Supabase Storage
  const { error: uploadError } = await supabase.storage.from("project_documents").upload(filePath, file)

  if (uploadError) {
    console.error("Upload Error:", uploadError)
    return { error: `Failed to upload file: ${uploadError.message}` }
  }

  // Insert metadata into the database
  const { error: dbError } = await supabase.from("general_documents").insert({
    project_name: projectName,
    file_path: filePath,
    name: file.name,
    type: file.type,
    size: file.size,
    description: description,
  })

  if (dbError) {
    console.error("Database Error:", dbError)
    // Attempt to clean up the orphaned file in storage
    await supabase.storage.from("project_documents").remove([filePath])
    return { error: `Failed to save document metadata: ${dbError.message}` }
  }

  revalidatePath("/") // Revalidate the dashboard page to show the new document
  return { success: true }
}

export async function deleteDocument(documentId: string, filePath: string) {
  if (!documentId || !filePath) {
    return { error: "Document ID and file path are required." }
  }

  const supabase = createClient()

  // 1. Delete file from storage
  const { error: storageError } = await supabase.storage.from("project_documents").remove([filePath])
  if (storageError) {
    console.error("Storage Deletion Error:", storageError)
    return { error: `Failed to delete file from storage: ${storageError.message}` }
  }

  // 2. Delete metadata from database
  const { error: dbError } = await supabase.from("general_documents").delete().eq("id", documentId)
  if (dbError) {
    console.error("DB Deletion Error:", dbError)
    return { error: `Failed to delete document metadata: ${dbError.message}` }
  }

  revalidatePath("/") // Revalidate the dashboard page
  return { success: true }
}
