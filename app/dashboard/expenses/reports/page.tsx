"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { 
  ArrowLeft,
  Download,
  Calendar,
  IndianRupee,
  Fuel,
  MapPin,
  Wrench,
  CreditCard,
  PieChart,
  TrendingUp,
  TrendingDown,
  BarChart3
} from "lucide-react"
import { Button } from "@/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts"
import toast from "react-hot-toast"

interface ExpenseSummary {
  total: number
  byType: {
    Fuel: number
    Toll: number
    Maintenance: number
    "Driver Advance": number
    Other: number
  }
  byVehicle: Array<{
    registration: string
    amount: number
  }>
  monthlyData: Array<{
    month: string
    amount: number
  }>
  averagePerTrip: number
  percentageChange: number
}

export default function ExpenseReportsPage() {
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<"week" | "month" | "quarter" | "year">("month")
  const [summary, setSummary] = useState<ExpenseSummary>({
    total: 245800,
    byType: {
      Fuel: 125000,
      Toll: 45800,
      Maintenance: 52000,
      "Driver Advance": 18000,
      Other: 5000
    },
    byVehicle: [
      { registration: "MH12AB1234", amount: 85600 },
      { registration: "DL5CQ9876", amount: 62300 },
      { registration: "GJ01XY5678", amount: 47900 },
      { registration: "TN01AB1234", amount: 32500 },
      { registration: "KA03MN9012", amount: 17500 }
    ],
    monthlyData: [
      { month: "Jan", amount: 18500 },
      { month: "Feb", amount: 21200 },
      { month: "Mar", amount: 24800 },
      { month: "Apr", amount: 23500 },
      { month: "May", amount: 28900 },
      { month: "Jun", amount: 31200 },
      { month: "Jul", amount: 29800 },
      { month: "Aug", amount: 32400 },
      { month: "Sep", amount: 35600 },
      { month: "Oct", amount: 37800 },
      { month: "Nov", amount: 41200 },
      { month: "Dec", amount: 44500 }
    ],
    averagePerTrip: 4250,
    percentageChange: 12.5
  })

  useEffect(() => {
    fetchData()
  }, [period])

  const fetchData = async () => {
    try {
      setLoading(true)
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      toast.error("Failed to fetch report data")
    } finally {
      setLoading(false)
    }
  }

  const exportReport = () => {
    toast.success("Report downloaded")
  }

  const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ef4444']

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const pieData = Object.entries(summary.byType).map(([name, value]) => ({
    name,
    value
  }))

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/expenses"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Expenses
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Expense Reports</h1>
          <p className="text-gray-500 mt-1">Analyze your expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as any)}
            className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">Last 7 days</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.total)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Avg per Trip</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.averagePerTrip)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Fuel Cost</p>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(summary.byType.Fuel)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">vs Last Period</p>
            <div className="flex items-center gap-2">
              <p className="text-2xl font-bold text-green-600">{summary.percentageChange}%</p>
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Expense Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={summary.monthlyData}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `₹${(value/1000)}K`} />
                  <Tooltip 
                    formatter={(value: any) => formatCurrency(value)}
                    labelFormatter={(label) => `Month: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#3b82f6" 
                    fill="url(#colorAmount)" 
                    name="Expenses"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown by Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle-wise Expenses */}
        <Card>
          <CardHeader>
            <CardTitle>Top Vehicles by Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary.byVehicle}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="registration" />
                  <YAxis tickFormatter={(value) => `₹${(value/1000)}K`} />
                  <Tooltip formatter={(value: any) => formatCurrency(value)} />
                  <Bar dataKey="amount" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Expense Categories Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <CategoryBar 
                label="Fuel" 
                amount={summary.byType.Fuel} 
                total={summary.total}
                color="bg-orange-500"
                icon={<Fuel className="h-4 w-4" />}
              />
              <CategoryBar 
                label="Maintenance" 
                amount={summary.byType.Maintenance} 
                total={summary.total}
                color="bg-yellow-500"
                icon={<Wrench className="h-4 w-4" />}
              />
              <CategoryBar 
                label="Toll" 
                amount={summary.byType.Toll} 
                total={summary.total}
                color="bg-purple-500"
                icon={<MapPin className="h-4 w-4" />}
              />
              <CategoryBar 
                label="Driver Advance" 
                amount={summary.byType["Driver Advance"]} 
                total={summary.total}
                color="bg-blue-500"
                icon={<CreditCard className="h-4 w-4" />}
              />
              <CategoryBar 
                label="Other" 
                amount={summary.byType.Other} 
                total={summary.total}
                color="bg-gray-500"
                icon={<IndianRupee className="h-4 w-4" />}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights Section */}
      <Card>
        <CardHeader>
          <CardTitle>Expense Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-green-700">Lowest Month</h3>
              </div>
              <p className="text-2xl font-bold text-green-700">₹18,500</p>
              <p className="text-sm text-green-600">January 2024</p>
            </div>
            <div className="p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-red-600" />
                <h3 className="font-medium text-red-700">Highest Month</h3>
              </div>
              <p className="text-2xl font-bold text-red-700">₹44,500</p>
              <p className="text-sm text-red-600">December 2024</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Fuel className="h-5 w-5 text-blue-600" />
                <h3 className="font-medium text-blue-700">Fuel Efficiency</h3>
              </div>
              <p className="text-2xl font-bold text-blue-700">4.2 km/l</p>
              <p className="text-sm text-blue-600">Average across fleet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Category Bar Component
function CategoryBar({ label, amount, total, color, icon }: any) {
  const percentage = (amount / total) * 100

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-gray-900">{formatCurrency(amount)}</span>
          <span className="text-xs text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
        </div>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full ${color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}