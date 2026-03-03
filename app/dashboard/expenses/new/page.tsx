"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

interface Vehicle {
  id: string
  registration: string
}

interface Driver {
  id: string
  name: string
}

interface Trip {
  id: string
  tripNumber: string
}

export default function NewExpensePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const tripId = searchParams.get('tripId')
  const vehicleId = searchParams.get('vehicleId')
  const driverId = searchParams.get('driverId')

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [trips, setTrips] = useState<Trip[]>([])

  const expenseTypes = [
    "Fuel",
    "Maintenance",
    "Repair",
    "Insurance",
    "Tax",
    "Toll",
    "Salary",
    "Loading/Unloading",
    "Parking",
    "Fine",
    "Other"
  ]

  const paymentMethods = [
    "Cash",
    "Credit Card",
    "Debit Card",
    "Bank Transfer",
    "UPI",
    "Cheque",
    "Other"
  ]

  const [formData, setFormData] = useState({
    amount: "",
    type: "",
    description: "",
    date: new Date().toISOString().split('T')[0],
    paymentMethod: "",
    vehicleId: vehicleId || "",
    driverId: driverId || "",
    tripId: tripId || "",
    notes: "",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [vehiclesRes, driversRes, tripsRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/drivers'),
        fetch('/api/trips?status=IN_PROGRESS,COMPLETED')
      ])

      if (vehiclesRes.ok) {
        const data = await vehiclesRes.json()
        setVehicles(data)
      }

      if (driversRes.ok) {
        const data = await driversRes.json()
        setDrivers(data)
      }

      if (tripsRes.ok) {
        const data = await tripsRes.json()
        setTrips(data)
      }
    } catch (err) {
      console.error("Error fetching data:", err)
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
      const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create expense")
      }

      // Redirect based on context
      if (tripId) {
        router.push(`/dashboard/trips/${tripId}`)
      } else if (vehicleId) {
        router.push(`/dashboard/vehicles/${vehicleId}`)
      } else if (driverId) {
        router.push(`/dashboard/drivers/${driverId}`)
      } else {
        router.push("/dashboard/expenses")
      }
      router.refresh()
      
    } catch (err) {
      console.error("Error creating expense:", err)
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link
            href={tripId ? `/dashboard/trips/${tripId}` : "/dashboard/expenses"}
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Add New Expense</h1>
          <p className="text-gray-600 mt-2">Record a new expense</p>
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
          {/* Basic Information */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="e.g., 5000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  Expense Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select type</option>
                  {expenseTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select method</option>
                  {paymentMethods.map(method => (
                    <option key={method} value={method}>{method}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the expense"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Association */}
          <div className="border-b pb-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Associate With (Optional)</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="vehicleId" className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle
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
                      {vehicle.registration}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="driverId" className="block text-sm font-medium text-gray-700 mb-2">
                  Driver
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
                      {driver.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="tripId" className="block text-sm font-medium text-gray-700 mb-2">
                  Trip
                </label>
                <select
                  id="tripId"
                  name="tripId"
                  value={formData.tripId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select a trip</option>
                  {trips.map(trip => (
                    <option key={trip.id} value={trip.id}>
                      {trip.tripNumber}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Any additional details about this expense..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4">
            <Link
              href={tripId ? `/dashboard/trips/${tripId}` : "/dashboard/expenses"}
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
                  Saving...
                </>
              ) : (
                "Save Expense"
              )}
            </button>
          </div>
        </form>

        <p className="text-sm text-gray-500 mt-4">
          <span className="text-red-500">*</span> Required fields
        </p>
      </div>
    </div>
  )
}