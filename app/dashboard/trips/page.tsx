"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Trip {
  id: string
  tripNumber: string
  fromLocation: string
  toLocation: string
  startDate: string
  endDate?: string
  status: string
  loadType: string
  loadWeight: number
  freightAmount?: number
  advanceAmount?: number
  paymentStatus: string
  priority: string
  vehicle?: {
    id: string
    registration: string
  }
  driver?: {
    id: string
    name: string
  }
}

export default function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    fetchTrips()
  }, [])

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/trips')
      
      if (!response.ok) {
        throw new Error('Failed to fetch trips')
      }
      
      const data = await response.json()
      setTrips(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching trips:", err)
      setError("Failed to load trips. Please try again.")
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

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'HIGH': return 'text-red-600 font-semibold'
      case 'NORMAL': return 'text-yellow-600'
      case 'LOW': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'PARTIAL': return 'bg-yellow-100 text-yellow-800'
      case 'PENDING': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredTrips = trips?.filter(trip => {
    const matchesSearch = 
      trip.tripNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.fromLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.toLocation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.vehicle?.registration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trip.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'ALL' || trip.status === statusFilter
    
    return matchesSearch && matchesStatus
  }) || []

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
          <p className="text-gray-600 mt-2">Manage and track all trips</p>
        </div>
        <Link
          href="/dashboard/trips/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Create New Trip
        </Link>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button 
              onClick={() => fetchTrips()}
              className="text-sm bg-red-100 px-3 py-1 rounded-md hover:bg-red-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Search trips by number, route, vehicle..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ALL">All Status</option>
          <option value="PLANNED">Planned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Trips Table */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No trips found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? "No trips match your search" : "Get started by creating your first trip"}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Link
                href="/dashboard/trips/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Create New Trip
              </Link>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trip #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Route
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vehicle/Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Load
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Freight
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{trip.tripNumber}</div>
                      <div className={`text-xs ${getPriorityColor(trip.priority)}`}>
                        {trip.priority} Priority
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{trip.fromLocation}</div>
                      <div className="text-sm text-gray-500">→ {trip.toLocation}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{trip.vehicle?.registration || 'Not assigned'}</div>
                      <div className="text-sm text-gray-500">{trip.driver?.name || 'No driver'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">Start: {new Date(trip.startDate).toLocaleDateString()}</div>
                      {trip.endDate && (
                        <div className="text-sm text-gray-500">End: {new Date(trip.endDate).toLocaleDateString()}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{trip.loadType}</div>
                      <div className="text-sm text-gray-500">{trip.loadWeight} tons</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">₹{trip.freightAmount?.toLocaleString() || '0'}</div>
                      <div className="text-sm text-gray-500">Adv: ₹{trip.advanceAmount?.toLocaleString() || '0'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(trip.status)}`}>
                        {trip.status.replace('_', ' ')}
                      </span>
                      <div className="mt-1">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(trip.paymentStatus)}`}>
                          {trip.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        href={`/dashboard/trips/${trip.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/trips/${trip.id}/edit`}
                        className="text-green-600 hover:text-green-900"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Total Trips</p>
          <p className="text-2xl font-bold text-gray-900">{trips.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">
            {trips.filter(t => t.status === 'IN_PROGRESS').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">
            {trips.filter(t => t.status === 'COMPLETED').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-4">
          <p className="text-sm text-gray-500">Total Freight</p>
          <p className="text-2xl font-bold text-gray-900">
            ₹{trips.reduce((sum, t) => sum + (t.freightAmount || 0), 0).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}