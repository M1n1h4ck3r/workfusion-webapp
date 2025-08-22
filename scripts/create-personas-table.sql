-- Create personas table in Supabase
CREATE TABLE IF NOT EXISTS personas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_type VARCHAR(50) DEFAULT 'emoji',
    avatar_emoji VARCHAR(10),
    avatar_url TEXT,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    system_prompt TEXT NOT NULL,
    greeting TEXT NOT NULL,
    voice_id VARCHAR(100),
    response_style JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_personas_slug ON personas(slug);
CREATE INDEX idx_personas_category ON personas(category);
CREATE INDEX idx_personas_is_active ON personas(is_active);
CREATE INDEX idx_personas_is_default ON personas(is_default);

-- Create RLS policies
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active personas
CREATE POLICY "Public personas are viewable by everyone" 
ON personas FOR SELECT 
USING (is_active = true);

-- Policy: Only authenticated users can create personas
CREATE POLICY "Authenticated users can create personas" 
ON personas FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Policy: Only authenticated users can update their own personas or admins can update any
CREATE POLICY "Users can update their own personas" 
ON personas FOR UPDATE
TO authenticated
USING (
    auth.uid() = created_by 
    OR EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Policy: Only authenticated users can delete their own personas or admins can delete any
CREATE POLICY "Users can delete their own personas" 
ON personas FOR DELETE
TO authenticated
USING (
    auth.uid() = created_by 
    OR EXISTS (
        SELECT 1 FROM auth.users 
        WHERE auth.users.id = auth.uid() 
        AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
);

-- Insert some default personas
INSERT INTO personas (slug, name, avatar_type, avatar_emoji, category, description, system_prompt, greeting, is_active, is_default) VALUES
('friendly-assistant', 'Friendly Assistant', 'emoji', '😊', 'General', 'A helpful and friendly AI assistant', 'You are a helpful, friendly, and professional AI assistant. Always be polite and considerate in your responses.', 'Hello! How can I help you today?', true, true),
('tech-expert', 'Tech Expert', 'emoji', '💻', 'Technical', 'Expert in technology and programming', 'You are a knowledgeable technology expert specializing in software development, programming languages, and technical problem-solving. Provide detailed and accurate technical information.', 'Hi there! Ready to tackle any technical questions you have.', true, false),
('creative-writer', 'Creative Writer', 'emoji', '✍️', 'Creative', 'Creative writing and storytelling assistant', 'You are a creative writing assistant with expertise in storytelling, narrative development, and various writing styles. Help users with creative writing projects, story ideas, and writing techniques.', 'Greetings! Let''s create something amazing together.', true, false),
('business-advisor', 'Business Advisor', 'emoji', '💼', 'Business', 'Business strategy and consulting', 'You are a professional business advisor with expertise in strategy, management, marketing, and entrepreneurship. Provide practical business advice and insights.', 'Welcome! How can I assist with your business needs today?', true, false),
('health-coach', 'Health Coach', 'emoji', '🏃', 'Health', 'Health and wellness guidance', 'You are a knowledgeable health and wellness coach. Provide general health advice, fitness tips, and wellness guidance. Always remind users to consult healthcare professionals for medical concerns.', 'Hello! Ready to work on your health and wellness goals?', true, false);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_personas_updated_at BEFORE UPDATE ON personas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();