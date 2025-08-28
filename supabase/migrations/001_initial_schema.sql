-- Create profiles table for user data
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  tokens INTEGER DEFAULT 500,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create personas table
CREATE TABLE personas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_type TEXT DEFAULT 'emoji' CHECK (avatar_type IN ('emoji', 'image')),
  avatar_emoji TEXT,
  avatar_url TEXT,
  category TEXT NOT NULL DEFAULT 'General',
  description TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  greeting TEXT NOT NULL,
  voice_id TEXT,
  response_style JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  is_default BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat sessions table
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create token transactions table
CREATE TABLE token_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL, -- Positive for additions, negative for usage
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('purchase', 'bonus', 'usage', 'refund')),
  service_type TEXT, -- 'chatbot', 'tts', 'whatsapp', 'voice-call', etc.
  description TEXT NOT NULL,
  reference_id TEXT, -- For linking to specific chats, orders, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create persona usage stats table
CREATE TABLE persona_usage_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  persona_id UUID REFERENCES personas(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  usage_count INTEGER DEFAULT 1,
  total_tokens_used INTEGER DEFAULT 0,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  last_used_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(persona_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_personas_active ON personas(is_active);
CREATE INDEX idx_personas_category ON personas(category);
CREATE INDEX idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX idx_chat_sessions_persona_id ON chat_sessions(persona_id);
CREATE INDEX idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX idx_token_transactions_user_id ON token_transactions(user_id);
CREATE INDEX idx_token_transactions_created_at ON token_transactions(created_at);
CREATE INDEX idx_persona_usage_stats_persona_id ON persona_usage_stats(persona_id);
CREATE INDEX idx_persona_usage_stats_user_id ON persona_usage_stats(user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_personas_updated_at BEFORE UPDATE ON personas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_sessions_updated_at BEFORE UPDATE ON chat_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default personas
INSERT INTO personas (slug, name, avatar_type, avatar_emoji, category, description, system_prompt, greeting, is_default) VALUES
(
  'friendly-assistant',
  'Friendly Assistant',
  'emoji',
  '😊',
  'General',
  'A helpful and friendly AI assistant',
  'You are a helpful, friendly, and professional AI assistant. Always be polite and provide accurate information.',
  'Hello! How can I help you today?',
  TRUE
),
(
  'tech-expert',
  'Tech Expert',
  'emoji',
  '💻',
  'Technical',
  'Expert in technology and programming',
  'You are a knowledgeable technology expert who can help with programming, software development, and tech questions.',
  'Hi there! Ready to tackle any technical questions.',
  FALSE
),
(
  'creative-writer',
  'Creative Writer',
  'emoji',
  '✍️',
  'Creative',
  'Creative writing and storytelling assistant',
  'You are a creative writing assistant who helps with storytelling, poetry, and creative content.',
  'Let''s create something amazing together!',
  FALSE
),
(
  'business-advisor',
  'Business Advisor',
  'emoji',
  '💼',
  'Business',
  'Strategic business and entrepreneurship expert',
  'You are a business advisor with expertise in strategy, entrepreneurship, and business development.',
  'Welcome! Let''s discuss your business goals and strategies.',
  FALSE
);

-- Enable Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE personas ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE token_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE persona_usage_stats ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for personas (public read, admin write)
CREATE POLICY "Anyone can view active personas" ON personas
  FOR SELECT USING (is_active = TRUE);

CREATE POLICY "Admins can manage personas" ON personas
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- RLS Policies for chat sessions
CREATE POLICY "Users can view their own chat sessions" ON chat_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own chat sessions" ON chat_sessions
  FOR UPDATE USING (user_id = auth.uid());

-- RLS Policies for chat messages
CREATE POLICY "Users can view messages from their own sessions" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create messages in their own sessions" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- RLS Policies for token transactions
CREATE POLICY "Users can view their own transactions" ON token_transactions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create transactions" ON token_transactions
  FOR INSERT WITH CHECK (TRUE); -- Allow system to create transactions

-- RLS Policies for persona usage stats
CREATE POLICY "Users can view their own usage stats" ON persona_usage_stats
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage usage stats" ON persona_usage_stats
  FOR ALL WITH CHECK (TRUE); -- Allow system to manage stats

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION create_profile_for_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name, tokens, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    500, -- Default 500 tokens
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to create profile when user signs up
CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_profile_for_user();

-- Function to update token balance
CREATE OR REPLACE FUNCTION update_user_tokens(
  user_id UUID,
  amount INTEGER,
  transaction_type TEXT,
  service_type TEXT DEFAULT NULL,
  description TEXT DEFAULT 'Token transaction'
)
RETURNS INTEGER AS $$
DECLARE
  new_balance INTEGER;
BEGIN
  -- Update user tokens
  UPDATE profiles 
  SET tokens = tokens + amount 
  WHERE id = user_id
  RETURNING tokens INTO new_balance;
  
  -- Record transaction
  INSERT INTO token_transactions (user_id, amount, transaction_type, service_type, description)
  VALUES (user_id, amount, transaction_type, service_type, description);
  
  RETURN new_balance;
END;
$$ LANGUAGE plpgsql;