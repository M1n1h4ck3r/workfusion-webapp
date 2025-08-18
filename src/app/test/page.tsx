export default function TestPage() {
  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          Test Page Working! ✅
        </h1>
        <p className="text-white/80 mb-8">
          If you can see this, the Next.js app is running correctly.
        </p>
        <div className="glass p-6 rounded-2xl">
          <p className="text-white">
            Server is running on: <span className="text-primary-green font-mono">http://localhost:3005</span>
          </p>
          <p className="text-white/60 text-sm mt-2">
            Main page: <span className="text-primary-yellow font-mono">http://localhost:3005</span>
          </p>
        </div>
      </div>
    </div>
  )
}