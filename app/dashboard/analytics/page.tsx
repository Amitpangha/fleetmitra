"use client"

import { useState, useEffect } from "react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { useTheme } from "@/components/ThemeProvider"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  Filler
)

interface AnalyticsData {
  period: string
  metrics: {
    trips: { current: number; previous: number; growth: string }
    revenue: { current: number; previous: number; growth: string }
    expenses: { current: number; previous: number; growth: string }
    profit: { current: number; previous: number; growth: string }
    documents: { current: number; previous: number; growth: string }
  }
  charts: {
    revenueTrend: Array<{ month: string; revenue: number }>
    expenseByCategory: Array<{ category: string; amount: number }>
    vehicleUtilization: Array<{ registration: string; tripCount: number; utilization: number }>
    driverPerformance: Array<{ name: string; tripCount: number; revenue: number; rating: number }>
  }
  insights: Array<{
    type: 'positive' | 'warning' | 'negative' | 'info'
    icon: string
    title: string
    message: string
  }>
}

export default function AnalyticsPage() {
  const { theme } = useTheme()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [period, setPeriod] = useState('month')

  useEffect(() => {
    fetchAnalytics()
  }, [period])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/analytics?period=${period}`)
      if (!response.ok) throw new Error('Failed to fetch analytics')
      const data = await response.json()
      setData(data)
      setError(null)
    } catch (err) {
      setError("Failed to load analytics data")
    } finally {
      setLoading(false)
    }
  }

  const getInsightColor = (type: string) => {
    switch(type) {
      case 'positive': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400'
      case 'warning': return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400'
      case 'negative': return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400'
      default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400'
    }
  }

  // Safe calculation functions to prevent -infinity%
  const calculateProfitMargin = () => {
    if (!data) return "0.0"
    const revenue = data.metrics.revenue.current
    if (revenue === 0) return "0.0"
    return ((data.metrics.profit.current / revenue) * 100).toFixed(1)
  }

  const calculateRevenuePerTrip = () => {
    if (!data) return 0
    const trips = data.metrics.trips.current
    if (trips === 0) return 0
    return data.metrics.revenue.current / trips
  }

  const calculateCostPerTrip = () => {
    if (!data) return 0
    const trips = data.metrics.trips.current
    if (trips === 0) return 0
    return data.metrics.expenses.current / trips
  }

  // Chart colors based on theme
  const getChartColors = () => {
    return {
      textColor: theme === 'dark' ? '#E5E7EB' : '#4B5563',
      gridColor: theme === 'dark' ? '#374151' : '#E5E7EB',
      borderColor: theme === 'dark' ? '#4B5563' : '#D1D5DB',
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner-lg mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Error Loading Analytics</h3>
        <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">{error}</p>
        <button
          onClick={fetchAnalytics}
          className="btn-primary px-6 py-2"
        >
          Try Again
        </button>
      </div>
    )
  }

  const colors = getChartColors()

  // Chart configurations
  const revenueChartData = {
    labels: data.charts.revenueTrend.map(d => d.month),
    datasets: [
      {
        label: 'Revenue (₹)',
        data: data.charts.revenueTrend.map(d => d.revenue),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const expenseChartData = {
    labels: data.charts.expenseByCategory.map(d => d.category),
    datasets: [
      {
        data: data.charts.expenseByCategory.map(d => d.amount),
        backgroundColor: [
          '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#EF4444', '#6366F1',
        ],
        borderWidth: 1,
      },
    ],
  }

  const utilizationChartData = {
    labels: data.charts.vehicleUtilization.map(v => v.registration),
    datasets: [
      {
        label: 'Utilization %',
        data: data.charts.vehicleUtilization.map(v => v.utilization),
        backgroundColor: '#8B5CF6',
        borderRadius: 8,
      },
    ],
  }

  return (
    <div className="space-y-8">
      {/* Header with Period Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold gradient-text-primary">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 font-medium mt-2">
            Deep insights into your fleet performance
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold min-w-[200px]"
        >
          <option value="week" className="font-medium">Last 7 Days</option>
          <option value="month" className="font-medium">Last 30 Days</option>
          <option value="quarter" className="font-medium">Last 90 Days</option>
          <option value="year" className="font-medium">Last 365 Days</option>
        </select>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Trips"
          value={data.metrics.trips.current}
          previous={data.metrics.trips.previous}
          growth={data.metrics.trips.growth}
          icon="🗺️"
          color="blue"
        />
        <MetricCard
          title="Revenue"
          value={data.metrics.revenue.current}
          previous={data.metrics.revenue.previous}
          growth={data.metrics.revenue.growth}
          icon="💰"
          color="green"
          isCurrency
        />
        <MetricCard
          title="Expenses"
          value={data.metrics.expenses.current}
          previous={data.metrics.expenses.previous}
          growth={data.metrics.expenses.growth}
          icon="💸"
          color="red"
          isCurrency
        />
        <MetricCard
          title="Profit"
          value={data.metrics.profit.current}
          previous={data.metrics.profit.previous}
          growth={data.metrics.profit.growth}
          icon="💎"
          color="purple"
          isCurrency
        />
        <MetricCard
          title="Documents"
          value={data.metrics.documents.current}
          previous={data.metrics.documents.previous}
          growth={data.metrics.documents.growth}
          icon="📄"
          color="orange"
        />
      </div>

      {/* Insights Panel */}
      {data.insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.insights.map((insight, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl border ${getInsightColor(insight.type)} flex items-start gap-4`}
            >
              <span className="text-3xl">{insight.icon}</span>
              <div>
                <h3 className="font-bold text-lg mb-1">{insight.title}</h3>
                <p className="font-medium opacity-90">{insight.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Revenue Trend</h2>
          <div className="h-80">
            <Line
              data={revenueChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { display: false },
                  tooltip: {
                    callbacks: {
                      label: (context) => `₹${(context.raw as number).toLocaleString()}`,
                    },
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: colors.gridColor },
                    ticks: {
                      color: colors.textColor,
                      callback: (value) => `₹${(Number(value) / 1000).toFixed(0)}k`,
                      font: { weight: 500 }
                    }
                  },
                  x: {
                    grid: { display: false },
                    ticks: { 
                      color: colors.textColor,
                      font: { weight: 500 }
                    }
                  }
                },
              }}
            />
          </div>
        </div>

        {/* Expense Distribution */}
        <div className="card p-6">
          <h2 className="text-xl font-bold mb-4">Expense Distribution</h2>
          <div className="h-80">
            <Doughnut
              data={expenseChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { 
                    position: 'bottom',
                    labels: { 
                      color: colors.textColor,
                      font: { weight: 500, size: 12 }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.raw as number
                        const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0)
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : "0.0"
                        return `${context.label}: ₹${value.toLocaleString()} (${percentage}%)`
                      },
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Vehicle Utilization */}
        {data.charts.vehicleUtilization.length > 0 && (
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Top Vehicles by Utilization</h2>
            <div className="h-80">
              <Bar
                data={utilizationChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `${context.raw}% utilization`,
                      },
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      grid: { color: colors.gridColor },
                      ticks: {
                        callback: (value) => `${value}%`,
                        color: colors.textColor,
                        font: { weight: 500 }
                      }
                    },
                    x: {
                      grid: { display: false },
                      ticks: { 
                        color: colors.textColor,
                        font: { weight: 500 }
                      }
                    }
                  },
                }}
              />
            </div>
          </div>
        )}

        {/* Driver Performance */}
        {data.charts.driverPerformance.length > 0 && (
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Top Drivers by Revenue</h2>
            <div className="space-y-4">
              {data.charts.driverPerformance.map((driver, index) => {
                const maxRevenue = data.charts.driverPerformance[0].revenue
                const percentage = maxRevenue > 0 ? (driver.revenue / maxRevenue) * 100 : 0
                
                return (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-700 dark:text-blue-400 font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-900 dark:text-white">{driver.name}</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          ₹{driver.revenue.toLocaleString()}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-bar-fill"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {driver.tripCount} trips
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ⭐ {driver.rating.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Profitability Analysis - FIXED: No more -infinity% */}
      <div className="card p-6">
        <h2 className="text-xl font-bold mb-6">Profitability Analysis</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Profit Margin</p>
            <p className="text-4xl font-bold gradient-text-primary">
              {calculateProfitMargin()}%
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              of total revenue
            </p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-xl">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Revenue per Trip</p>
            <p className="text-4xl font-bold gradient-text-accent">
              ₹{calculateRevenuePerTrip().toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              average per trip
            </p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Cost per Trip</p>
            <p className="text-4xl font-bold text-orange-600 dark:text-orange-400">
              ₹{calculateCostPerTrip().toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              average cost per trip
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4">Period Comparison</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Current Period Trips</span>
              <span className="font-bold text-gray-900 dark:text-white">{data.metrics.trips.current}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Previous Period Trips</span>
              <span className="font-bold text-gray-900 dark:text-white">{data.metrics.trips.previous}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="font-bold">Growth</span>
              <span className={`font-bold ${parseFloat(data.metrics.trips.growth) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {parseFloat(data.metrics.trips.growth) > 0 ? '↑' : '↓'} {Math.abs(parseFloat(data.metrics.trips.growth))}%
              </span>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-bold text-lg mb-4">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Revenue</span>
              <span className="font-bold text-green-600">₹{data.metrics.revenue.current.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Total Expenses</span>
              <span className="font-bold text-red-600">₹{data.metrics.expenses.current.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="font-bold">Net Profit</span>
              <span className={`font-bold ${data.metrics.profit.current >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{data.metrics.profit.current.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({ title, value, previous, growth, icon, color, isCurrency = false }: any) {
  const growthNum = parseFloat(growth)
  const isPositive = growthNum > 0
  const isNegative = growthNum < 0

  const colorClasses: Record<string, string> = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600',
  }

  return (
    <div className="card p-6 hover-lift">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</span>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center text-white`}>
          <span className="text-lg">{icon}</span>
        </div>
      </div>
      
      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {isCurrency ? `₹${value.toLocaleString()}` : value}
      </div>
      
      <div className="flex items-center gap-2 text-sm">
        <span className={`font-bold ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'}`}>
          {isPositive ? '↑' : isNegative ? '↓' : '→'} {Math.abs(growthNum)}%
        </span>
        <span className="text-gray-500 dark:text-gray-500">vs previous</span>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 dark:text-gray-500">
        Previous: {isCurrency ? `₹${previous.toLocaleString()}` : previous}
      </div>
    </div>
  )
}