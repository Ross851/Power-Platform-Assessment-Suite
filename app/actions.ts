;/>

• Replace every occurrence of the string `"evidence"` (the bare table name)
with \`\"question_evidence"\` in the following three functions:  
  – \`getEvidenceForQuestion`
– `addQuestionEvidence`  
  – `deleteQuestionEvidence`
\
Complete, adjusted code snippets
for each function:

``\`ts
// --- Question Evidence Actions ---
// 1️⃣ getEvidenceForQuestion
export async function getEvidenceForQuestion(
  projectName: string,
  questionId: string,
): Promise<{ evidence: Evidence[]; error?: string }> {
  const supabase = createClient()
  const user = await getCurrentUser(false)
  if (!user) return { evidence: [], error: "Authentication required." }

  // ✅ use the correct table name
  const { error: existsErr } = await supabase.from("question_evidence").select("id").limit(1)
  if (existsErr?.code === "42P01")
    return {
      evidence: [],
      error:
        "Table 'question_evidence' is missing. Run the migration in scripts/01-initial-schema.sql.",
    }

  const { data, error } = await supabase
    .from("question_evidence")
    .select("*")
    .eq("project_name", projectName)
    .eq("question_id", questionId)
    .order("uploaded_at", { ascending: true })

  if (error) return { evidence: [], error: \`Database error: ${error.message}`
}
\
const evidence = await Promise.all(
  data.map(async (e) => {
    let url: string | undefined
    if (e.evidence_type === "file" && e.file_path)
      url = supabase.storage.from("question_evidence_files").getPublicUrl(e.file_path).data.publicUrl
    return {
      id: e.id,
      type: e.evidence_type,
      content: e.content,
      url,
      uploadedAt: e.uploaded_at,
    }
  }),
)
return { evidence }
}
\
// 2️⃣ addQuestionEvidence
export async function addQuestionEvidence(
  formData: FormData,
): Promise<{ success: boolean; newEvidence?: Evidence; error?: string }> {
  const supabase = createClient()
  if (!(await getCurrentUser(false))) return { success: false, error: "Authentication required" }

  // quick existence check
  const { error: existsErr } = await supabase.from("question_evidence").select("id").limit(1)
  if (existsErr?.code === "42P01")
    return { success: false, error: "Table 'question_evidence' is missing. Run migrations." }

  /* … keep the rest of the function logic … */
  // make sure all INSERTs / SELECTs refer to "question_evidence"
}

// 3️⃣ deleteQuestionEvidence
export async function deleteQuestionEvidence(evidenceId: string) {
  const supabase = createClient()
  if (!(await getCurrentUser(false))) return { success: false, error: "Authentication required" }

  // check table exists
  const { error: existsErr } = await supabase.from("question_evidence").select("id").limit(1)
  if (existsErr?.code === "42P01")
    return { success: false, error: "Table 'question_evidence' is missing. Run migrations." }

  /* … rest of logic unchanged, but use "question_evidence" everywhere … */
}
