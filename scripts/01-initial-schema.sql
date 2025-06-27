-- Create the table for general project-level documents
CREATE TABLE IF NOT EXISTS public.general_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name text NOT NULL,
    file_path text NOT NULL,
    name text NOT NULL,
    type text,
    size bigint,
    description text,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create the table for question-specific evidence
CREATE TABLE IF NOT EXISTS public.question_evidence (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name text NOT NULL,
    question_id text NOT NULL,
    evidence_type text NOT NULL,
    content text NOT NULL,
    file_path text,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create Storage Buckets
-- Bucket for general project documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('project_documents', 'project_documents', true)
ON CONFLICT (id) DO NOTHING;

-- Bucket for question evidence files
INSERT INTO storage.buckets (id, name, public)
VALUES ('question_evidence_files', 'question_evidence_files', true)
ON CONFLICT (id) DO NOTHING;


-- Create Policies for Buckets
-- Policies for project_documents
CREATE POLICY "Allow public read access on project_documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project_documents');

CREATE POLICY "Allow authenticated users to upload to project_documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'project_documents');

CREATE POLICY "Allow authenticated users to delete from project_documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'project_documents');

-- Policies for question_evidence_files
CREATE POLICY "Allow public read access on question_evidence_files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'question_evidence_files');

CREATE POLICY "Allow authenticated users to upload to question_evidence_files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'question_evidence_files');

CREATE POLICY "Allow authenticated users to delete from question_evidence_files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'question_evidence_files');

-- Add comments to tables and columns for clarity
COMMENT ON TABLE public.general_documents IS 'Stores metadata for general documents uploaded for a project.';
COMMENT ON TABLE public.question_evidence IS 'Stores evidence snippets and file metadata linked to specific assessment questions.';
COMMENT ON COLUMN public.question_evidence.content IS 'Contains the text of a snippet or the file name for a file.';
