"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { Evidence, Project } from "@/lib/types"
import { v4 as uuidv4 } from "uuid"

// --- Authentication Helper ---
export async function getCurrentUser() {
  const supabase = createClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error) {
      console.error("Auth error:", error)
      throw new Error("Authentication failed")
    }

    if (!user) {
      throw new Error("No authenticated user")
    }

    return user
  } catch (error) {
    console.error("getCurrentUser error:", error)
    throw error
  }
}

// --- Project Actions ---

export async function getProjects(): Promise<Project[]> {
  const supabase = createClient()
  const user = await getCurrentUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching projects:", error)
    return []
  }

  return data || []
}

export async function createProject(formData: FormData) {
  try {
    const user = await getCurrentUser()

    const name = formData.get("name") as string
    const clientName = formData.get("clientName") as string
    const description = formData.get("description") as string

    if (!name?.trim()) {
      return { error: "Project name is required" }
    }

    const supabase = createClient()

    const { data, error } = await supabase
      .from("projects")
      .insert({
        name: name.trim(),
        client_name: clientName?.trim() || null,
        description: description?.trim() || null,
        owner_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return { error: "Failed to create project" }
    }

    revalidatePath("/")
    return { success: true, project: data }
  } catch (error) {
    console.error("Create project error:", error)
    return { error: "Authentication required" }
  }
}

// --- Project Access Management ---

export async function inviteUserToProject(projectName: string, email: string, role: "editor" | "viewer") {
  try {
    const user = await getCurrentUser()
    const supabase = createClient()

    // Get the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, owner_id")
      .eq("name", projectName)
      .single()

    if (projectError || !project) {
      return { error: "Project not found" }
    }

    // Check if user is owner
    if (project.owner_id !== user.id) {
      return { error: "Only project owners can invite users" }
    }

    // Check if user exists
    const { data: invitedUser, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single()

    if (userError || !invitedUser) {
      return { error: "User not found. They need to sign up first." }
    }

    // Check if already has access
    const { data: existingAccess } = await supabase
      .from("project_access")
      .select("id")
      .eq("project_id", project.id)
      .eq("user_id", invitedUser.id)
      .single()

    if (existingAccess) {
      return { error: "User already has access to this project" }
    }

    // Add access
    const { error: insertError } = await supabase.from("project_access").insert({
      project_id: project.id,
      user_id: invitedUser.id,
      role: role,
    })

    if (insertError) {
      console.error("Insert access error:", insertError)
      return { error: "Failed to invite user" }
    }

    return { success: true }
  } catch (error) {
    console.error("Invite user error:", error)
    return { error: "Authentication required" }
  }
}

export async function removeUserFromProject(projectName: string, email: string) {
  try {
    const user = await getCurrentUser()
    const supabase = createClient()

    // Get the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, owner_id")
      .eq("name", projectName)
      .single()

    if (projectError || !project) {
      return { error: "Project not found" }
    }

    // Check if user is owner
    if (project.owner_id !== user.id) {
      return { error: "Only project owners can remove users" }
    }

    // Get user to remove
    const { data: userToRemove, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .single()

    if (userError || !userToRemove) {
      return { error: "User not found" }
    }

    // Remove access
    const { error: deleteError } = await supabase
      .from("project_access")
      .delete()
      .eq("project_id", project.id)
      .eq("user_id", userToRemove.id)

    if (deleteError) {
      console.error("Delete access error:", deleteError)
      return { error: "Failed to remove user" }
    }

    return { success: true }
  } catch (error) {
    console.error("Remove user error:", error)
    return { error: "Authentication required" }
  }
}

export async function getProjectUsers(projectName: string) {
  try {
    const user = await getCurrentUser()
    const supabase = createClient()

    // First get the project
    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("id, owner_id")
      .eq("name", projectName)
      .single()

    if (projectError || !project) {
      return { error: "Project not found" }
    }

    // Check if user is owner
    if (project.owner_id !== user.id) {
      return { error: "Access denied" }
    }

    // Get project access users
    const { data: accessUsers, error: accessError } = await supabase
      .from("project_access")
      .select(`
        id,
        role,
        created_at,
        profiles!inner(
          id,
          email,
          full_name
        )
      `)
      .eq("project_id", project.id)

    if (accessError) {
      console.error("Access query error:", accessError)
      return { error: "Failed to fetch users" }
    }

    // Get owner info
    const { data: ownerProfile, error: ownerError } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("id", project.owner_id)
      .single()

    const users = []

    // Add owner
    if (ownerProfile) {
      users.push({
        id: ownerProfile.id,
        email: ownerProfile.email,
        full_name: ownerProfile.full_name,
        role: "owner" as const,
        created_at: new Date().toISOString(),
      })
    }

    // Add access users
    if (accessUsers) {
      accessUsers.forEach((access: any) => {
        users.push({
          id: access.profiles.id,
          email: access.profiles.email,
          full_name: access.profiles.full_name,
          role: access.role,
          created_at: access.created_at,
        })
      })
    }

    return { users }
  } catch (error) {
    console.error("Get project users error:", error)
    return { error: "Authentication required" }
  }
}

// --- Document Management Actions ---

export async function getDocumentsForProject(projectName: string) {
  try {
    const user = await getCurrentUser()

    // For now, return empty array - would need actual document fetching
    return []
  } catch (error) {
    console.error("Get documents error:", error)
    return []
  }
}

export async function uploadDocument(formData: FormData) {
  try {
    const user = await getCurrentUser()

    const file = formData.get("file") as File
    const description = formData.get("description") as string
    const projectName = formData.get("projectName") as string

    if (!file || !projectName) {
      return { error: "File and project name are required" }
    }

    // For now, just return success - file upload would need Supabase Storage setup
    return { success: true }
  } catch (error) {
    console.error("Upload document error:", error)
    return { error: "Authentication required" }
  }
}

export async function deleteDocument(id: string, filePath: string) {
  try {
    const user = await getCurrentUser()

    // For now, just return success - would need actual deletion logic
    return { success: true }
  } catch (error) {
    console.error("Delete document error:", error)
    return { error: "Authentication required" }
  }
}

// --- Question Evidence Actions ---

export async function getEvidenceForQuestion(projectName: string, questionId: string, standardSlug: string) {
  try {
    const user = await getCurrentUser()
    const supabase = createClient()

    const { data, error } = await supabase
      .from("evidence")
      .select("*")
      .eq("project_name", projectName)
      .eq("question_id", questionId)
      .eq("standard_slug", standardSlug)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Evidence query error:", error)
      return { error: "Failed to fetch evidence" }
    }

    return { evidence: data || [] }
  } catch (error) {
    console.error("Get evidence error:", error)
    return { error: "Authentication required" }
  }
}

export async function addQuestionEvidence(
  formData: FormData,
): Promise<{ success: boolean; newEvidence?: Evidence; error?: string }> {
  const supabase = createClient()
  const user = await getCurrentUser(false)

  if (!user) {
    return { success: false, error: "Authentication required" }
  }

  const projectName = formData.get("projectName") as string
  const questionId = formData.get("questionId") as string
  const type = formData.get("type") as "file" | "snippet"
  const content = formData.get("content") as string
  const file = formData.get("file") as File | null

  if (!projectName || !questionId || !type) {
    return { success: false, error: "Missing required fields." }
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
    if (!content) return { success: false, error: "Snippet content cannot be empty." }
    dbPayload.content = content
    newEvidence.content = content
  } else if (type === "file") {
    if (!file) return { success: false, error: "File is required for file evidence." }
    const filePath = `${projectName}/${questionId}/${Date.now()}-${file.name}`
    const { error: uploadError } = await supabase.storage.from("question_evidence_files").upload(filePath, file)
    if (uploadError) return { success: false, error: `Upload failed: ${uploadError.message}` }

    dbPayload.content = file.name
    dbPayload.file_path = filePath
    newEvidence.content = file.name
    const { data: urlData } = supabase.storage.from("question_evidence_files").getPublicUrl(filePath)
    newEvidence.url = urlData.publicUrl
  }

  const { error: dbError } = await supabase.from("evidence").insert(dbPayload)
  if (dbError) {
    if (type === "file" && dbPayload.file_path) {
      await supabase.storage.from("question_evidence_files").remove([dbPayload.file_path])
    }
    return { success: false, error: `DB insert failed: ${dbError.message}` }
  }

  revalidatePath(`/assessment/`)
  return { success: true, newEvidence: newEvidence as Evidence }
}

export async function deleteQuestionEvidence(evidenceId: string): Promise<{ success: boolean; error?: string }> {
  const supabase = createClient()
  const user = await getCurrentUser(false)

  if (!user) {
    return { success: false, error: "Authentication required" }
  }

  const { data: eviData, error: fetchError } = await supabase
    .from("evidence")
    .select("evidence_type, file_path")
    .eq("id", evidenceId)
    .single()

  if (fetchError || !eviData) {
    return { success: false, error: "Evidence not found." }
  }

  if (eviData.evidence_type === "file" && eviData.file_path) {
    const { error: storageError } = await supabase.storage.from("question_evidence_files").remove([eviData.file_path])
    if (storageError) {
      console.error(`Storage deletion failed for ${eviData.file_path}: ${storageError.message}`)
    }
  }

  const { error: dbError } = await supabase.from("evidence").delete().eq("id", evidenceId)
  if (dbError) {
    return { success: false, error: `DB deletion failed: ${dbError.message}` }
  }

  revalidatePath(`/assessment/`)
  return { success: true }
}
