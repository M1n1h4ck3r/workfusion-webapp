# Builder.io Integration Guide

Complete integration of Builder.io with the Workfusion platform for visual content management and bidirectional synchronization.

## 🚀 Features

### ✅ Component Registration
- All Workfusion UI components registered in Builder.io
- Custom components with proper input configurations
- Design system integration with Builder.io editor

### ✅ Design Token Synchronization
- Automatic sync of color palette, spacing, typography
- Theme configuration for consistent styling
- Custom CSS classes and utilities

### ✅ Bidirectional Sync
- Real-time webhook integration
- File watching for automatic updates
- CLI tools for manual synchronization

### ✅ Development Tools
- Interactive test page at `/builder`
- CLI commands for all operations
- Type generation from Builder.io models

## 📋 Setup Instructions

### 1. Install Dependencies
```bash
npm install @builder.io/react @builder.io/sdk
npm install --save-dev commander inquirer chokidar @types/inquirer
```

### 2. Environment Configuration
Copy `.env.builder.example` to `.env.local` and configure:

```env
# Required: Get these from Builder.io account settings
NEXT_PUBLIC_BUILDER_API_KEY=your-public-api-key
BUILDER_PRIVATE_KEY=your-private-key
NEXT_PUBLIC_BUILDER_SPACE_ID=your-space-id

# Optional: For webhook security
BUILDER_WEBHOOK_SECRET=your-webhook-secret

# Auto-generated
NEXT_PUBLIC_BUILDER_MODEL_NAME=page
NEXT_PUBLIC_BUILDER_ENV=development
REVALIDATE_SECRET=auto-generated-secret
```

### 3. Builder.io Account Setup

1. **Create Account**: Sign up at [builder.io](https://builder.io)
2. **Get API Keys**: 
   - Go to Account Settings → API Keys
   - Copy Public API Key and Private Key
   - Note your Space ID from the URL
3. **Create Models**: Set up content models (page, section, etc.)
4. **Configure Webhooks**: Point to `your-domain.com/api/builder/webhook`

### 4. Initial Sync
```bash
# Run the interactive setup
npm run builder:setup

# Sync components and design tokens
npm run builder:sync-all

# Start file watcher for automatic sync
npm run builder:watch
```

## 🔧 CLI Commands

### Setup and Configuration
```bash
npm run builder:setup              # Interactive setup wizard
npm run builder:sync-all           # Sync components + tokens
```

### Component Management
```bash
npm run builder:sync-components    # Sync components to Builder.io
npm run builder:sync-tokens        # Sync design tokens
```

### Content Management
```bash
npm run builder:pull-content       # Pull content from Builder.io
npm run builder:generate-types     # Generate TypeScript types
```

### Development
```bash
npm run builder:watch              # Watch files for changes
```

## 📁 File Structure

```
src/
├── lib/
│   ├── builder-config.ts          # Configuration and design tokens
│   └── builder-registry.tsx       # Component registration
├── components/
│   └── builder/
│       └── BuilderPage.tsx        # Builder.io page component
├── services/
│   └── builder-sync-service.ts    # Synchronization service
├── app/
│   ├── builder/
│   │   └── page.tsx               # Test page
│   └── api/
│       ├── builder/
│       │   ├── webhook/route.ts   # Webhook handler
│       │   └── sync/route.ts      # Sync API
│       └── revalidate/route.ts    # Cache revalidation
└── scripts/
    └── builder-cli.js             # CLI commands
```

## 🎨 Registered Components

### UI Components
- **WorkfusionButton**: Customizable button with variants
- **WorkfusionBadge**: Status and label badges
- **WorkfusionProgress**: Progress bars and indicators

### Layout Components
- **WorkfusionGlassCard**: Glass morphism containers
- **WorkfusionGrid**: Responsive grid layouts
- **WorkfusionGradientBackground**: Gradient containers

### Advanced Components
- **WorkfusionChatInterface**: AI chat interface
- **WorkfusionCollaborationPanel**: Real-time collaboration
- **WorkfusionAvatarUpload**: File upload with processing

## 🔄 Synchronization Workflow

### Builder.io → Codebase
1. **Content Changes**: Webhooks trigger at `/api/builder/webhook`
2. **Cache Revalidation**: Automatic page revalidation
3. **Type Generation**: Optional TypeScript type updates
4. **File Generation**: Static file creation for SSG

### Codebase → Builder.io
1. **File Watching**: Automatic detection of component changes
2. **Component Sync**: Registry updates pushed to Builder.io
3. **Token Sync**: Design system updates
4. **Manual Sync**: CLI commands for specific operations

## 🎯 Usage Examples

### Using BuilderPage Component
```tsx
import { BuilderPage } from '@/components/builder/BuilderPage'

export default function DynamicPage() {
  return <BuilderPage model="page" url="/my-page" />
}
```

### Using Builder Content Hook
```tsx
import { useBuilderContent } from '@/components/builder/BuilderPage'

function MyComponent() {
  const { content, isLoading, error } = useBuilderContent('page', '/my-page')
  
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  
  return <BuilderPage content={content} />
}
```

### Fetching Content Server-Side
```tsx
import { builder } from '@builder.io/sdk'

export async function generateStaticProps() {
  const content = await builder
    .get('page', { url: '/my-page' })
    .toPromise()
    
  return {
    props: { builderContent: content }
  }
}
```

## 🚦 Testing

### 1. Visit Test Page
Navigate to `/builder` to access the integration test page:
- Component showcase
- Sync testing
- Integration status
- Setup validation

### 2. Builder.io Editor
1. Open Builder.io dashboard
2. Create new content
3. Use registered Workfusion components
4. Preview and publish

### 3. Webhook Testing
```bash
# Test webhook endpoint
curl -X POST http://localhost:3000/api/builder/webhook \
  -H "Content-Type: application/json" \
  -d '{"type":"content.published","data":{"name":"test"}}'
```

## 🔒 Security

### API Key Management
- Store keys in environment variables only
- Never commit keys to version control
- Use different keys for development/production

### Webhook Security
- Verify webhook signatures
- Use HTTPS in production
- Implement rate limiting

### Content Validation
- Sanitize Builder.io content
- Validate component props
- Implement CSP headers

## 🐛 Troubleshooting

### Common Issues

**1. API Key Errors**
```
Error: Invalid API key
```
- Verify API key in `.env.local`
- Check Builder.io account settings
- Ensure key has correct permissions

**2. Component Not Showing**
```
Component not found in Builder.io
```
- Run `npm run builder:sync-components`
- Check component registration in `builder-registry.tsx`
- Verify Builder.io space ID

**3. Webhook Not Working**
```
Webhook signature verification failed
```
- Check webhook secret in environment
- Verify webhook URL in Builder.io settings
- Test endpoint manually

**4. Build Errors**
```
Module not found: @builder.io/react
```
- Install missing dependencies
- Clear node_modules and reinstall
- Check TypeScript configuration

### Debug Mode
Enable debug logging:
```env
DEBUG=builder:*
NEXT_PUBLIC_BUILDER_DEBUG=true
```

## 📚 Resources

### Documentation
- [Builder.io Docs](https://www.builder.io/c/docs)
- [React SDK Guide](https://www.builder.io/c/docs/developers/react)
- [API Reference](https://www.builder.io/c/docs/api-reference)

### Examples
- [Next.js Integration](https://github.com/BuilderIO/builder/tree/main/examples/next-js)
- [Component Registration](https://www.builder.io/c/docs/custom-components)
- [Webhooks Setup](https://www.builder.io/c/docs/webhooks)

## 🔄 Updates and Maintenance

### Keeping Integration Updated
```bash
# Update Builder.io packages
npm update @builder.io/react @builder.io/sdk

# Sync latest components
npm run builder:sync-all

# Regenerate types
npm run builder:generate-types
```

### Monitoring
- Check webhook logs regularly
- Monitor sync failures
- Validate content integrity
- Performance metrics

## 🎉 Next Steps

1. **Set up Builder.io account** and get API keys
2. **Configure environment variables** using the setup command
3. **Sync components** with `npm run builder:sync-all`
4. **Create content** in Builder.io using Workfusion components
5. **Test integration** using the `/builder` page
6. **Set up webhooks** for real-time sync
7. **Deploy** with environment variables configured

The integration is now ready for visual content management with full bidirectional synchronization between Builder.io and your Workfusion codebase!