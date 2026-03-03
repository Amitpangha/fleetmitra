"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

interface Driver {
  id: string
  name: string
  phone: string
  email?: string
  licenseNumber: string
  licenseExpiry?: string
  experience?: number
  rating?: number
  status: string
  emergencyContact?: string
  bloodGroup?: string
  createdAt: string
  updatedAt: string
  trips?: Trip[]
}

interface Trip {
  id: string
  tripNumber: string
  fromLocation: string
  toLocation: string
  startDate: string
  endDate?: string
  status: string
  loadWeight: number
}

export default function DriverDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [driver, setDriver] = useState<Driver | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'info' | 'trips' | 'documents'>('info')

  useEffect(() => {
    fetchDriver()
  }, [params.id])

  const fetchDriver = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/drivers/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch driver')
      }
      
      const data = await response.json()
      setDriver(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching driver:", err)
      setError("Failed to load driver details")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this driver?')) return
    
    try {
      const response = await fetch(`/api/drivers/${params.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete driver')
      }
      
      router.push('/dashboard/drivers')
      router.refresh()
    } catch (err) {
      console.error("Error deleting driver:", err)
      alert("Failed to delete driver")
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800'
      case 'ON_TRIP': return 'bg-yellow-100 text-yellow-800'
      case 'OFF_DUTY': return 'bg-gray-100 text-gray-800'
      default: return 'bg-red-100 text-red-800'
    }
  }

  const getTripStatusColor = (status: string) => {
    switch(status) {
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'PLANNED': return 'bg-gray-100 text-gray-800'
      default: return 'bg-yellow-100 text-yellow-800'
    }
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

  if (error || !driver) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || "Driver not found"}
        </div>
        <Link
          href="/dashboard/drivers"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          ← Back to Drivers
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
              href="/dashboard/drivers"
              className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
            >
              ← Back to Drivers
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{driver.name}</h1>
            <p className="text-gray-600 mt-1">Driver ID: {driver.id}</p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/drivers/${driver.id}/edit`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Edit Driver
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

      {/* Status Badge */}
      <div className="mb-6">
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(driver.status)}`}>
          {driver.status.replace('_', ' ')}
        </span>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'info'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Information
          </button>
          <button
            onClick={() => setActiveTab('trips')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'trips'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Trip History
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Documents
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">{driver.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{driver.phone}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{driver.email || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Blood Group</dt>
                  <dd className="mt-1 text-sm text-gray-900">{driver.bloodGroup || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Emergency Contact</dt>
                  <dd className="mt-1 text-sm text-gray-900">{driver.emergencyContact || 'N/A'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Member Since</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(driver.createdAt).toLocaleDateString()}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">License Information</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">License Number</dt>
                  <dd className="mt-1 text-sm text-gray-900">{driver.licenseNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">License Expiry</dt>
                  <dd className="mt-1">
                    {driver.licenseExpiry ? (
                      <span className={`text-sm ${
                        new Date(driver.licenseExpiry) < new Date() 
                          ? 'text-red-600 font-semibold' 
                          : 'text-gray-900'
                      }`}>
                        {new Date(driver.licenseExpiry).toLocaleDateString()}
                        {new Date(driver.licenseExpiry) < new Date() && ' (Expired)'}
                      </span>
                    ) : 'N/A'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Experience</dt>
                  <dd className="mt-1 text-sm text-gray-900">{driver.experience || 0} years</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Rating</dt>
                  <dd className="mt-1 text-sm text-gray-900">⭐ {driver.rating || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Total Trips</p>
                  <p className="text-2xl font-bold text-gray-900">{driver.trips?.length || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed Trips</p>
                  <p className="text-2xl font-bold text-green-600">
                    {driver.trips?.filter(t => t.status === 'COMPLETED').length || 0}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Trips</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {driver.trips?.filter(t => t.status === 'IN_PROGRESS').length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'trips' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Trip History</h2>
          {driver.trips && driver.trips.length > 0 ? (
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
                      Dates
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight
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
                  {driver.trips.map((trip) => (
                    <tr key={trip.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {trip.tripNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trip.fromLocation} → {trip.toLocation}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(trip.startDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {trip.loadWeight} tons
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTripStatusColor(trip.status)}`}>
                          {trip.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/dashboard/trips/${trip.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No trips found for this driver</p>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents</h2>
          <p className="text-gray-500 text-center py-8">Document management coming soon...</p>
        </div>
      )}
    </div>
  )
}