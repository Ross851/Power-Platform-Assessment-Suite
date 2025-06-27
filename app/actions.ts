"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { GeneralDocument, Evidence, Project } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

// --- Project Actions ---

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient()
  const { data, error } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    throw new Error("Failed to fetch projects.")
  }

  return data || []
}

const CreateProjectSchema = z.object({
  name: z.string().min(2, "Project name is required"),
  client_name: z.string().optional(),
})

export async function createProject(_: unknown, formData: FormData) {
  const parsed = CreateProjectSchema.safeParse({
    name: formData.get("name"),
    client_name: formData.get("client_name"),
  })

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from("projects")
    .insert({
      name: parsed.data.name,
      client_name: parsed.data.client_name ?? null,
    })
    .select()
    .single()

  if (error) {
    console.error("Error creating project:", error)
    return { error: error.message }
  }

  revalidatePath("/")
  return { success: true, project: data }
}

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

export async function getEvidenceForQuestion(
  projectName: string,
  questionId: string,
): Promise<{ evidence: Evidence[]; error?: string }> {
  const supabase = createClient()
  try {
    const { data, error } = await supabase
      .from("question_evidence")
      .select("*")
      .eq("project_name", projectName)
      .eq("question_id", questionId)
      .order("uploaded_at", { ascending: true })

    if (error) throw error

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

    return { evidence: evidenceWithUrls }
  } catch (err: any) {
    if (err?.code === "42P01") {
      console.warn("`question_evidence` table is missing. Returning error to UI.")
      return {
        evidence: [],
        error:
          "Database table 'question_evidence' not found. Please run the initial schema script in 'scripts/01-initial-schema.sql' to resolve this.",
      }
    }
    console.error("Error fetching evidence:", err.message)
    return { evidence: [], error: `An unexpected error occurred: ${err.message}` }
  }
}

export async function addQuestionEvidence(
  formData: FormData,
): Promise<{ success: boolean; newEvidence?: Evidence; error?: string }> {
  const supabase = createClient()

  const { error: tableError } = await supabase.from("question_evidence").select("id").limit(1)
  if (tableError?.code === "42P01") {
    return {
      success: false,
      error:
        "Evidence table 'question_evidence' is not yet provisioned. Please run the database migrations from 'scripts/01-initial-schema.sql' and try again.",
    }
  }

  const projectName = formData.get("projectName") as string
  const questionId = formData.get("questionId") as string
  const type = formData.get("type") as "file" | "snippet"
  const content = formData.get("content") as string
  const file = formData.get("file") as File | null

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

  const { error: tableError } = await supabase.from("question_evidence").select("id").limit(1)
  if (tableError?.code === "42P01") {
    return {
      success: false,
      error:
        "Evidence table 'question_evidence' has not been created yet. Please run the database migrations from 'scripts/01-initial-schema.sql'. Nothing to delete.",
    }
  }

  const { data: eviData, error: fetchError } = await supabase
    .from("question_evidence")
    .select("evidence_type, file_path")
    .eq("id", evidenceId)
    .single()

  if (fetchError || !eviData) {
    return { error: "Evidence not found." }
  }

  if (eviData.evidence_type === "file" && eviData.file_path) {
    const { error: storageError } = await supabase.storage.from("question_evidence_files").remove([eviData.file_path])
    if (storageError) {
      console.error(`Storage deletion failed for ${eviData.file_path}: ${storageError.message}`)
    }
  }

  const { error: dbError } = await supabase.from("question_evidence").delete().eq("id", evidenceId)
  if (dbError) {
    return { error: `DB deletion failed: ${dbError.message}` }
  }

  revalidatePath(`/assessment/`)
  return { success: true }
}
