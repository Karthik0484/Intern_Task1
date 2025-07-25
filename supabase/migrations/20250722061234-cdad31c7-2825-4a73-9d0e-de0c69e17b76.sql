-- Create cameras table
CREATE TABLE public.cameras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create incidents table
CREATE TABLE public.incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camera_id UUID REFERENCES public.cameras(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  ts_start TIMESTAMP WITH TIME ZONE NOT NULL,
  ts_end TIMESTAMP WITH TIME ZONE NOT NULL,
  thumbnail_url TEXT NOT NULL,
  resolved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.cameras ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a monitoring dashboard)
CREATE POLICY "Enable read access for all users" ON public.cameras FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "Enable update access for all users" ON public.incidents FOR UPDATE USING (true);

-- Insert sample cameras
INSERT INTO public.cameras (name, location) VALUES
  ('Shop Floor A', 'Ground Floor'),
  ('Vault', 'Backroom'),
  ('Main Entrance', 'Front Gate');

-- Insert sample incidents with various types and times
INSERT INTO public.incidents (camera_id, type, ts_start, ts_end, thumbnail_url, resolved)
SELECT 
  c.id,
  CASE 
    WHEN row_number() OVER () % 4 = 1 THEN 'Unauthorised Access'
    WHEN row_number() OVER () % 4 = 2 THEN 'Gun Threat'
    WHEN row_number() OVER () % 4 = 3 THEN 'Face Recognised'
    ELSE 'Suspicious Activity'
  END as type,
  now() - interval '1 hour' * (row_number() OVER ()),
  now() - interval '1 hour' * (row_number() OVER ()) + interval '30 minutes',
  '/src/assets/incident' || ((row_number() OVER () % 4) + 1) || '.jpg',
  CASE WHEN row_number() OVER () > 8 THEN true ELSE false END
FROM public.cameras c
CROSS JOIN generate_series(1, 4) gs;