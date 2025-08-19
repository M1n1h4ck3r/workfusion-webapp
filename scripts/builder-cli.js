#!/usr/bin/env node

const { builderSyncService } = require('../src/services/builder-sync-service.ts')
const { program } = require('commander')

program
  .name('builder-cli')
  .description('CLI for Builder.io integration with Workfusion')
  .version('1.0.0')

program
  .command('sync-components')
  .description('Sync local components to Builder.io')
  .action(async () => {
    try {
      console.log('🔄 Syncing components to Builder.io...')
      const result = await builderSyncService.syncComponentsToBuilder()
      console.log(`✅ Successfully synced ${result.count} components`)
    } catch (error) {
      console.error('❌ Component sync failed:', error.message)
      process.exit(1)
    }
  })

program
  .command('sync-tokens')
  .description('Sync design tokens to Builder.io')
  .action(async () => {
    try {
      console.log('🎨 Syncing design tokens to Builder.io...')
      await builderSyncService.syncDesignTokensToBuilder()
      console.log('✅ Design tokens synced successfully')
    } catch (error) {
      console.error('❌ Token sync failed:', error.message)
      process.exit(1)
    }
  })

program
  .command('pull-content')
  .description('Pull content from Builder.io and generate static files')
  .option('-m, --model <model>', 'Builder.io model name', 'page')
  .action(async (options) => {
    try {
      console.log(`📥 Pulling ${options.model} content from Builder.io...`)
      const result = await builderSyncService.pullContentFromBuilder(options.model)
      console.log(`✅ Generated ${result.count} static files`)
    } catch (error) {
      console.error('❌ Content pull failed:', error.message)
      process.exit(1)
    }
  })

program
  .command('generate-types')
  .description('Generate TypeScript types from Builder.io models')
  .option('-m, --model <model>', 'Builder.io model name', 'page')
  .action(async (options) => {
    try {
      console.log(`📝 Generating types for ${options.model} model...`)
      const result = await builderSyncService.generateTypeDefinitions(options.model)
      console.log(`✅ Types generated: ${result.path}`)
    } catch (error) {
      console.error('❌ Type generation failed:', error.message)
      process.exit(1)
    }
  })

program
  .command('watch')
  .description('Watch for file changes and auto-sync to Builder.io')
  .action(async () => {
    try {
      console.log('👀 Starting file watcher for Builder.io sync...')
      await builderSyncService.startFileWatcher()
      console.log('✅ File watcher started. Press Ctrl+C to stop.')
      
      // Keep the process running
      process.on('SIGINT', () => {
        console.log('\n👋 File watcher stopped')
        process.exit(0)
      })
    } catch (error) {
      console.error('❌ File watcher failed:', error.message)
      process.exit(1)
    }
  })

program
  .command('setup')
  .description('Setup Builder.io integration')
  .action(async () => {
    const inquirer = await import('inquirer')
    
    console.log('🚀 Setting up Builder.io integration...\n')
    
    const answers = await inquirer.default.prompt([
      {
        type: 'input',
        name: 'apiKey',
        message: 'Enter your Builder.io Public API Key:',
        validate: (input) => input.length > 0 || 'API Key is required'
      },
      {
        type: 'input',
        name: 'privateKey',
        message: 'Enter your Builder.io Private Key:',
        validate: (input) => input.length > 0 || 'Private Key is required'
      },
      {
        type: 'input',
        name: 'spaceId',
        message: 'Enter your Builder.io Space ID:',
        validate: (input) => input.length > 0 || 'Space ID is required'
      },
      {
        type: 'input',
        name: 'webhookSecret',
        message: 'Enter your Webhook Secret (optional):',
        default: ''
      }
    ])
    
    // Write environment variables
    const fs = require('fs')
    const path = require('path')
    
    const envContent = `
# Builder.io Configuration
NEXT_PUBLIC_BUILDER_API_KEY=${answers.apiKey}
BUILDER_PRIVATE_KEY=${answers.privateKey}
NEXT_PUBLIC_BUILDER_SPACE_ID=${answers.spaceId}
BUILDER_WEBHOOK_SECRET=${answers.webhookSecret}
NEXT_PUBLIC_BUILDER_MODEL_NAME=page
NEXT_PUBLIC_BUILDER_ENV=development

# Revalidation Secret (generate random string)
REVALIDATE_SECRET=${Math.random().toString(36).substring(2, 15)}
`
    
    const envPath = path.join(process.cwd(), '.env.local')
    const existingEnv = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf-8') : ''
    
    if (existingEnv.includes('NEXT_PUBLIC_BUILDER_API_KEY')) {
      // Update existing env file
      let updatedEnv = existingEnv
      updatedEnv = updatedEnv.replace(/NEXT_PUBLIC_BUILDER_API_KEY=.*\n/, `NEXT_PUBLIC_BUILDER_API_KEY=${answers.apiKey}\n`)
      updatedEnv = updatedEnv.replace(/BUILDER_PRIVATE_KEY=.*\n/, `BUILDER_PRIVATE_KEY=${answers.privateKey}\n`)
      updatedEnv = updatedEnv.replace(/NEXT_PUBLIC_BUILDER_SPACE_ID=.*\n/, `NEXT_PUBLIC_BUILDER_SPACE_ID=${answers.spaceId}\n`)
      
      if (answers.webhookSecret) {
        updatedEnv = updatedEnv.replace(/BUILDER_WEBHOOK_SECRET=.*\n/, `BUILDER_WEBHOOK_SECRET=${answers.webhookSecret}\n`)
      }
      
      fs.writeFileSync(envPath, updatedEnv)
    } else {
      // Append to existing env file
      fs.writeFileSync(envPath, existingEnv + envContent)
    }
    
    console.log('✅ Environment variables saved to .env.local')
    console.log('✅ Builder.io integration setup complete!')
    console.log('\nNext steps:')
    console.log('1. Restart your development server')
    console.log('2. Run "npm run builder:sync-components" to sync your components')
    console.log('3. Visit /builder to test the integration')
  })

program.parse()

module.exports = { program }