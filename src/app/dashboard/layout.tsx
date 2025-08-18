'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { motion } from 'framer-motion'
import {
  Home,
  Bot,
  MessageSquare,
  Phone,
  Mic,
  CreditCard,
  BarChart3,
  Settings,
  User,
  HelpCircle,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  Sparkles,
  History,
  Shield,
  Users
} from 'lucide-react'
import { useAuth } from '@/lib/auth-context'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'AI Playground', href: '/playground', icon: Bot },
  { name: 'WhatsApp', href: '/dashboard/whatsapp', icon: MessageSquare },
  { name: 'Voice Calls', href: '/dashboard/calls', icon: Phone },
  { name: 'Text to Speech', href: '/dashboard/tts', icon: Mic },
  { name: 'Usage History', href: '/dashboard/history', icon: History },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
]

const adminNavigation = [
  { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
  { name: 'AI Personas', href: '/dashboard/admin/personas', icon: Bot },
  { name: 'System Settings', href: '/dashboard/admin/settings', icon: Shield },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Mock user data - replace with actual auth data
  const mockUser = user || {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '',
    tokens: 482,
    role: 'user'
  }

  const isAdmin = mockUser.role === 'admin'

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <motion.div
        className={`hidden lg:flex flex-col glass-strong border-r border-white/10 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 80 }}
      >
        {/* Logo */}
        <div className="p-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-3">
            <Image
              src="/workfusionlogo.png"
              alt="Workfusion"
              width={40}
              height={40}
              className="w-10 h-10"
              priority
            />
            {sidebarOpen && (
              <span className="text-xl font-bold gradient-text">Workfusion</span>
            )}
          </Link>
          
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/60 hover:text-white p-1"
          >
            <ChevronLeft className={`h-5 w-5 transition-transform ${!sidebarOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 pb-4 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-green/20 text-primary-green'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                {sidebarOpen && <span>{item.name}</span>}
              </Link>
            )
          })}
          
          {isAdmin && (
            <>
              {sidebarOpen && (
                <div className="pt-4 pb-2">
                  <p className="text-xs text-white/40 uppercase tracking-wider px-3">Admin</p>
                </div>
              )}
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-orange/20 text-primary-orange'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className={`h-5 w-5 ${sidebarOpen ? 'mr-3' : ''}`} />
                    {sidebarOpen && <span>{item.name}</span>}
                  </Link>
                )
              })}
            </>
          )}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-white/10">
          {sidebarOpen ? (
            <div className="space-y-3">
              <Link href="/dashboard/settings">
                <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10">
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </Button>
              </Link>
              <Link href="/help">
                <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white hover:bg-white/10">
                  <HelpCircle className="mr-3 h-5 w-5" />
                  Help & Support
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <Link href="/dashboard/settings">
                <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/help">
                <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-white/10">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </motion.div>

      {/* Mobile Sidebar */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <motion.div
            className="relative flex-1 flex flex-col max-w-xs w-full glass-strong"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
          >
            <div className="p-4 flex items-center justify-between">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <Image
                  src="/workfusionlogo.png"
                  alt="Workfusion"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                  priority
                />
                <span className="text-xl font-bold gradient-text">Workfusion</span>
              </Link>
              
              <button
                onClick={() => setMobileSidebarOpen(false)}
                className="text-white/60 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex-1 px-4 pb-4 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileSidebarOpen(false)}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-green/20 text-primary-green'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="glass border-b border-white/10 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden text-white/80 hover:text-white"
              >
                <Menu className="h-6 w-6" />
              </button>
              
              <h1 className="text-xl font-semibold text-white">
                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Token Balance */}
              <Badge className="bg-primary-green/20 text-primary-green border-primary-green/30 px-3 py-1">
                <Sparkles className="mr-1 h-4 w-4" />
                {mockUser.tokens} tokens
              </Badge>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                      <AvatarFallback className="bg-gradient-primary text-white">
                        {mockUser.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass border-white/20" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-white">{mockUser.name}</p>
                      <p className="w-[200px] truncate text-sm text-white/60">
                        {mockUser.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="text-white hover:bg-white/10">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/billing" className="text-white hover:bg-white/10">
                      <CreditCard className="mr-2 h-4 w-4" />
                      Billing
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="text-white hover:bg-white/10">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-white/20" />
                  <DropdownMenuItem 
                    className="text-white hover:bg-white/10 cursor-pointer"
                    onClick={() => signOut()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}