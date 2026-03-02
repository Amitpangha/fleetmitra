"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Truck, 
  Package, 
  IndianRupee,
  FileText,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Truck className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">FleetMitra</span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <nav className="p-4 space-y-1">
          <NavItem href="/dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem href="/dashboard/vehicles" icon={Truck} label="Vehicles" />
          <NavItem href="/dashboard/trips" icon={Package} label="Trips" />
          <NavItem href="/dashboard/expenses" icon={IndianRupee} label="Expenses" />
          <NavItem href="/dashboard/documents" icon={FileText} label="Documents" />
          <NavItem href="/dashboard/settings" icon={Settings} label="Settings" />
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t">
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="flex items-center gap-3 ml-auto">
                <span className="text-sm text-gray-600">
                  {session?.user?.name || session?.user?.email}
                </span>
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

function NavItem({ href, icon: Icon, label }: any) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600"
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  )
}