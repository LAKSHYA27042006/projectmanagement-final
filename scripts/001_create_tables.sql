-- Project Management Database Schema
-- Simple and essential tables for project management

-- Profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Profiles RLS Policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_delete_own" ON public.profiles;
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Projects RLS Policies
DROP POLICY IF EXISTS "projects_select_own" ON public.projects;
CREATE POLICY "projects_select_own" ON public.projects FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_insert_own" ON public.projects;
CREATE POLICY "projects_insert_own" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_update_own" ON public.projects;
CREATE POLICY "projects_update_own" ON public.projects FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_delete_own" ON public.projects;
CREATE POLICY "projects_delete_own" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Tasks RLS Policies
DROP POLICY IF EXISTS "tasks_select_own" ON public.tasks;
CREATE POLICY "tasks_select_own" ON public.tasks FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "tasks_insert_own" ON public.tasks;
CREATE POLICY "tasks_insert_own" ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "tasks_update_own" ON public.tasks;
CREATE POLICY "tasks_update_own" ON public.tasks FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "tasks_delete_own" ON public.tasks;
CREATE POLICY "tasks_delete_own" ON public.tasks FOR DELETE USING (auth.uid() = user_id);
