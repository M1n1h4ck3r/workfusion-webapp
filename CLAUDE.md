# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WorkFusion - AI Agency web application built with Next.js 15 and React 19.

## Deployment Strategy

### Version Control and GitHub Deployment

**Automatic Deployment Policy:**
Deploy to GitHub automatically after major changes, bug fixes, or important milestones without asking for permission.

**Versioning Strategy:**
- **Current Phase (Phase 1):** v1.0 (initial), v1.1, v1.2, v1.3... for incremental changes
- **New Phases:** v2.0 (phase start), v2.1, v2.2... for changes within phase
- **Subsequent Phases:** v3.0, v4.0... for new phase starts

**Auto-deploy Triggers:**
- Major feature additions
- Important bug fixes  
- Significant milestones
- Phase completions

**Deployment Process:**
1. Git commit with descriptive message
2. Create version tag (v1.x, v2.x, etc.)
3. Push to GitHub repository
4. Create GitHub release if major milestone

## Commands

### Development
```bash
# Start development server (ALWAYS runs on port 3003 for Google OAuth compatibility)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

**IMPORTANT:** This project must always run on port 3003 in development due to Google OAuth redirect URL configuration. Do not change the port.

## Architecture

### Tech Stack
- **Framework**: Next.js 15.4.6 with App Router
- **UI Library**: React 19.1.0
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x with PostCSS
- **Linting**: ESLint 9.x with Next.js config
- **Database**: Supabase (PostgreSQL) for authentication and data storage
- **Object Storage**: Backblaze B2 for avatar images and file uploads
- **State Management**: Zustand for client-side state
- **AI Integration**: OpenAI/Anthropic SDK for chat functionality
- **Image Processing**: Sharp for avatar optimization

### Project Structure
```
src/
├── app/                # Next.js App Router
│   ├── layout.tsx      # Root layout with Geist font setup
│   ├── page.tsx        # Homepage component
│   ├── globals.css     # Global styles with Tailwind directives
│   ├── dashboard/      # Protected dashboard routes
│   │   ├── admin/      # Admin management pages
│   │   │   └── personas/  # AI persona management
│   │   └── settings/   # User settings
│   ├── playground/     # AI chat playground
│   └── api/            # API routes
│       └── personas/   # Persona CRUD endpoints
├── components/         # Reusable React components
│   ├── ui/            # Base UI components
│   ├── chat/          # Chat interface components
│   └── profile/       # User profile components
├── services/          # Business logic and API services
│   ├── ai-service.ts  # AI provider integration
│   ├── persona-service.ts  # Persona management
│   └── backblaze-service.ts    # Backblaze B2 storage operations
├── store/             # Zustand state stores
│   └── token-store.ts # Token management
└── lib/               # Utility functions and helpers
```

### Key Configuration

**Path Aliases**: Use `@/*` to import from `src/*` directory.

**TypeScript**: Strict mode enabled with bundler module resolution.

**Styling**: Tailwind CSS with CSS custom properties for theming. Dark mode support via `prefers-color-scheme`.

## Development Guidelines

1. **Component Creation**: Place new pages in `src/app/` following Next.js App Router conventions.

2. **API Routes**: Create API endpoints in `src/app/api/` directory.

3. **Styling**: Use Tailwind utility classes. Custom styles go in component-specific CSS modules or update globals.css for app-wide styles.

4. **Type Safety**: TypeScript strict mode is enabled. Always provide proper types for components and functions.

## Project Context

This is the web application for Workfusion.pro AI Agency. The project is in early development stage with the basic Next.js boilerplate setup complete. Documentation and planning materials are available in `public/project_documents/`.

## Backblaze B2 Storage Configuration

### Setup

1. **Create Backblaze B2 Account**:
   - Sign up at https://www.backblaze.com/b2/cloud-storage.html
   - Create a new bucket for avatar storage
   - Generate application keys with read/write permissions

2. **Environment Variables**:
Add to your `.env.local`:
```env
# Backblaze B2 Configuration
B2_KEY_ID=your_application_key_id
B2_APPLICATION_KEY=your_application_key
B2_BUCKET_NAME=workfusion-avatars
B2_BUCKET_ID=your_bucket_id
B2_REGION=us-west-002
B2_ENDPOINT=s3.us-west-002.backblazeb2.com

# Image Processing Options
B2_MAX_IMAGE_SIZE=5242880      # Max size in bytes (5MB)
B2_IMAGE_QUALITY=85            # JPEG/WebP quality
B2_THUMBNAIL_SIZE=150          # Thumbnail size in pixels
```

3. **Bucket Configuration**:
   - Set bucket type to "Public" for avatar images
   - Configure CORS settings if needed for web access
   - Enable lifecycle rules for automatic cleanup (optional)

### Backblaze B2 Service Features

The `backblaze-service.ts` provides:

1. **Avatar Management**:
   - Upload with automatic image processing
   - Resize and optimize images
   - Generate thumbnails
   - Support for JPEG, PNG, WebP, GIF formats

2. **Storage Operations**:
   - Bucket creation and management
   - Public URL generation
   - Presigned URLs for temporary access
   - Bulk operations (delete, copy)

3. **Migration Tools**:
   - Migrate avatars from Supabase to Backblaze B2
   - Migrate from MinIO to Backblaze B2
   - Automatic format conversion
   - Batch migration support

### Production Configuration

1. **Security**:
   - Use restricted application keys
   - Configure bucket policies
   - Enable encryption at rest
   - Set up access controls

2. **Performance**:
   - Use CDN for global distribution
   - Configure caching headers
   - Optimize image formats
   - Implement progressive loading

3. **Monitoring**:
   - Monitor storage usage and costs
   - Set up alerts for quota limits
   - Track API usage and errors
   - Configure backup policies

### API Usage Examples

```typescript
// Upload avatar
const formData = new FormData()
formData.append('file', imageFile)

const response = await fetch(`/api/personas/${personaId}/avatar`, {
  method: 'POST',
  body: formData
})

// Delete avatar
await fetch(`/api/personas/${personaId}/avatar`, {
  method: 'DELETE'
})

// Get avatar URL
const avatar = await fetch(`/api/personas/${personaId}/avatar`).then(r => r.json())
```

### Troubleshooting

1. **Authentication Issues**:
   - Verify application key ID and secret
   - Check bucket permissions
   - Test with Backblaze B2 CLI tools

2. **Upload Failures**:
   - Check file size limits (5MB default)
   - Verify supported formats (JPEG, PNG, WebP, GIF)
   - Review network connectivity
   - Check bucket quotas and billing status

3. **API Issues**:
   - Monitor rate limits (Backblaze B2 limits)
   - Check S3-compatible API endpoint
   - Verify bucket region settings