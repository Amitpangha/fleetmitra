"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Vehicle {
  id: string
  registration: string
  type: string
  model: string
  capacity: number
  status: string
  make?: string
  year?: number
  fuelType?: string
  insuranceExpiry?: string
  fitnessExpiry?: string
}

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("ALL")
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  useEffect(() => {
    fetchVehicles()
  }, [])

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/vehicles')
      if (!response.ok) throw new Error('Failed to fetch vehicles')
      const data = await response.json()
      setVehicles(data)
      setError(null)
    } catch (err) {
      setError("Failed to load vehicles")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
      case 'MAINTENANCE': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800'
      case 'INACTIVE': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    }
  }

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.registration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.make?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'ALL' || vehicle.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner-md mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Loading vehicles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Vehicles</h1>
          <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">Manage your fleet vehicles</p>
        </div>
        <Link
          href="/dashboard/vehicles/new"
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>➕</span>
          Add Vehicle
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-start gap-3">
          <span className="text-xl">❌</span>
          <span className="font-bold">{error}</span>
        </div>
      )}

      {/* Search and Filter - FIXED CONTRAST */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="🔍 Search vehicles by registration, model, or make..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
          />
          <span className="absolute left-3 top-3.5 text-gray-600 dark:text-gray-400">🔍</span>
        </div>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-full md:w-auto px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
        >
          <option value="ALL" className="font-medium text-gray-900 dark:text-white">All Status</option>
          <option value="ACTIVE" className="font-medium text-gray-900 dark:text-white">Active</option>
          <option value="MAINTENANCE" className="font-medium text-gray-900 dark:text-white">Maintenance</option>
          <option value="INACTIVE" className="font-medium text-gray-900 dark:text-white">Inactive</option>
        </select>
      </div>

      {/* Vehicles Grid */}
      {filteredVehicles.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-6xl mb-4 opacity-50">🚛</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No vehicles found</h3>
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-6">
            {searchTerm ? "Try adjusting your search" : "Get started by adding your first vehicle"}
          </p>
          {!searchTerm && (
            <Link
              href="/dashboard/vehicles/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800"
            >
              Add Vehicle
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map((vehicle) => {
            const isExpiring = vehicle.insuranceExpiry && new Date(vehicle.insuranceExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            
            return (
              <Link
                key={vehicle.id}
                href={`/dashboard/vehicles/${vehicle.id}`}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{vehicle.registration}</h3>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-1">
                        {vehicle.make} {vehicle.model} • {vehicle.year || 'N/A'}
                      </p>
                    </div>
                    <span className={`px-3 py-1.5 text-xs font-bold rounded-full border ${getStatusColor(vehicle.status)}`}>
                      {vehicle.status}
                    </span>
                  </div>
                  
                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Type</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{vehicle.type}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Capacity</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{vehicle.capacity} tons</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Fuel</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{vehicle.fuelType || 'N/A'}</p>
                    </div>
                    <div className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Status</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white">{vehicle.status}</p>
                    </div>
                  </div>

                  {/* Expiry Alert */}
                  {isExpiring && (
                    <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-xl flex items-center gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400">⚠️</span>
                      <span className="text-sm font-bold text-yellow-800 dark:text-yellow-400">Insurance expiring soon</span>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}