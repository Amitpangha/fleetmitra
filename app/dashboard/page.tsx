"use client"

import { useSession } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Truck, Package, IndianRupee, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  const { data: session } = useSession()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Welcome, {session?.user?.name || session?.user?.email}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Vehicles"
          value="12"
          icon={Truck}
          change="+2 this month"
          color="blue"
        />
        <StatCard 
          title="Active Trips"
          value="5"
          icon={Package}
          change="3 in transit"
          color="green"
        />
        <StatCard 
          title="Monthly Revenue"
          value="₹8.4L"
          icon={IndianRupee}
          change="+12% vs last month"
          color="purple"
        />
        <StatCard 
          title="Expenses"
          value="₹2.3L"
          icon={TrendingUp}
          change="5% under budget"
          color="orange"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Trips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1,2,3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">Mumbai → Delhi</p>
                    <p className="text-sm text-gray-500">MH12AB1234 • 2h 30m left</p>
                  </div>
                  <span className="text-sm font-medium">₹45,000</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <QuickAction icon={Truck} label="Add Vehicle" href="/dashboard/vehicles/new" />
              <QuickAction icon={Package} label="New Trip" href="/dashboard/trips/new" />
              <QuickAction icon={IndianRupee} label="Add Expense" href="/dashboard/expenses/new" />
              <QuickAction icon={FileText} label="Upload Doc" href="/dashboard/documents/upload" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon: Icon, change, color }: any) {
  const colors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600'
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold mb-2">{value}</p>
        <p className="text-xs text-gray-500">{change}</p>
      </CardContent>
    </Card>
  )
}

function QuickAction({ icon: Icon, label, href }: any) {
  return (
    <Link
      href={href}
      className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100"
    >
      <Icon className="h-5 w-5 mb-2 text-gray-700" />
      <span className="text-xs text-gray-700">{label}</span>
    </Link>
  )
}