-- Create project_access table for role-based access control
CREATE TABLE IF NOT EXISTS public.project_access (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'editor', 'viewer')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(project_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_project_access_project_id ON public.project_access(project_id);
CREATE INDEX IF NOT EXISTS idx_project_access_user_id ON public.project_access(user_id);

-- Enable Row Level Security
ALTER TABLE public.project_access ENABLE ROW LEVEL SECURITY;

-- RLS Policies for project_access table
CREATE POLICY "Users can view project access for projects they own or have access to"
    ON public.project_access FOR SELECT
    USING (
        auth.uid() IN (
            SELECT owner_id FROM public.projects WHERE id = project_id
            UNION
            SELECT user_id FROM public.project_access WHERE project_id = project_access.project_id
        )
    );

CREATE POLICY "Project owners can insert project access"
    ON public.project_access FOR INSERT
    WITH CHECK (
        auth.uid() IN (
            SELECT owner_id FROM public.projects WHERE id = project_id
        )
    );

CREATE POLICY "Project owners can update project access"
    ON public.project_access FOR UPDATE
    USING (
        auth.uid() IN (
            SELECT owner_id FROM public.projects WHERE id = project_id
        )
    );

CREATE POLICY "Project owners can delete project access"
    ON public.project_access FOR DELETE
    USING (
        auth.uid() IN (
            SELECT owner_id FROM public.projects WHERE id = project_id
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_project_access_updated_at
    BEFORE UPDATE ON public.project_access
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();
