"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
  LineElement
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState('week')

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/stats')
      if (!response.ok) throw new Error('Failed to fetch dashboard statistics')
      const data = await response.json()
      setStats(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching dashboard stats:", err)
      setError("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'PLANNED': return 'bg-gray-100 text-gray-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || "Failed to load dashboard"}
        </div>
      </div>
    )
  }

  const expensePieData = {
    labels: Object.keys(stats.expenseStats.byType),
    datasets: [{
      data: Object.values(stats.expenseStats.byType),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
      borderWidth: 1,
    }],
  }

  const monthlyTrendData = {
    labels: stats.expenseStats.monthlyTrend.labels,
    datasets: [{
      label: 'Expenses (₹)',
      data: stats.expenseStats.monthlyTrend.data,
      borderColor: '#36A2EB',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      tension: 0.4,
      fill: true,
    }],
  }

  const vehicleStatusData = {
    labels: ['Active', 'Maintenance', 'Inactive'],
    datasets: [{
      data: [stats.vehicleStats.active, stats.vehicleStats.maintenance, stats.vehicleStats.inactive],
      backgroundColor: ['#4BC0C0', '#FFCE56', '#FF6384'],
      borderWidth: 1,
    }],
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm md:text-base text-gray-600 mt-1">Welcome back! Here's your fleet overview.</p>
        </div>

        {/* Alerts Section - Mobile Optimized */}
        {stats.alerts.totalExpiring > 0 && (
          <div className="mb-4 md:mb-6 bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 md:px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-sm md:text-base font-medium">{stats.alerts.totalExpiring} items expiring soon!</span>
            </div>
          </div>
        )}

        {/* Quick Stats Cards - Mobile Optimized */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-md p-3 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Vehicles</p>
                <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.vehicleStats.total}</p>
              </div>
              <div className="bg-blue-100 p-2 md:p-3 rounded-full">
                <span className="text-lg md:text-xl">🚛</span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="text-green-600">✓ {stats.vehicleStats.active}</span>
              <span className="text-yellow-600">🔧 {stats.vehicleStats.maintenance}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-3 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Drivers</p>
                <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.driverStats.total}</p>
              </div>
              <div className="bg-green-100 p-2 md:p-3 rounded-full">
                <span className="text-lg md:text-xl">👤</span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="text-green-600">✓ {stats.driverStats.available}</span>
              <span className="text-blue-600">🚚 {stats.driverStats.onTrip}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-3 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Active Trips</p>
                <p className="text-xl md:text-3xl font-bold text-gray-900">{stats.tripStats.inProgress}</p>
              </div>
              <div className="bg-purple-100 p-2 md:p-3 rounded-full">
                <span className="text-lg md:text-xl">🗺️</span>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs">
              <span className="text-gray-600">Total: {stats.tripStats.total}</span>
              <span className="text-green-600">✓ {stats.tripStats.completed}</span>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-3 md:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-500">Expenses</p>
                <p className="text-lg md:text-3xl font-bold text-gray-900">₹{(stats.expenseStats.monthly / 1000).toFixed(1)}k</p>
              </div>
              <div className="bg-orange-100 p-2 md:p-3 rounded-full">
                <span className="text-lg md:text-xl">💰</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              This month
            </div>
          </div>
        </div>

        {/* Charts Section - Stack on Mobile */}
        <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Monthly Expenses</h2>
            <div className="h-48 md:h-64">
              <Line 
                data={monthlyTrendData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { 
                    y: { 
                      beginAtZero: true,
                      ticks: { 
                        callback: (value) => '₹' + (Number(value) / 1000).toFixed(0) + 'k',
                        font: { size: 10 }
                      }
                    },
                    x: { ticks: { font: { size: 10 } } }
                  }
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
            <h2 className="text-base md:text-lg font-semibold text-gray-800 mb-4">Expenses by Type</h2>
            <div className="h-48 md:h-64">
              <Pie 
                data={expensePieData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'bottom', labels: { font: { size: 10 } } },
                    tooltip: {
                      callbacks: {
                        label: (context) => {
                          let label = context.label || ''
                          let value = context.raw as number
                          return `${label}: ₹${(value / 1000).toFixed(1)}k`
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Expiring Soon - Mobile Horizontal Scroll */}
        {stats.alerts.totalExpiring > 0 && (
          <div className="mb-6 md:mb-8">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3 md:mb-4">⚠️ Expiring Soon</h2>
            <div className="overflow-x-auto -mx-4 px-4 md:px-0 md:overflow-visible">
              <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 min-w-min md:min-w-0">
                {stats.expiringSoon.fitness?.map((item: any) => (
                  <div key={item.id} className="flex-shrink-0 w-64 md:w-auto bg-white rounded-lg shadow-md p-4 border-l-4 border-yellow-400">
                    <p className="text-xs text-gray-500">Fitness</p>
                    <p className="font-medium text-sm md:text-base truncate">{item.registration}</p>
                    <p className="text-xs text-yellow-600 mt-1">
                      Exp: {new Date(item.fitnessExpiry).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {stats.expiringSoon.insurance?.map((item: any) => (
                  <div key={item.id} className="flex-shrink-0 w-64 md:w-auto bg-white rounded-lg shadow-md p-4 border-l-4 border-red-400">
                    <p className="text-xs text-gray-500">Insurance</p>
                    <p className="font-medium text-sm md:text-base truncate">{item.registration}</p>
                    <p className="text-xs text-red-600 mt-1">
                      Exp: {new Date(item.insuranceExpiry).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recent Trips - Mobile Optimized Table */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Recent Trips</h2>
          
          {/* Mobile View - Cards */}
          <div className="block md:hidden space-y-3">
            {stats.recentTrips.map((trip: any) => (
              <Link
                key={trip.id}
                href={`/dashboard/trips/${trip.id}`}
                className="block bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-sm">{trip.tripNumber}</span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(trip.status)}`}>
                    {trip.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="text-xs text-gray-600 mb-2">
                  {trip.fromLocation} → {trip.toLocation}
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>🚛 {trip.vehicle || 'No vehicle'}</span>
                  <span>👤 {trip.driver || 'No driver'}</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Desktop View - Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trip #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vehicle/Driver</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.recentTrips.map((trip: any) => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{trip.tripNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{trip.fromLocation} → {trip.toLocation}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{trip.vehicle || 'No vehicle'} / {trip.driver || 'No driver'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(trip.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(trip.status)}`}>
                        {trip.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link href={`/dashboard/trips/${trip.id}`} className="text-blue-600 hover:text-blue-900">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}