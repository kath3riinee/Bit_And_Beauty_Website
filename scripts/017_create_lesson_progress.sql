-- Create lesson_progress table to track user progress through course lessons
CREATE TABLE IF NOT EXISTS public.lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id text NOT NULL,
  lesson_id text NOT NULL,
  completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, course_id, lesson_id)
);

-- Enable RLS
ALTER TABLE public.lesson_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own progress
CREATE POLICY lesson_progress_select_own ON public.lesson_progress
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own progress
CREATE POLICY lesson_progress_insert_own ON public.lesson_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own progress
CREATE POLICY lesson_progress_update_own ON public.lesson_progress
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own progress
CREATE POLICY lesson_progress_delete_own ON public.lesson_progress
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user_course ON public.lesson_progress(user_id, course_id);
