# Database Setup Guide

This guide covers setting up Supabase for the WorkFusion application.

## Prerequisites

- Supabase account (https://supabase.com)
- Node.js and npm installed
- Supabase CLI (optional but recommended)

## 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create an account
2. Create a new project
3. Choose your organization, project name, and database password
4. Wait for the project to be provisioned (usually 2-3 minutes)

## 2. Get Project Credentials

From your Supabase dashboard:

1. Go to **Settings** → **API**
2. Copy the following values:
   - Project URL (NEXT_PUBLIC_SUPABASE_URL)
   - Anon public key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - Service role key (SUPABASE_SERVICE_ROLE_KEY)

## 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update the Supabase configuration:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 4. Run Database Migration

### Option A: Using Supabase Dashboard (Recommended)

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Paste and run the SQL script
5. Verify all tables and functions were created

### Option B: Using Supabase CLI

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Initialize Supabase in your project:
```bash
supabase init
```

3. Link to your remote project:
```bash
supabase link --project-ref your-project-ref
```

4. Run migrations:
```bash
supabase db push
```

## 5. Configure Authentication

### Enable Email Authentication

1. Go to **Authentication** → **Settings**
2. Under **Auth Providers**, ensure **Email** is enabled
3. Configure email templates if desired

### Enable OAuth Providers (Optional)

1. Go to **Authentication** → **Settings**
2. Under **Auth Providers**, configure:
   - **Google**: Add Client ID and Client Secret
   - **GitHub**: Add Client ID and Client Secret
3. Update your `.env.local` with OAuth credentials

### Configure Auth Redirect URLs

1. In **Authentication** → **URL Configuration**, add:
   - Site URL: `http://localhost:3003` (development)
   - Redirect URLs:
     - `http://localhost:3003/auth/callback`
     - `https://yourdomain.com/auth/callback` (production)

## 6. Configure Row Level Security (RLS)

The migration script automatically sets up RLS policies, but you can review them:

1. Go to **Authentication** → **Policies**
2. Verify policies are active for all tables:
   - `profiles`: Users can only access their own data
   - `personas`: Public read access, admin write access
   - `chat_sessions`: Users can only access their own sessions
   - `chat_messages`: Users can only access messages from their sessions
   - `token_transactions`: Users can only view their own transactions
   - `persona_usage_stats`: Users can only view their own stats

## 7. Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Navigate to `http://localhost:3003`
3. Try to register a new account
4. Check if the user profile is created in the `profiles` table
5. Test the chat functionality

## 8. Production Considerations

### Environment Variables

Set production environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Backups

1. Go to **Settings** → **Database**
2. Enable automated backups
3. Set up backup retention policy

### Performance Monitoring

1. Enable **Database** → **Extensions** → **pg_stat_statements**
2. Monitor query performance in **Reports**
3. Set up database usage alerts

## 9. Database Schema

The application uses the following main tables:

- **profiles**: User account information and tokens
- **personas**: AI personality configurations
- **chat_sessions**: Chat conversation sessions
- **chat_messages**: Individual messages in conversations
- **token_transactions**: Token purchase and usage tracking
- **persona_usage_stats**: Usage analytics for personas

## Troubleshooting

### Common Issues

1. **"Invalid API key" error**: Verify your Supabase URL and anon key
2. **"Row Level Security policy violation"**: Check RLS policies are properly configured
3. **Migration fails**: Ensure you have proper permissions and the database is accessible
4. **OAuth redirect issues**: Verify redirect URLs are correctly configured

### Getting Help

- Check Supabase documentation: https://supabase.com/docs
- Join the Supabase Discord: https://discord.supabase.com
- Review the application logs for specific error messages

## Development Mode

The application includes a demo mode that works without Supabase configuration:

- Users can sign up/sign in with any email/password combination
- Data is stored locally and resets on page refresh
- All features work but data is not persistent
- Perfect for testing and development

To use demo mode, simply don't configure the Supabase environment variables or use placeholder values.