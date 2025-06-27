-- Enable Row Level Security
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
    id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email text UNIQUE NOT NULL,
    full_name text,
    avatar_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create projects table
CREATE TABLE IF NOT EXISTS public.projects (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    description text,
    owner_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create project_access table for user permissions
CREATE TABLE IF NOT EXISTS public.project_access (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    role text NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
    granted_by uuid REFERENCES public.profiles(id) NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    UNIQUE(project_id, user_id)
);

-- Create the table for general project-level documents
CREATE TABLE IF NOT EXISTS public.general_documents (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name text NOT NULL,
    file_path text NOT NULL,
    name text NOT NULL,
    type text,
    size bigint,
    description text,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
    uploaded_by uuid REFERENCES public.profiles(id)
);

-- Create the table for question-specific evidence
CREATE TABLE IF NOT EXISTS public.question_evidence (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    project_name text NOT NULL,
    question_id text NOT NULL,
    evidence_type text NOT NULL,
    content text NOT NULL,
    file_path text,
    uploaded_at timestamp with time zone DEFAULT now() NOT NULL,
    uploaded_by uuid REFERENCES public.profiles(id)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.general_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_evidence ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create policies for projects table
CREATE POLICY "Users can view projects they have access to" ON public.projects
    FOR SELECT USING (
        owner_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.project_access 
            WHERE project_id = projects.id AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own projects" ON public.projects
    FOR INSERT WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Project owners can update their projects" ON public.projects
    FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Project owners can delete their projects" ON public.projects
    FOR DELETE USING (owner_id = auth.uid());

-- Create policies for project_access table
CREATE POLICY "Users can view access for projects they own or have access to" ON public.project_access
    FOR SELECT USING (
        user_id = auth.uid() OR 
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = project_id AND owner_id = auth.uid()
        )
    );

CREATE POLICY "Project owners can manage access" ON public.project_access
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.projects 
            WHERE id = project_id AND owner_id = auth.uid()
        )
    );

-- Create policies for general_documents table
CREATE POLICY "Users can view documents for projects they have access to" ON public.general_documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_access pa ON p.id = pa.project_id
            WHERE p.name = project_name 
            AND (p.owner_id = auth.uid() OR pa.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can upload documents to projects they have editor+ access to" ON public.general_documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_access pa ON p.id = pa.project_id
            WHERE p.name = project_name 
            AND (
                p.owner_id = auth.uid() OR 
                (pa.user_id = auth.uid() AND pa.role IN ('owner', 'editor'))
            )
        )
    );

-- Create policies for question_evidence table
CREATE POLICY "Users can view evidence for projects they have access to" ON public.question_evidence
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_access pa ON p.id = pa.project_id
            WHERE p.name = project_name 
            AND (p.owner_id = auth.uid() OR pa.user_id = auth.uid())
        )
    );

CREATE POLICY "Users can add evidence to projects they have editor+ access to" ON public.question_evidence
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.projects p
            LEFT JOIN public.project_access pa ON p.id = pa.project_id
            WHERE p.name = project_name 
            AND (
                p.owner_id = auth.uid() OR 
                (pa.user_id = auth.uid() AND pa.role IN ('owner', 'editor'))
            )
        )
    );

-- Create Storage Buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('project_documents', 'project_documents', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('question_evidence_files', 'question_evidence_files', false)
ON CONFLICT (id) DO NOTHING;

-- Create Storage Policies
CREATE POLICY "Users can view files for projects they have access to" ON storage.objects
    FOR SELECT USING (
        bucket_id IN ('project_documents', 'question_evidence_files') AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can upload files for projects they have access to" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id IN ('project_documents', 'question_evidence_files') AND
        auth.role() = 'authenticated'
    );

CREATE POLICY "Users can delete files for projects they have access to" ON storage.objects
    FOR DELETE USING (
        bucket_id IN ('project_documents', 'question_evidence_files') AND
        auth.role() = 'authenticated'
    );

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add comments for documentation
COMMENT ON TABLE public.profiles IS 'User profiles linked to auth.users';
COMMENT ON TABLE public.projects IS 'Assessment projects owned by users';
COMMENT ON TABLE public.project_access IS 'User access permissions for projects';
COMMENT ON TABLE public.general_documents IS 'General documents uploaded for projects';
COMMENT ON TABLE public.question_evidence IS 'Evidence linked to specific assessment questions';
