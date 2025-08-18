'use client'

import { withAuth } from '@/lib/auth-context'

function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

export default withAuth(AdminLayout, true)