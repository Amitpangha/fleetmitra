"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
  loadValue?: number
  freightAmount?: number
  advanceAmount?: number
  balanceAmount?: number
  paymentStatus: string
  priority: string
  distance?: number
  notes?: string
  vehicle?: {
    id: string
    registration: string
    model: string
    capacity: number
  }
  driver?: {
    id: string
    name: string
    phone: string
    licenseNumber: string
  }
  expenses?: Expense[]
  createdAt: string
  updatedAt: string
}

interface Expense {
  id: string
  amount: number
  type: string
  description?: string
  date: string
  paymentMethod?: string
}

export default function TripDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'details' | 'expenses' | 'timeline'>('details')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    fetchTrip()
  }, [params.id])

  const fetchTrip = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/trips/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch trip')
      }
      
      const data = await response.json()
      setTrip(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching trip:", err)
      setError("Failed to load trip details")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    if (!confirm(`Mark trip as ${newStatus.replace('_', ' ')}?`)) return
    
    setUpdating(true)
    try {
      const response = await fetch(`/api/trips/${params.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to update status')
      }
      
      await fetchTrip()
    } catch (err) {
      console.error("Error updating status:", err)
      alert("Failed to update trip status")
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this trip?')) return
    
    try {
      const response = await fetch(`/api/trips/${params.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete trip')
      }
      
      router.push('/dashboard/trips')
      router.refresh()
    } catch (err) {
      console.error("Error deleting trip:", err)
      alert("Failed to delete trip")
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

  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'PAID': return 'bg-green-100 text-green-800'
      case 'PARTIAL': return 'bg-yellow-100 text-yellow-800'
      case 'PENDING': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const calculateBalance = () => {
    if (!trip) return 0
    return (trip.freightAmount || 0) - (trip.advanceAmount || 0)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error || !trip) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || "Trip not found"}
        </div>
        <Link
          href="/dashboard/trips"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          ← Back to Trips
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <Link
              href="/dashboard/trips"
              className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
            >
              ← Back to Trips
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Trip {trip.tripNumber}</h1>
            <p className="text-gray-600 mt-1">
              Created on {new Date(trip.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-3">
            {trip.status === 'PLANNED' && (
              <button
                onClick={() => handleStatusUpdate('IN_PROGRESS')}
                disabled={updating}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Start Trip
              </button>
            )}
            {trip.status === 'IN_PROGRESS' && (
              <button
                onClick={() => handleStatusUpdate('COMPLETED')}
                disabled={updating}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Complete Trip
              </button>
            )}
            <Link
              href={`/dashboard/trips/${trip.id}/edit`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Status Badges */}
      <div className="mb-6 flex space-x-3">
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(trip.status)}`}>
          {trip.status.replace('_', ' ')}
        </span>
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getPaymentStatusColor(trip.paymentStatus)}`}>
          Payment: {trip.paymentStatus}
        </span>
        <span className="px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-800">
          {trip.priority} Priority
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Trip Details
          </button>
          <button
            onClick={() => setActiveTab('expenses')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'expenses'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Expenses
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'timeline'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Timeline
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Route Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Route Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="text-lg font-medium text-gray-900">{trip.fromLocation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="text-lg font-medium text-gray-900">{trip.toLocation}</p>
                </div>
                {trip.distance && (
                  <div>
                    <p className="text-sm text-gray-500">Distance</p>
                    <p className="text-lg font-medium text-gray-900">{trip.distance} km</p>
                  </div>
                )}
              </div>
            </div>

            {/* Schedule Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Schedule</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="text-lg font-medium text-gray-900">
                    {new Date(trip.startDate).toLocaleString()}
                  </p>
                </div>
                {trip.endDate && (
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(trip.endDate).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Load Details Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Load Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm text-gray-500">Load Type</p>
                  <p className="text-lg font-medium text-gray-900">{trip.loadType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Weight</p>
                  <p className="text-lg font-medium text-gray-900">{trip.loadWeight} tons</p>
                </div>
                {trip.loadValue && (
                  <div>
                    <p className="text-sm text-gray-500">Load Value</p>
                    <p className="text-lg font-medium text-gray-900">₹{trip.loadValue.toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Notes Card */}
            {trip.notes && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Notes</h2>
                <p className="text-gray-700">{trip.notes}</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Vehicle Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Assigned Vehicle</h2>
              {trip.vehicle ? (
                <div>
                  <p className="text-2xl font-bold text-gray-900">{trip.vehicle.registration}</p>
                  <p className="text-gray-600 mt-1">{trip.vehicle.model}</p>
                  <p className="text-sm text-gray-500 mt-2">Capacity: {trip.vehicle.capacity} tons</p>
                  <Link
                    href={`/dashboard/vehicles/${trip.vehicle.id}`}
                    className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Vehicle Details →
                  </Link>
                </div>
              ) : (
                <p className="text-gray-500">No vehicle assigned</p>
              )}
            </div>

            {/* Driver Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Assigned Driver</h2>
              {trip.driver ? (
                <div>
                  <p className="text-xl font-bold text-gray-900">{trip.driver.name}</p>
                  <p className="text-gray-600 mt-1">{trip.driver.phone}</p>
                  <p className="text-sm text-gray-500 mt-2">License: {trip.driver.licenseNumber}</p>
                  <Link
                    href={`/dashboard/drivers/${trip.driver.id}`}
                    className="mt-4 inline-block text-blue-600 hover:text-blue-800 text-sm"
                  >
                    View Driver Details →
                  </Link>
                </div>
              ) : (
                <p className="text-gray-500">No driver assigned</p>
              )}
            </div>

            {/* Financial Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Financial Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Freight Amount:</span>
                  <span className="font-medium">₹{trip.freightAmount?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Advance Paid:</span>
                  <span className="font-medium">₹{trip.advanceAmount?.toLocaleString() || '0'}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Balance:</span>
                  <span className="font-bold text-lg text-blue-600">
                    ₹{calculateBalance().toLocaleString()}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-gray-500">Payment Status</div>
                  <span className={`mt-1 inline-block px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(trip.paymentStatus)}`}>
                    {trip.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'expenses' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Trip Expenses</h2>
            <Link
              href={`/dashboard/expenses/new?tripId=${trip.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              Add Expense
            </Link>
          </div>
          
          {trip.expenses && trip.expenses.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment Method</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trip.expenses.map((expense) => (
                    <tr key={expense.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(expense.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{expense.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{expense.description || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₹{expense.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {expense.paymentMethod || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-6 py-4 text-right font-semibold">Total:</td>
                    <td className="px-6 py-4 font-bold text-gray-900">
                      ₹{trip.expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No expenses recorded for this trip</p>
          )}
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Trip Timeline</h2>
          <div className="space-y-6">
            {/* Timeline events would go here */}
            <div className="flex">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{new Date(trip.createdAt).toLocaleString()}</p>
                <p className="text-base font-medium text-gray-900">Trip created</p>
              </div>
            </div>
            
            <div className="flex">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">{new Date(trip.startDate).toLocaleString()}</p>
                <p className="text-base font-medium text-gray-900">Trip started</p>
              </div>
            </div>

            {trip.endDate && (
              <div className="flex">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">{new Date(trip.endDate).toLocaleString()}</p>
                  <p className="text-base font-medium text-gray-900">Trip completed</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}