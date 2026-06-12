'use client'

import { useState } from 'react'
import { Menu, X, Wallet, ArrowRightLeft, Settings, LayoutDashboard, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { supabase } from '@/utils/supabase/client'
import { redirect } from 'next/navigation'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(false)
  
  const pathname = usePathname()
  //const isDashboardPage = pathname.startsWith('/dashboard')

  console.log('pathname', pathname.split('/')[pathname.split('/').length - 1])

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) console.error(error)
    console.log("Signed out")
    redirect('/auth/login')
  }

  const navItems = [
    {
      label: 'Wallet',
      href: '/dashboard/wallet',
      icon: Wallet,
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Transactions',
      href: '/dashboard/transactions',
      icon: ArrowRightLeft,
    },
    {
      label: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 bg-background border-b border-border/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo/Branding */}
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 group transition-all duration-200 hover:-translate-y-1"
            >
              <div className="w-10 h-10 rounded-md bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-200">
                <span className="text-primary-foreground font-bold text-base">W</span>
              </div>
              <span className="hidden sm:inline font-semibold text-foreground text-sm tracking-tight">
                Dashboard
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-0.5">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`relative group ${item.href.split('/')[item.href.split('/').length - 1] === pathname.split('/')[pathname.split('/').length - 1] ? 'bg-muted/40' : ''} px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors duration-200 flex items-center gap-2 rounded-md hover:bg-muted/40 active:bg-muted/60`}
                  >
                    <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Desktop Action Button */}
            <div className="hidden md:flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted/40 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary/50"
              aria-expanded={isOpen}
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {isOpen ? (
                <X className="w-5 h-5" strokeWidth={2.5} />
              ) : (
                <Menu className="w-5 h-5" strokeWidth={2.5} />
              )}
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isOpen && (
            <div className="md:hidden border-t border-border/20 bg-muted/20 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-2 py-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="block px-4 py-3 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors duration-200 flex items-center gap-3 active:bg-muted/60"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
                
                {/* Mobile Logout Button */}
                <div className="px-4 py-3 border-t border-border/20 mt-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 text-sm font-medium text-destructive/80 hover:text-destructive py-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto sm:px-6 sm:py-8">
        {children}
      </main>
    </div>
  )
}