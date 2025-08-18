import Link from 'next/link'

export default function MinimalPage() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0A0A0A',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        ✅ Server is Working!
      </h1>
      <p style={{ fontSize: '1.5rem', opacity: 0.9, marginBottom: '2rem' }}>
        Minimal test page - No external dependencies
      </p>
      <div style={{ 
        padding: '2rem',
        backgroundColor: 'rgba(74, 222, 128, 0.1)',
        border: '2px solid rgba(74, 222, 128, 0.5)',
        borderRadius: '1rem'
      }}>
        <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>
          Server: <span style={{ color: '#4ADE80', fontFamily: 'monospace' }}>http://localhost:3006</span>
        </p>
        <p style={{ fontSize: '1rem', opacity: 0.8 }}>
          Time: {new Date().toLocaleTimeString()}
        </p>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/" style={{ 
          color: '#4ADE80',
          textDecoration: 'underline',
          fontSize: '1.2rem'
        }}>
          Go to Main Page →
        </Link>
      </div>
    </div>
  )
}