"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { GeneralDocument, Evidence } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

// --- General Document Actions ---

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

  const { error: uploadError } = await supabase.storage.from("project_documents").upload(filePath, file)
  if (uploadError) return { error: `Failed to upload file: ${uploadError.message}` }

  const { error: dbError } = await supabase.from("general_documents").insert({
    project_name: projectName,
    file_path: filePath,
    name: file.name,
    type: file.type,
    size: file.size,
    description: description,
  })

  if (dbError) {
    await supabase.storage.from("project_documents").remove([filePath])
    return { error: `Failed to save document metadata: ${dbError.message}` }
  }

  revalidatePath("/")
  return { success: true }
}

export async function deleteDocument(documentId: string, filePath: string) {
  const supabase = createClient()
  const { error: storageError } = await supabase.storage.from("project_documents").remove([filePath])
  if (storageError) return { error: `Failed to delete file from storage: ${storageError.message}` }

  const { error: dbError } = await supabase.from("general_documents").delete().eq("id", documentId)
  if (dbError) return { error: `Failed to delete document metadata: ${dbError.message}` }

  revalidatePath("/")
  return { success: true }
}

// --- Question Evidence Actions ---

// NOTE: This assumes a 'question_evidence' table exists with columns:
// id (uuid, pk), project_name (text), question_id (text), evidence_type (text),
// content (text), file_path (text, nullable), uploaded_at (timestampz)

export async function getEvidenceForQuestion(projectName: string, questionId: string): Promise<Evidence[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("question_evidence")
    .select("*")
    .eq("project_name", projectName)
    .eq("question_id", questionId)
    .order("uploaded_at", { ascending: true })

  if (error) {
    console.error("Error fetching evidence:", error)
    return []
  }

  const evidenceWithUrls = await Promise.all(
    data.map(async (evi) => {
      let url: string | undefined = undefined
      if (evi.evidence_type === "file" && evi.file_path) {
        const { data: urlData } = supabase.storage.from("question_evidence_files").getPublicUrl(evi.file_path)
        url = urlData.publicUrl
      }
      return {
        id: evi.id,
        type: evi.evidence_type,
        content: evi.content,
        url: url,
        uploadedAt: evi.uploaded_at,
      }
    }),
  )

  return evidenceWithUrls
}

export async function addQuestionEvidence(
  formData: FormData,
): Promise<{ success: boolean; newEvidence?: Evidence; error?: string }> {
  const supabase = createClient()
  const projectName = formData.get("projectName") as string
  const questionId = formData.get("questionId") as string
  const type = formData.get("type") as "file" | "snippet"
  const content = formData.get("content") as string // For snippet
  const file = formData.get("file") as File | null // For file

  if (!projectName || !questionId || !type) {
    return { error: "Missing required fields." }
  }

  const newEvidenceId = uuidv4()
  const dbPayload: any = {
    id: newEvidenceId,
    project_name: projectName,
    question_id: questionId,
    evidence_type: type,
  }
  const newEvidence: Partial<Evidence> = { id: newEvidenceId, type, uploadedAt: new Date().toISOString() }

  if (type === "snippet") {
    if (!content) return { error: "Snippet content cannot be empty." }
    dbPayload.content = content
    newEvidence.content = content
  } else if (type === "file") {
    if (!file) return { error: "File is required for file evidence." }
    const filePath = `${projectName}/${questionId}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from("question_evidence_files").upload(filePath, file)
    if (uploadError) return { error: `Upload failed: ${uploadError.message}` }

    dbPayload.content = file.name
    dbPayload.file_path = filePath
    newEvidence.content = file.name
    const { data: urlData } = supabase.storage.from("question_evidence_files").getPublicUrl(filePath)
    newEvidence.url = urlData.publicUrl
  }

  const { error: dbError } = await supabase.from("question_evidence").insert(dbPayload)
  if (dbError) {
    if (type === "file" && dbPayload.file_path) {
      await supabase.storage.from("question_evidence_files").remove([dbPayload.file_path])
    }
    return { error: `DB insert failed: ${dbError.message}` }
  }

  revalidatePath(`/assessment/`)
  return { success: true, newEvidence: newEvidence as Evidence }
}

export async function deleteQuestionEvidence(evidenceId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()

  // First, get the evidence to find the file path if it exists
  const { data: eviData, error: fetchError } = await supabase
    .from("question_evidence")
    .select("evidence_type, file_path")
    .eq("id", evidenceId)
    .single()

  if (fetchError || !eviData) {
    return { error: "Evidence not found." }
  }

  // If it's a file, delete from storage
  if (eviData.evidence_type === "file" && eviData.file_path) {
    const { error: storageError } = await supabase.storage.from("question_evidence_files").remove([eviData.file_path])
    if (storageError) {
      // Log error but proceed to delete DB record
      console.error(`Storage deletion failed for ${eviData.file_path}: ${storageError.message}`)
    }
  }

  // Delete the record from the database
  const { error: dbError } = await supabase.from("question_evidence").delete().eq("id", evidenceId)
  if (dbError) {
    return { error: `DB deletion failed: ${dbError.message}` }
  }

  revalidatePath(`/assessment/`)
  return { success: true }
}
