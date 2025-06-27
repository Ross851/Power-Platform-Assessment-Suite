-- Enable Row Level Security on all tables
ALTER TABLE public.general_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_evidence ENABLE ROW LEVEL SECURITY;

-- Create users table for project access control
CREATE TABLE IF NOT EXISTS public.project_users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name text NOT NULL,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(project_name, user_id)
);

-- Create projects table if using database storage
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    client_name text,
    owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable RLS on new tables
ALTER TABLE public.project_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies for projects table
CREATE POLICY "Users can view projects they have access to" ON public.projects
    FOR SELECT USING (
        owner_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.project_users 
            WHERE project_name = projects.name AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own projects" ON public.projects
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Project owners can update their projects" ON public.projects
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Project owners can delete their projects" ON public.projects
    FOR DELETE USING (owner_id = auth.uid());

-- RLS Policies for general_documents
CREATE POLICY "Users can view documents for accessible projects" ON public.general_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_users pu ON p.name = pu.project_name
            WHERE p.name = general_documents.project_name 
            AND (p.owner_id = auth.uid() OR pu.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can upload documents to accessible projects" ON public.general_documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_users pu ON p.name = pu.project_name
            WHERE p.name = general_documents.project_name 
            AND (p.owner_id = auth.uid() OR (pu.user_id = auth.uid() AND pu.role IN ('owner', 'editor')))
        )
    );

CREATE POLICY "Users can delete documents from their accessible projects" ON public.general_documents
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_users pu ON p.name = pu.project_name
            WHERE p.name = general_documents.project_name 
            AND (p.owner_id = auth.uid() OR (pu.user_id = auth.uid() AND pu.role IN ('owner', 'editor')))
        )
    );

-- RLS Policies for question_evidence
CREATE POLICY "Users can view evidence for accessible projects" ON public.question_evidence
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_users pu ON p.name = pu.project_name
            WHERE p.name = question_evidence.project_name 
            AND (p.owner_id = auth.uid() OR pu.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can add evidence to accessible projects" ON public.question_evidence
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_users pu ON p.name = pu.project_name
            WHERE p.name = question_evidence.project_name 
            AND (p.owner_id = auth.uid() OR (pu.user_id = auth.uid() AND pu.role IN ('owner', 'editor')))
        )
    );

CREATE POLICY "Users can delete evidence from accessible projects" ON public.question_evidence
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_users pu ON p.name = pu.project_name
            WHERE p.name = question_evidence.project_name 
            AND (p.owner_id = auth.uid() OR (pu.user_id = auth.uid() AND pu.role IN ('owner', 'editor')))
        )
    );

-- RLS Policies for project_users (user management)
CREATE POLICY "Users can view project access for their projects" ON public.project_users
    FOR SELECT USING (
        user_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE name = project_users.project_name AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can manage project access" ON public.project_users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE name = project_users.project_name AND owner_id = auth.uid()
        )
    );

-- Update Storage Policies to respect authentication
DROP POLICY IF EXISTS "Allow public read access on project_documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access on question_evidence_files" ON storage.objects;

-- New authenticated storage policies
CREATE POLICY "Allow authenticated read access on project_documents" ON storage.objects
    FOR SELECT TO authenticated USING (
        bucket_id = 'project_documents' AND
        EXISTS (
            SELECT 1 FROM public.general_documents gd
            JOIN public.projects p ON gd.project_name = p.name
            LEFT JOIN public.project_users pu ON p.name = pu.project_name
            WHERE gd.file_path = storage.objects.name
            AND (p.owner_id = auth.uid() OR pu.user_id = auth.uid())
        )
    );

CREATE POLICY "Allow authenticated read access on question_evidence_files" ON storage.objects
    FOR SELECT TO authenticated USING (
        bucket_id = 'question_evidence_files' AND
        EXISTS (
            SELECT 1 FROM public.question_evidence qe
            JOIN public.projects p ON qe.project_name = p.name
            LEFT JOIN public.project_users pu ON p.name = pu.project_name
            WHERE qe.file_path = storage.objects.name
            AND (p.owner_id = auth.uid() OR pu.user_id = auth.uid())
        )
    );

-- Functions for project management
CREATE OR REPLACE FUNCTION public.invite_user_to_project(
    project_name_param text,
    user_email text,
    role_param text DEFAULT 'viewer'
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id uuid;
    project_owner_id uuid;
    result json;
BEGIN
    -- Check if current user owns the project
    SELECT owner_id INTO project_owner_id 
    FROM public.projects 
    WHERE name = project_name_param;
    
    IF project_owner_id != auth.uid() THEN
        RETURN json_build_object('error', 'Only project owners can invite users');
    END IF;
    
    -- Get user ID from email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RETURN json_build_object('error', 'User not found');
    END IF;
    
    -- Insert or update project access
    INSERT INTO public.project_users (project_name, user_id, role)
    VALUES (project_name_param, target_user_id, role_param)
    ON CONFLICT (project_name, user_id) 
    DO UPDATE SET role = role_param, created_at = now();
    
    RETURN json_build_object('success', true, 'message', 'User invited successfully');
END;
$$;

-- Function to remove user from project
CREATE OR REPLACE FUNCTION public.remove_user_from_project(
    project_name_param text,
    user_email text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    target_user_id uuid;
    project_owner_id uuid;
BEGIN
    -- Check if current user owns the project
    SELECT owner_id INTO project_owner_id 
    FROM public.projects 
    WHERE name = project_name_param;
    
    IF project_owner_id != auth.uid() THEN
        RETURN json_build_object('error', 'Only project owners can remove users');
    END IF;
    
    -- Get user ID from email
    SELECT id INTO target_user_id 
    FROM auth.users 
    WHERE email = user_email;
    
    IF target_user_id IS NULL THEN
        RETURN json_build_object('error', 'User not found');
    END IF;
    
    -- Remove project access
    DELETE FROM public.project_users 
    WHERE project_name = project_name_param AND user_id = target_user_id;
    
    RETURN json_build_object('success', true, 'message', 'User removed successfully');
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_project_users_project_user ON public.project_users(project_name, user_id);
CREATE INDEX idx_projects_owner ON public.projects(owner_id);
CREATE INDEX idx_projects_name ON public.projects(name);
