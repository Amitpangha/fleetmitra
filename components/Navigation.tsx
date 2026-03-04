"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import NotificationsDropdown from "./NotificationsDropdown"
import ThemeToggle from "./ThemeToggle"

export default function Navigation() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/analytics", label: "Analytics", icon: "📈" },
    { href: "/dashboard/vehicles", label: "Vehicles", icon: "🚛" },
    { href: "/dashboard/drivers", label: "Drivers", icon: "👤" },
    { href: "/dashboard/trips", label: "Trips", icon: "🗺️" },
    { href: "/dashboard/expenses", label: "Expenses", icon: "💰" },
    { href: "/dashboard/documents", label: "Documents", icon: "📄" },
  ]

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === href
    }
    return pathname.startsWith(href)
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      <nav className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-lg' : 'bg-white dark:bg-slate-800 shadow-md'
      }`}>
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/dashboard" className="flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-lg font-bold gradient-text-primary">
                  FleetMitra
                </span>
              </Link>
              
              <div className="flex items-center space-x-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(item.href)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    <span className="mr-2 text-lg">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <NotificationsDropdown />
              
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {session?.user?.name ? getInitials(session.user.name) : 'U'}
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-sm font-medium text-slate-900 dark:text-white">{session?.user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{session?.user?.role?.toLowerCase() || 'Owner'}</p>
                  </div>
                  <svg 
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-fadeIn">
                    <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">{session?.user?.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{session?.user?.email}</p>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/dashboard/profile"
                        className="flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <span className="w-6 text-lg">👤</span>
                        <span className="flex-1">My Profile</span>
                      </Link>

                      <Link
                        href="/dashboard/settings"
                        className="flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <span className="w-6 text-lg">⚙️</span>
                        <span className="flex-1">Settings</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false)
                        signOut({ callbackUrl: "/login" })
                      }}
                      className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <span className="w-6 text-lg">🚪</span>
                      <span className="flex-1 text-left">Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <div className="flex justify-between items-center h-14">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                <span className="text-base font-bold gradient-text-primary">
                  FleetMitra
                </span>
              </Link>
              
              <div className="flex items-center space-x-2">
                <ThemeToggle />
                <NotificationsDropdown />
                
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Toggle menu"
                >
                  {isMobileMenuOpen ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {isMobileMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 bg-black/50 z-40"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                
                <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
                  <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base shadow-md">
                        {session?.user?.name ? getInitials(session.user.name) : 'U'}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-white">{session?.user?.name || 'User'}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{session?.user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <div className="py-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                    {navItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-sm ${
                          isActive(item.href)
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span className="w-8 text-lg">{item.icon}</span>
                        <span className="flex-1">{item.label}</span>
                      </Link>
                    ))}

                    <div className="border-t border-slate-200 dark:border-slate-700 my-2"></div>

                    <Link
                      href="/dashboard/profile"
                      className="flex items-center px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="w-8 text-lg">👤</span>
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href="/dashboard/settings"
                      className="flex items-center px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="w-8 text-lg">⚙️</span>
                      <span>Settings</span>
                    </Link>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false)
                        signOut({ callbackUrl: "/login" })
                      }}
                      className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <span className="w-8 text-lg">🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  )
}