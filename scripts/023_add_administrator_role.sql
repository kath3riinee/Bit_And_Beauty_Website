-- Add 'administrator' role option to profiles
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('student', 'mentor', 'business_owner', 'course_maker', 'admin', 'administrator'));

-- Create course_creation_requests table for approval workflow
CREATE TABLE IF NOT EXISTS public.course_creation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  course_title text NOT NULL,
  course_description text,
  course_category text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewed_at timestamp with time zone,
  rejection_reason text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.course_creation_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for course creation requests
CREATE POLICY "requests_select_own_or_admin"
  ON public.course_creation_requests FOR SELECT
  USING (
    auth.uid() = requester_id OR
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'administrator')
    )
  );

CREATE POLICY "requests_insert_course_maker"
  ON public.course_creation_requests FOR INSERT
  WITH CHECK (
    auth.uid() = requester_id AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND is_course_maker = true
    )
  );

CREATE POLICY "requests_update_admin"
  ON public.course_creation_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'administrator')
    )
  );

-- Update profiles table to allow admins to update roles
CREATE POLICY "profiles_update_admin_role_assignment"
  ON public.profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid()
      AND role IN ('admin', 'administrator')
    )
  );

-- Create notification trigger for new course requests
CREATE OR REPLACE FUNCTION notify_admins_new_course_request()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, link)
  SELECT 
    p.id,
    'course_request',
    'New Course Creation Request',
    (SELECT full_name FROM public.profiles WHERE id = NEW.requester_id) || ' has requested to create a new course',
    '/creator/admin/course-requests'
  FROM public.profiles p
  WHERE p.role IN ('admin', 'administrator');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS course_request_notification ON public.course_creation_requests;
CREATE TRIGGER course_request_notification
  AFTER INSERT ON public.course_creation_requests
  FOR EACH ROW
  EXECUTE FUNCTION notify_admins_new_course_request();
