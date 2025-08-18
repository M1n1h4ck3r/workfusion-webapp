'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  Home,
  Bot,
  MessageSquare,
  Phone,
  Settings,
  CreditCard,
  BarChart3,
  FileText,
  HelpCircle,
  Users,
  Zap,
  Mic,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  userTokens?: number
  isAdmin?: boolean
}

export function Sidebar({ 
  isCollapsed = false, 
  onToggleCollapse, 
  userTokens = 0,
  isAdmin = false 
}: SidebarProps) {
  const pathname = usePathname()

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      badge: null,
    },
    {
      name: 'AI Playground',
      href: '/playground',
      icon: Bot,
      badge: 'Hot',
    },
    {
      name: 'Conversations',
      href: '/conversations',
      icon: MessageSquare,
      badge: null,
    },
    {
      name: 'Phone Calls',
      href: '/calls',
      icon: Phone,
      badge: null,
    },
    {
      name: 'Text to Speech',
      href: '/tts',
      icon: Mic,
      badge: null,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      name: 'Billing',
      href: '/billing',
      icon: CreditCard,
      badge: null,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      badge: null,
    },
  ]

  const adminNavigation = [
    {
      name: 'Admin Dashboard',
      href: '/admin',
      icon: Zap,
      badge: 'Admin',
    },
    {
      name: 'User Management',
      href: '/admin/users',
      icon: Users,
      badge: null,
    },
    {
      name: 'Content Management',
      href: '/admin/content',
      icon: FileText,
      badge: null,
    },
  ]

  const footerNavigation = [
    {
      name: 'Help & Support',
      href: '/help',
      icon: HelpCircle,
    },
  ]

  return (
    <div
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-dark-surface border-r border-white/10 transition-all duration-300 z-40',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex flex-col h-full">
        {/* Collapse Toggle */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-primary-green/20 text-primary-green border-primary-green/30">
                {userTokens} tokens
              </Badge>
            </div>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className={cn(
                'text-white hover:bg-white/10',
                isCollapsed && 'mx-auto'
              )}
            >
              <ChevronLeft
                className={cn(
                  'h-4 w-4 transition-transform',
                  isCollapsed && 'rotate-180'
                )}
              />
            </Button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {/* Main Navigation */}
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-green/20 text-primary-green'
                      : 'text-white/80 hover:bg-white/10 hover:text-white',
                    isCollapsed && 'justify-center px-2'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      !isCollapsed && 'mr-3'
                    )}
                  />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className="ml-2 bg-primary-orange/20 text-primary-orange border-primary-orange/30 text-xs"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              )
            })}
          </div>

          {/* Admin Navigation */}
          {isAdmin && (
            <div className="pt-4">
              {!isCollapsed && (
                <h3 className="mb-2 px-3 text-xs font-semibold text-white/60 uppercase tracking-wider">
                  Administration
                </h3>
              )}
              <div className="space-y-1">
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary-yellow/20 text-primary-yellow'
                          : 'text-white/80 hover:bg-white/10 hover:text-white',
                        isCollapsed && 'justify-center px-2'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'h-5 w-5 flex-shrink-0',
                          !isCollapsed && 'mr-3'
                        )}
                      />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{item.name}</span>
                          {item.badge && (
                            <Badge
                              variant="secondary"
                              className="ml-2 bg-primary-yellow/20 text-primary-yellow border-primary-yellow/30 text-xs"
                            >
                              {item.badge}
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Footer Navigation */}
        <div className="border-t border-white/10 p-4">
          <div className="space-y-1">
            {footerNavigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-lg px-3 py-2 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors',
                  isCollapsed && 'justify-center px-2'
                )}
              >
                <item.icon
                  className={cn(
                    'h-5 w-5 flex-shrink-0',
                    !isCollapsed && 'mr-3'
                  )}
                />
                {!isCollapsed && <span>{item.name}</span>}
              </Link>
            ))}
          </div>

          {/* Token Recharge CTA */}
          {!isCollapsed && userTokens < 100 && (
            <div className="mt-4 p-3 bg-primary-orange/20 border border-primary-orange/30 rounded-lg">
              <p className="text-xs text-primary-orange font-medium">
                Low on tokens?
              </p>
              <Link href="/billing">
                <Button size="sm" className="w-full mt-2 bg-primary-orange hover:bg-primary-orange/80">
                  Recharge Now
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}