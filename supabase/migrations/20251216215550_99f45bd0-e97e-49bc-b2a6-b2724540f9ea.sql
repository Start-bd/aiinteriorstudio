
-- Enable RLS on styles and room_types tables and add public read policies

ALTER TABLE public.styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_types ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read active styles and room types (they're public reference data)
CREATE POLICY "Anyone can view active styles" ON public.styles FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view active room types" ON public.room_types FOR SELECT USING (is_active = true);
