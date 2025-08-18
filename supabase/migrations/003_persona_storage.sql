-- Create storage bucket for persona avatars
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'persona-avatars',
    'persona-avatars',
    true, -- Public bucket for avatar images
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for persona avatars
CREATE POLICY "Anyone can view persona avatars" ON storage.objects
    FOR SELECT USING (bucket_id = 'persona-avatars');

CREATE POLICY "Admins can upload persona avatars" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'persona-avatars' AND
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can update persona avatars" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'persona-avatars' AND
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can delete persona avatars" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'persona-avatars' AND
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Function to generate public URL for persona avatar
CREATE OR REPLACE FUNCTION get_persona_avatar_url(persona_id UUID)
RETURNS TEXT AS $$
DECLARE
    avatar_path TEXT;
BEGIN
    SELECT avatar_url INTO avatar_path
    FROM public.personas
    WHERE id = persona_id;
    
    IF avatar_path IS NOT NULL THEN
        -- Return full Supabase storage URL
        RETURN concat(
            current_setting('app.settings.supabase_url', true),
            '/storage/v1/object/public/persona-avatars/',
            avatar_path
        );
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;