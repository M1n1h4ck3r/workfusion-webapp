import { builderConfig, designTokens } from '@/lib/builder-config'
import fs from 'fs/promises'
import path from 'path'

export class BuilderSyncService {
  private apiKey: string
  private privateKey: string
  private spaceId: string

  constructor() {
    this.apiKey = builderConfig.apiKey
    this.privateKey = builderConfig.privateKey
    this.spaceId = builderConfig.spaceId
  }

  // Sync local components to Builder.io
  async syncComponentsToBuilder() {
    try {
      console.log('Starting component sync to Builder.io...')
      
      // Read component registry
      const registryPath = path.join(process.cwd(), 'src/lib/builder-registry.tsx')
      const registryContent = await fs.readFile(registryPath, 'utf-8')
      
      // Extract component definitions
      const components = this.extractComponentDefinitions(registryContent)
      
      // Sync each component
      for (const component of components) {
        await this.syncSingleComponent(component)
      }
      
      console.log(`Synced ${components.length} components to Builder.io`)
      return { success: true, count: components.length }
    } catch (error) {
      console.error('Component sync failed:', error)
      throw error
    }
  }

  // Sync design tokens to Builder.io
  async syncDesignTokensToBuilder() {
    try {
      console.log('Syncing design tokens to Builder.io...')
      
      const response = await fetch(`https://builder.io/api/v1/spaces/${this.spaceId}/settings`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.privateKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          designTokens: designTokens,
          customTargeting: {
            platform: 'workfusion',
            theme: 'dark'
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Builder API error: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('Design tokens synced successfully')
      return result
    } catch (error) {
      console.error('Design token sync failed:', error)
      throw error
    }
  }

  // Pull content from Builder.io and generate static files
  async pullContentFromBuilder(model: string = 'page') {
    try {
      console.log(`Pulling ${model} content from Builder.io...`)
      
      const response = await fetch(
        `https://cdn.builder.io/api/v2/content/${model}?apiKey=${this.apiKey}&limit=100&includeRefs=true`
      )

      if (!response.ok) {
        throw new Error(`Builder API error: ${response.statusText}`)
      }

      const data = await response.json()
      const content = data.results || []

      // Generate static files for each content entry
      for (const entry of content) {
        await this.generateStaticFile(entry, model)
      }

      console.log(`Generated ${content.length} static files from Builder.io`)
      return { success: true, count: content.length }
    } catch (error) {
      console.error('Content pull failed:', error)
      throw error
    }
  }

  // Generate TypeScript interfaces from Builder.io models
  async generateTypeDefinitions(model: string = 'page') {
    try {
      console.log(`Generating type definitions for ${model}...`)
      
      const response = await fetch(
        `https://builder.io/api/v1/models/${model}`,
        {
          headers: {
            'Authorization': `Bearer ${this.privateKey}`
          }
        }
      )

      if (!response.ok) {
        throw new Error(`Builder API error: ${response.statusText}`)
      }

      const modelData = await response.json()
      const typeDefinition = this.generateTypeScript(modelData)
      
      // Write type definition file
      const typesPath = path.join(process.cwd(), 'src/types', `builder-${model}.ts`)
      await fs.mkdir(path.dirname(typesPath), { recursive: true })
      await fs.writeFile(typesPath, typeDefinition)
      
      console.log(`Generated type definitions: ${typesPath}`)
      return { success: true, path: typesPath }
    } catch (error) {
      console.error('Type generation failed:', error)
      throw error
    }
  }

  // Watch for local file changes and sync to Builder.io
  async startFileWatcher() {
    try {
      const chokidar = await import('chokidar')
      
      const watcher = chokidar.watch([
        'src/components/**/*.tsx',
        'src/lib/builder-registry.tsx',
        'src/app/globals.css'
      ], {
        ignored: /node_modules/,
        persistent: true
      })

      watcher.on('change', async (filePath) => {
        console.log(`File changed: ${filePath}`)
        
        if (filePath.includes('builder-registry.tsx')) {
          await this.syncComponentsToBuilder()
        } else if (filePath.includes('globals.css')) {
          await this.syncDesignTokensToBuilder()
        }
      })

      console.log('File watcher started for Builder.io sync')
      return watcher
    } catch (error) {
      console.error('File watcher setup failed:', error)
      throw error
    }
  }

  private extractComponentDefinitions(registryContent: string): any[] {
    // Parse the registry file to extract component definitions
    // This is a simplified implementation - you might want to use AST parsing
    const components: any[] = []
    const registerMatches = registryContent.match(/Builder\.registerComponent\([^)]+\)/g)
    
    if (registerMatches) {
      for (const match of registerMatches) {
        try {
          // Extract component name and config
          const nameMatch = match.match(/name:\s*'([^']+)'/);
          const friendlyNameMatch = match.match(/friendlyName:\s*'([^']+)'/);
          
          if (nameMatch && friendlyNameMatch) {
            components.push({
              name: nameMatch[1],
              friendlyName: friendlyNameMatch[1],
              config: match
            })
          }
        } catch (error) {
          console.warn('Failed to parse component definition:', error)
        }
      }
    }
    
    return components
  }

  private async syncSingleComponent(component: any) {
    try {
      const response = await fetch(`https://builder.io/api/v1/write/component`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.privateKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: component.name,
          friendlyName: component.friendlyName,
          component: component.config
        })
      })

      if (!response.ok) {
        console.warn(`Failed to sync component ${component.name}: ${response.statusText}`)
      }
    } catch (error) {
      console.warn(`Error syncing component ${component.name}:`, error)
    }
  }

  private async generateStaticFile(entry: any, model: string) {
    try {
      const fileName = this.sanitizeFileName(entry.name || entry.id)
      const filePath = path.join(process.cwd(), 'src/content/builder', model, `${fileName}.json`)
      
      await fs.mkdir(path.dirname(filePath), { recursive: true })
      await fs.writeFile(filePath, JSON.stringify(entry, null, 2))
      
      // Also generate a TypeScript file for type safety
      const tsContent = `
// Auto-generated from Builder.io
export const builderContent = ${JSON.stringify(entry, null, 2)} as const
export type ${this.toPascalCase(fileName)}Content = typeof builderContent
`
      
      const tsFilePath = filePath.replace('.json', '.ts')
      await fs.writeFile(tsFilePath, tsContent)
    } catch (error) {
      console.warn(`Failed to generate static file for ${entry.name}:`, error)
    }
  }

  private generateTypeScript(modelData: any): string {
    const interfaceName = this.toPascalCase(modelData.name)
    
    return `
// Auto-generated from Builder.io model: ${modelData.name}
export interface ${interfaceName}Data {
  id: string
  name: string
  published: 'published' | 'draft' | 'archived'
  data: {
    ${this.generateFieldTypes(modelData.fields || [])}
  }
  createdDate: string
  lastUpdated: string
}

export interface ${interfaceName}Content {
  results: ${interfaceName}Data[]
}
`
  }

  private generateFieldTypes(fields: any[]): string {
    return fields.map(field => {
      const optional = field.required ? '' : '?'
      const type = this.mapBuilderTypeToTS(field.type)
      return `    ${field.name}${optional}: ${type}`
    }).join('\n')
  }

  private mapBuilderTypeToTS(builderType: string): string {
    const typeMap: Record<string, string> = {
      'text': 'string',
      'longText': 'string',
      'number': 'number',
      'boolean': 'boolean',
      'file': 'string',
      'date': 'string',
      'reference': 'any',
      'list': 'any[]',
      'object': 'Record<string, any>'
    }
    
    return typeMap[builderType] || 'any'
  }

  private sanitizeFileName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  private toPascalCase(str: string): string {
    return str
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('')
  }
}

export const builderSyncService = new BuilderSyncService()