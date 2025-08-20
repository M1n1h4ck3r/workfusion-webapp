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
- **Object Storage**: MinIO for avatar images and file uploads
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
│   └── minio-service.ts    # MinIO storage operations
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

## MinIO Setup and Configuration

### Installation

1. **Using Docker (Recommended)**:
```bash
# Run MinIO container
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  -v ~/minio/data:/data \
  quay.io/minio/minio server /data --console-address ":9001"
```

2. **Using Binary (Alternative)**:
```bash
# Download MinIO binary
wget https://dl.min.io/server/minio/release/linux-amd64/minio
chmod +x minio

# Run MinIO server
./minio server ~/minio/data --console-address :9001
```

### Configuration

1. **Environment Variables**:
Copy `.env.minio.example` to `.env.local` and update:
```env
# MinIO Server Configuration
MINIO_ENDPOINT=localhost           # MinIO server endpoint
MINIO_PORT=9000                   # API port
MINIO_USE_SSL=false              # Use HTTPS
MINIO_ACCESS_KEY=minioadmin      # Access key
MINIO_SECRET_KEY=minioadmin      # Secret key
MINIO_BUCKET_NAME=persona-avatars # Bucket name
MINIO_REGION=us-east-1           # AWS S3 region

# MinIO Console (optional)
MINIO_CONSOLE_PORT=9001          # Web UI port

# Public URL Configuration
MINIO_PUBLIC_URL=http://localhost:9000  # Full URL for serving images

# Image Processing Options
MINIO_MAX_IMAGE_SIZE=5242880    # Max size in bytes (5MB)
MINIO_IMAGE_QUALITY=85           # JPEG/WebP quality
MINIO_THUMBNAIL_SIZE=150         # Thumbnail size in pixels
```

2. **Access MinIO Console**:
- URL: `http://localhost:9001`
- Username: `minioadmin`
- Password: `minioadmin`

### MinIO Service Features

The `minio-service.ts` provides:

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
   - Migrate avatars from Supabase to MinIO
   - Automatic format conversion
   - Batch migration support

### Production Deployment

1. **Security**:
   - Change default credentials
   - Enable SSL/TLS
   - Configure firewall rules
   - Set up access policies

2. **High Availability**:
   - Deploy MinIO in distributed mode
   - Use multiple drives/nodes
   - Configure load balancer
   - Set up data replication

3. **Monitoring**:
   - Enable metrics endpoint
   - Configure Prometheus/Grafana
   - Set up alerts
   - Monitor storage usage

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

1. **Connection Issues**:
   - Verify MinIO is running: `docker ps` or `ps aux | grep minio`
   - Check ports: `netstat -an | grep 9000`
   - Test connectivity: `curl http://localhost:9000/minio/health/live`

2. **Permission Errors**:
   - Check bucket policy settings
   - Verify access/secret keys
   - Review CORS configuration

3. **Image Upload Failures**:
   - Check file size limits
   - Verify supported formats
   - Review MinIO logs: `docker logs minio`