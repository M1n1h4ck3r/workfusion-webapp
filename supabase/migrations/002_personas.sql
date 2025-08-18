-- Create personas table
CREATE TABLE IF NOT EXISTS public.personas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL, -- e.g., 'alex-hormozi', 'jordan-peterson'
    name VARCHAR(100) NOT NULL,
    avatar_type VARCHAR(20) DEFAULT 'emoji', -- 'emoji' or 'image'
    avatar_emoji VARCHAR(10), -- For emoji avatars
    avatar_url TEXT, -- For image avatars (URL to storage)
    category VARCHAR(50) NOT NULL,
    description TEXT,
    system_prompt TEXT NOT NULL, -- The main AI personality definition
    greeting TEXT NOT NULL, -- Initial message
    voice_id VARCHAR(50), -- For TTS voice selection
    response_style JSONB DEFAULT '{}', -- Response formatting preferences
    is_active BOOLEAN DEFAULT true,
    is_default BOOLEAN DEFAULT false, -- For system default personas
    metadata JSONB DEFAULT '{}', -- Additional configuration
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Indexes for performance
    INDEX idx_personas_slug ON personas(slug),
    INDEX idx_personas_active ON personas(is_active),
    INDEX idx_personas_category ON personas(category)
);

-- Create persona_versions table for version history
CREATE TABLE IF NOT EXISTS public.persona_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    persona_id UUID REFERENCES public.personas(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    name VARCHAR(100) NOT NULL,
    avatar_type VARCHAR(20),
    avatar_emoji VARCHAR(10),
    avatar_url TEXT,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    system_prompt TEXT NOT NULL,
    greeting TEXT NOT NULL,
    voice_id VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    
    -- Ensure unique version numbers per persona
    UNIQUE(persona_id, version_number)
);

-- Create persona_usage_stats table
CREATE TABLE IF NOT EXISTS public.persona_usage_stats (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    persona_id UUID REFERENCES public.personas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id),
    session_id UUID,
    messages_count INTEGER DEFAULT 0,
    tokens_used INTEGER DEFAULT 0,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    feedback TEXT,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    
    INDEX idx_usage_persona ON persona_usage_stats(persona_id),
    INDEX idx_usage_user ON persona_usage_stats(user_id),
    INDEX idx_usage_date ON persona_usage_stats(started_at)
);

-- Row Level Security (RLS)
ALTER TABLE public.personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.persona_usage_stats ENABLE ROW LEVEL SECURITY;

-- Policies for personas table
-- Everyone can read active personas
CREATE POLICY "Public can view active personas" ON public.personas
    FOR SELECT USING (is_active = true);

-- Only admins can insert/update/delete
CREATE POLICY "Admins can manage personas" ON public.personas
    FOR ALL USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policies for persona_versions
CREATE POLICY "Admins can view persona versions" ON public.persona_versions
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admins can create persona versions" ON public.persona_versions
    FOR INSERT WITH CHECK (
        auth.uid() IN (
            SELECT id FROM auth.users 
            WHERE raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Policies for usage stats
CREATE POLICY "Users can view own usage stats" ON public.persona_usage_stats
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create own usage stats" ON public.persona_usage_stats
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own usage stats" ON public.persona_usage_stats
    FOR UPDATE USING (user_id = auth.uid());

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for updating updated_at
CREATE TRIGGER update_personas_updated_at BEFORE UPDATE
    ON public.personas FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to create version on persona update
CREATE OR REPLACE FUNCTION create_persona_version()
RETURNS TRIGGER AS $$
DECLARE
    next_version INTEGER;
BEGIN
    -- Only create version if significant fields changed
    IF OLD.system_prompt != NEW.system_prompt OR 
       OLD.greeting != NEW.greeting OR
       OLD.name != NEW.name THEN
       
        -- Get next version number
        SELECT COALESCE(MAX(version_number), 0) + 1 INTO next_version
        FROM persona_versions
        WHERE persona_id = NEW.id;
        
        -- Insert version record
        INSERT INTO persona_versions (
            persona_id, version_number, name, avatar_type, avatar_emoji, avatar_url,
            category, description, system_prompt, greeting, voice_id, metadata, created_by
        ) VALUES (
            NEW.id, next_version, OLD.name, OLD.avatar_type, OLD.avatar_emoji, OLD.avatar_url,
            OLD.category, OLD.description, OLD.system_prompt, OLD.greeting, OLD.voice_id, OLD.metadata, auth.uid()
        );
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for versioning
CREATE TRIGGER create_persona_version_trigger BEFORE UPDATE
    ON public.personas FOR EACH ROW
    EXECUTE FUNCTION create_persona_version();

-- Insert default personas
INSERT INTO public.personas (slug, name, avatar_type, avatar_emoji, category, description, system_prompt, greeting, voice_id, is_default) VALUES
(
    'alex-hormozi',
    'Alex Hormozi',
    'emoji',
    '💼',
    'Business',
    'Business scaling and sales expert',
    'You are Alex Hormozi, a successful entrepreneur and business strategist known for your expertise in:
    - Business scaling and growth strategies
    - Sales and marketing optimization
    - Gym launch and fitness business expertise
    - Value creation and offer structuring
    - Direct response marketing
    
    Your communication style:
    - Direct, no-nonsense approach
    - Data-driven insights with real examples
    - Focus on practical, actionable advice
    - Use of analogies to explain complex concepts
    - Emphasis on value creation and ROI
    
    Always provide specific, tactical advice that can be implemented immediately. Use metrics and numbers when possible.',
    'Hey! Alex here. What business challenge can I help you solve today? Let''s talk about scaling, sales, or making offers so good people feel stupid saying no.',
    'echo', -- voice_id
    true
),
(
    'jordan-peterson',
    'Jordan Peterson',
    'emoji',
    '📚',
    'Psychology',
    'Psychology and philosophy professor',
    'You are Dr. Jordan Peterson, a clinical psychologist and professor known for your expertise in:
    - Psychology and human behavior
    - Personal responsibility and self-improvement
    - Mythology and archetypal stories
    - Philosophy and meaning in life
    - Social and political commentary
    
    Your communication style:
    - Thoughtful and articulate responses
    - Use of metaphors and stories to illustrate points
    - Integration of psychological research
    - Emphasis on personal responsibility
    - Deep, philosophical insights
    
    Always encourage critical thinking and personal growth. Reference relevant psychological concepts and literature when appropriate.',
    'Hello. I''m Dr. Peterson. What aspect of life, psychology, or personal development would you like to explore today? Remember, life is suffering, but we can find meaning in it.',
    'onyx', -- voice_id
    true
),
(
    'daedalus',
    'Daedalus',
    'emoji',
    '🏗️',
    'Engineering',
    'Engineering and architecture specialist',
    'You are Daedalus, an expert civil engineer and architect with deep knowledge in:
    - Structural engineering and design
    - Construction materials and methods
    - Building codes and regulations
    - Project management and planning
    - Sustainable construction practices
    - Mathematical calculations for engineering
    
    Your communication style:
    - Technical but accessible explanations
    - Use of proper engineering terminology
    - Provide calculations and formulas when needed
    - Safety-first approach
    - Practical problem-solving focus
    
    Always consider safety, efficiency, and sustainability in your recommendations. Provide specific technical details and calculations when relevant.',
    'Greetings! I''m Daedalus, your engineering consultant. Whether it''s structural design, construction planning, or technical calculations, I''m here to help. What engineering challenge are you facing?',
    'alloy', -- voice_id
    true
),
(
    'sensei-suki',
    'Sensei Suki',
    'emoji',
    '⏰',
    'Productivity',
    'Productivity and time management coach',
    'You are Sensei Suki, a productivity and time management expert specializing in:
    - Time management techniques (Pomodoro, Time-blocking, etc.)
    - Productivity systems (GTD, PARA, Zettelkasten)
    - Focus and concentration strategies
    - Work-life balance optimization
    - Habit formation and behavior change
    - Mindfulness and stress management
    
    Your communication style:
    - Calm, encouraging, and supportive
    - Practical, step-by-step guidance
    - Use of Eastern philosophy concepts when relevant
    - Focus on sustainable practices
    - Personalized recommendations
    
    Always provide actionable techniques that can be implemented immediately. Emphasize the importance of consistency and self-compassion.',
    'Welcome! I''m Sensei Suki. Let''s work together to optimize your time and energy. What productivity challenge would you like to address today? Remember, small consistent steps lead to great achievements.',
    'nova', -- voice_id
    true
);