"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

interface Vehicle {
  id: string
  registration: string
  model: string
  capacity: number
}

interface Driver {
  id: string
  name: string
  phone: string
  status: string
}

export default function EditTripPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  
  const [formData, setFormData] = useState({
    fromLocation: "",
    toLocation: "",
    startDate: "",
    endDate: "",
    loadType: "",
    loadWeight: "",
    loadValue: "",
    vehicleId: "",
    driverId: "",
    distance: "",
    freightAmount: "",
    advanceAmount: "",
    notes: "",
    priority: "NORMAL",
    status: "PLANNED",
    paymentStatus: "PENDING",
  })

  const loadTypes = [
    "General Goods",
    "Perishable",
    "Hazardous",
    "Construction Material",
    "Electronics",
    "Furniture",
    "Automobiles",
    "Chemicals",
    "Food Products",
    "Other"
  ]

  useEffect(() => {
    fetchData()
  }, [params.id])

  const fetchData = async () => {
    try {
      setIsFetching(true)
      
      // Fetch trip details
      const tripResponse = await fetch(`/api/trips/${params.id}`)
      if (!tripResponse.ok) {
        throw new Error('Failed to fetch trip')
      }
      const trip = await tripResponse.json()
      
      // Format dates for input fields
      setFormData({
        fromLocation: trip.fromLocation || "",
        toLocation: trip.toLocation || "",
        startDate: trip.startDate ? new Date(trip.startDate).toISOString().slice(0, 16) : "",
        endDate: trip.endDate ? new Date(trip.endDate).toISOString().slice(0, 16) : "",
        loadType: trip.loadType || "",
        loadWeight: trip.loadWeight?.toString() || "",
        loadValue: trip.loadValue?.toString() || "",
        vehicleId: trip.vehicleId || "",
        driverId: trip.driverId || "",
        distance: trip.distance?.toString() || "",
        freightAmount: trip.freightAmount?.toString() || "",
        advanceAmount: trip.advanceAmount?.toString() || "",
        notes: trip.notes || "",
        priority: trip.priority || "NORMAL",
        status: trip.status || "PLANNED",
        paymentStatus: trip.paymentStatus || "PENDING",
      })

      // Fetch vehicles and drivers for dropdowns
      const [vehiclesRes, driversRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/drivers')
      ])
      
      if (vehiclesRes.ok) {
        const vehiclesData = await vehiclesRes.json()
        setVehicles(vehiclesData)
      }
      
      if (driversRes.ok) {
        const driversData = await driversRes.json()
        setDrivers(driversData)
      }
      
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load trip details")
    } finally {
      setIsFetching(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/trips/${params.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to update trip")
      }

      router.push(`/dashboard/trips/${params.id}`)
      router.refresh()
      
    } catch (err) {
      console.error("Error updating trip:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
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
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href={`/dashboard/trips/${params.id}`}
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Trip Details
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Edit Trip</h1>
          <p className="text-gray-600 mt-2">Update trip information</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex">
              <svg className="h-5 w-5 text-red-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 space-y-6">
          {/* Route Information */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Route Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fromLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  From Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="fromLocation"
                  name="fromLocation"
                  value={formData.fromLocation}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="toLocation" className="block text-sm font-medium text-gray-700 mb-2">
                  To Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="toLocation"
                  name="toLocation"
                  value={formData.toLocation}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="distance" className="block text-sm font-medium text-gray-700 mb-2">
                  Distance (km)
                </label>
                <input
                  type="number"
                  id="distance"
                  name="distance"
                  value={formData.distance}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Schedule</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date & Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Expected End Date
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Load Details */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Load Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="loadType" className="block text-sm font-medium text-gray-700 mb-2">
                  Load Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="loadType"
                  name="loadType"
                  value={formData.loadType}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select load type</option>
                  {loadTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="loadWeight" className="block text-sm font-medium text-gray-700 mb-2">
                  Load Weight (tons) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="loadWeight"
                  name="loadWeight"
                  value={formData.loadWeight}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="loadValue" className="block text-sm font-medium text-gray-700 mb-2">
                  Load Value (₹)
                </label>
                <input
                  type="number"
                  id="loadValue"
                  name="loadValue"
                  value={formData.loadValue}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Assignment */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Assign Vehicle & Driver</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Vehicle
                </label>
                <select
                  id="vehicleId"
                  name="vehicleId"
                  value={formData.vehicleId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registration} - {vehicle.model} ({vehicle.capacity} tons)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="driverId" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Driver
                </label>
                <select
                  id="driverId"
                  name="driverId"
                  value={formData.driverId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a driver</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>
                      {driver.name} - {driver.phone}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Financial Details */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Financial Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="freightAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Freight Amount (₹)
                </label>
                <input
                  type="number"
                  id="freightAmount"
                  name="freightAmount"
                  value={formData.freightAmount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="advanceAmount" className="block text-sm font-medium text-gray-700 mb-2">
                  Advance Amount (₹)
                </label>
                <input
                  type="number"
                  id="advanceAmount"
                  name="advanceAmount"
                  value={formData.advanceAmount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Status
                </label>
                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PARTIAL">Partial</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Trip Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="PLANNED">Planned</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Notes / Instructions
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link
              href={`/dashboard/trips/${params.id}`}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating...
                </>
              ) : (
                "Update Trip"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}