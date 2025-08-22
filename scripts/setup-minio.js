#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const question = (query) => new Promise(resolve => rl.question(query, resolve))

console.log('=================================================')
console.log('🚀 MinIO Configuration Setup for WorkFusion')
console.log('=================================================\n')

async function setupMinIO() {
  try {
    // Check current configuration
    const envPath = path.join(process.cwd(), '.env.local')
    let envContent = ''
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8')
      console.log('✅ Found existing .env.local file\n')
    } else {
      console.log('⚠️  No .env.local file found. Creating new one...\n')
    }

    console.log('Please provide your MinIO server details:\n')

    // Get MinIO endpoint
    const currentEndpoint = envContent.match(/MINIO_ENDPOINT=(.*)/)?.[1] || '103.214.111.115'
    const endpoint = await question(`MinIO Server IP/Domain [${currentEndpoint}]: `) || currentEndpoint

    // Get MinIO port
    const currentPort = envContent.match(/MINIO_PORT=(.*)/)?.[1] || '9000'
    const port = await question(`MinIO API Port [${currentPort}]: `) || currentPort

    // Get SSL configuration
    const currentSSL = envContent.match(/MINIO_USE_SSL=(.*)/)?.[1] || 'false'
    const useSSL = await question(`Use SSL/HTTPS? (true/false) [${currentSSL}]: `) || currentSSL

    console.log('\n⚠️  IMPORTANT: Never use default credentials in production!\n')

    // Check if using default credentials
    const currentAccessKey = envContent.match(/MINIO_ACCESS_KEY=(.*)/)?.[1] || 'minioadmin'
    const currentSecretKey = envContent.match(/MINIO_SECRET_KEY=(.*)/)?.[1] || 'minioadmin'

    if (currentAccessKey === 'minioadmin' || currentSecretKey === 'minioadmin') {
      console.log('🔴 WARNING: You are using default MinIO credentials!')
      console.log('This is a security risk. Please change them immediately.\n')
    }

    // Get credentials
    console.log('Enter your MinIO credentials (or press Enter to keep current):\n')
    
    const accessKey = await question(`Access Key [${currentAccessKey.substring(0, 8)}...]: `) || currentAccessKey
    const secretKey = await question(`Secret Key [${currentSecretKey.substring(0, 8)}...]: `) || currentSecretKey

    // Generate secure credentials option
    if (accessKey === 'minioadmin' || secretKey === 'minioadmin') {
      const generateNew = await question('\nGenerate secure credentials? (y/n) [y]: ') || 'y'
      
      if (generateNew.toLowerCase() === 'y') {
        const newAccessKey = crypto.randomBytes(20).toString('hex')
        const newSecretKey = crypto.randomBytes(40).toString('hex')
        
        console.log('\n🔐 Generated secure credentials:')
        console.log('=' .repeat(50))
        console.log(`Access Key: ${newAccessKey}`)
        console.log(`Secret Key: ${newSecretKey}`)
        console.log('=' .repeat(50))
        console.log('\n⚠️  SAVE THESE CREDENTIALS! They will be added to .env.local\n')
        
        const useGenerated = await question('Use these generated credentials? (y/n) [y]: ') || 'y'
        
        if (useGenerated.toLowerCase() === 'y') {
          envContent = updateEnvVariable(envContent, 'MINIO_ACCESS_KEY', newAccessKey)
          envContent = updateEnvVariable(envContent, 'MINIO_SECRET_KEY', newSecretKey)
        }
      }
    } else {
      envContent = updateEnvVariable(envContent, 'MINIO_ACCESS_KEY', accessKey)
      envContent = updateEnvVariable(envContent, 'MINIO_SECRET_KEY', secretKey)
    }

    // Get bucket name
    const currentBucket = envContent.match(/MINIO_BUCKET_NAME=(.*)/)?.[1] || 'persona-avatars'
    const bucketName = await question(`\nBucket Name [${currentBucket}]: `) || currentBucket

    // Update all MinIO variables
    envContent = updateEnvVariable(envContent, 'MINIO_ENDPOINT', endpoint)
    envContent = updateEnvVariable(envContent, 'MINIO_PORT', port)
    envContent = updateEnvVariable(envContent, 'MINIO_USE_SSL', useSSL)
    envContent = updateEnvVariable(envContent, 'MINIO_BUCKET_NAME', bucketName)
    envContent = updateEnvVariable(envContent, 'MINIO_REGION', 'us-east-1')
    envContent = updateEnvVariable(envContent, 'MINIO_CONSOLE_PORT', '9001')
    
    // Set public URL
    const protocol = useSSL === 'true' ? 'https' : 'http'
    const publicUrl = `${protocol}://${endpoint}:${port}`
    envContent = updateEnvVariable(envContent, 'MINIO_PUBLIC_URL', publicUrl)
    
    // Set image processing defaults
    envContent = updateEnvVariable(envContent, 'MINIO_MAX_IMAGE_SIZE', '5242880')
    envContent = updateEnvVariable(envContent, 'MINIO_IMAGE_QUALITY', '85')
    envContent = updateEnvVariable(envContent, 'MINIO_THUMBNAIL_SIZE', '150')

    // Save configuration
    fs.writeFileSync(envPath, envContent)
    console.log('\n✅ Configuration saved to .env.local\n')

    // Test connection
    console.log('Testing MinIO connection...\n')
    
    const testConnection = await testMinIOConnection({
      endPoint: endpoint,
      port: parseInt(port),
      useSSL: useSSL === 'true',
      accessKey: envContent.match(/MINIO_ACCESS_KEY=(.*)/)?.[1],
      secretKey: envContent.match(/MINIO_SECRET_KEY=(.*)/)?.[1]
    })

    if (testConnection) {
      console.log('✅ Successfully connected to MinIO!\n')
      
      // Instructions
      console.log('=================================================')
      console.log('📋 Next Steps:')
      console.log('=================================================')
      console.log('1. Access MinIO Console:')
      console.log(`   ${protocol}://${endpoint}:9001`)
      console.log('\n2. Login with your credentials')
      console.log('\n3. Create bucket (if not exists):')
      console.log(`   - Name: ${bucketName}`)
      console.log('   - Set public read policy')
      console.log('\n4. Restart your Next.js development server:')
      console.log('   npm run dev')
      console.log('\n5. Test avatar upload at:')
      console.log('   http://localhost:3003/dashboard/admin/personas')
      console.log('=================================================\n')
    } else {
      console.log('⚠️  Could not connect to MinIO. Please check:')
      console.log('   - MinIO server is running')
      console.log('   - Credentials are correct')
      console.log('   - Network/firewall allows connection')
      console.log('   - Ports 9000 and 9001 are open\n')
    }

  } catch (error) {
    console.error('Error:', error.message)
  } finally {
    rl.close()
  }
}

function updateEnvVariable(content, key, value) {
  const regex = new RegExp(`^${key}=.*$`, 'gm')
  const newLine = `${key}=${value}`
  
  if (content.match(regex)) {
    return content.replace(regex, newLine)
  } else {
    // Add to MinIO section or end of file
    const minioSection = content.indexOf('# MinIO Server Configuration')
    if (minioSection !== -1) {
      const lines = content.split('\n')
      let insertIndex = lines.findIndex(line => line.includes('# MinIO Server Configuration'))
      
      // Find the end of MinIO section
      for (let i = insertIndex + 1; i < lines.length; i++) {
        if (lines[i].startsWith('#') && !lines[i].includes('MinIO')) {
          insertIndex = i - 1
          break
        }
        if (lines[i].includes(key)) {
          return content // Already exists
        }
      }
      
      lines.splice(insertIndex + 1, 0, newLine)
      return lines.join('\n')
    } else {
      // Add MinIO section
      return content + '\n\n# MinIO Server Configuration\n' + newLine
    }
  }
}

async function testMinIOConnection(config) {
  try {
    const Minio = require('minio')
    
    const client = new Minio.Client({
      endPoint: config.endPoint,
      port: config.port,
      useSSL: config.useSSL,
      accessKey: config.accessKey,
      secretKey: config.secretKey
    })

    return new Promise((resolve) => {
      client.listBuckets((err, buckets) => {
        if (err) {
          console.error('Connection failed:', err.message)
          resolve(false)
        } else {
          console.log('✅ Connected! Found', buckets.length, 'bucket(s)')
          buckets.forEach(bucket => {
            console.log('   -', bucket.name)
          })
          resolve(true)
        }
      })
    })
  } catch (error) {
    console.error('MinIO client not installed. Run: npm install minio')
    return false
  }
}

// Run setup
setupMinIO()