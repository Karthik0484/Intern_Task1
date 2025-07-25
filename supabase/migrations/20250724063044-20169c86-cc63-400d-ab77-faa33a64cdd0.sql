-- Add missing columns to cameras table
ALTER TABLE public.cameras 
ADD COLUMN stream_url TEXT,
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Update incidents table structure
ALTER TABLE public.incidents 
ADD COLUMN status TEXT DEFAULT 'unresolved',
ADD COLUMN location TEXT;

-- Update existing incidents to have location from camera
UPDATE public.incidents 
SET location = c.location,
    status = CASE WHEN resolved THEN 'resolved' ELSE 'unresolved' END
FROM public.cameras c 
WHERE public.incidents.camera_id = c.id;

-- Create users table for user profiles
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  profile_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users are viewable by everyone" 
ON public.users 
FOR SELECT 
USING (true);

-- Insert sample user data
INSERT INTO public.users (name, email, profile_url) VALUES
('Mohammed Ajhas', 'mohammed@securesight.com', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'),
('Sarah Johnson', 'sarah@securesight.com', 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'),
('Alex Chen', 'alex@securesight.com', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face');

-- Update camera sample data with stream URLs
UPDATE public.cameras 
SET stream_url = 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop',
    is_active = true
WHERE name = 'Shop Floor A';

UPDATE public.cameras 
SET stream_url = 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
    is_active = true  
WHERE name = 'Vault';

UPDATE public.cameras 
SET stream_url = 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
    is_active = false
WHERE name = 'Main Entrance';

-- Enable realtime for incidents table
ALTER TABLE public.incidents REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.incidents;