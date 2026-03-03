"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Fuel, MapPin, Wrench, CreditCard } from "lucide-react"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import toast from "react-hot-toast"

interface Vehicle {
  id: string
  registration: string
  model: string
}

interface Trip {
  id: string
  tripNumber: string
  fromLocation: string
  toLocation: string
}

export default function EditExpensePage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [formData, setFormData] = useState({
    type: "Fuel",
    amount: "",
    description: "",
    date: "",
    tripId: "",
    vehicleId: "",
    paymentMethod: "Cash",
    notes: ""
  })

  useEffect(() => {
    fetchExpense()
    fetchVehicles()
    fetchTrips()
  }, [])

  const fetchExpense = async () => {
    try {
      // Mock data - replace with API call
      setFormData({
        type: "Fuel",
        amount: "8500",
        description: "Highway fuel purchase - Mumbai to Pune",
        date: "2024-03-20",
        tripId: "1",
        vehicleId: "1",
        paymentMethod: "Fuel Card",
        notes: "Driver confirmed purchase"
      })
    } catch (error) {
      toast.error("Failed to fetch expense")
    }
  }

  const fetchVehicles = () => {
    setVehicles([
      { id: "1", registration: "MH12AB1234", model: "Tata LPK 2518" },
      { id: "2", registration: "DL5CQ9876", model: "Ashok Leyland Partner" },
      { id: "3", registration: "GJ01XY5678", model: "Mahindra Blazo X" }
    ])
  }

  const fetchTrips = () => {
    setTrips([
      { id: "1", tripNumber: "TRIP-2024-001", fromLocation: "Mumbai", toLocation: "Delhi" },
      { id: "2", tripNumber: "TRIP-2024-002", fromLocation: "Delhi", toLocation: "Bangalore" },
      { id: "3", tripNumber: "TRIP-2024-003", fromLocation: "Ahmedabad", toLocation: "Pune" }
    ])
  }

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "Fuel": return <Fuel className="h-5 w-5" />
      case "Toll": return <MapPin className="h-5 w-5" />
      case "Maintenance": return <Wrench className="h-5 w-5" />
      case "Driver Advance": return <CreditCard className="h-5 w-5" />
      default: return <CreditCard className="h-5 w-5" />
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success("Expense updated successfully")
      router.push(`/dashboard/expenses/${params.id}`)
    } catch (error) {
      toast.error("Failed to update expense")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link
          href={`/dashboard/expenses/${params.id}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Expense Details
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Edit Expense</h1>
        <p className="text-gray-500 mt-1">Update expense details</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Expense Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Expense Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expense Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {["Fuel", "Toll", "Maintenance", "Driver Advance"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({...formData, type})}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      formData.type === type
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      formData.type === type ? 'text-blue-600' : 'text-gray-600'
                    }`}>
                      {getTypeIcon(type)}
                    </div>
                    <span className="text-xs font-medium">{type}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount and Date */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Amount (₹) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({...formData, amount: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Trip and Vehicle */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Trip</label>
                <select
                  value={formData.tripId}
                  onChange={(e) => setFormData({...formData, tripId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Trip (Optional)</option>
                  {trips.map(trip => (
                    <option key={trip.id} value={trip.id}>
                      {trip.tripNumber} - {trip.fromLocation} → {trip.toLocation}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                <select
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Vehicle (Optional)</option>
                  {vehicles.map(vehicle => (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.registration} - {vehicle.model}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Fuel Card">Fuel Card</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Any additional notes..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                {loading ? "Updating..." : "Update Expense"}
              </Button>
              <Button type="button" variant="outline" asChild className="flex-1">
                <Link href={`/dashboard/expenses/${params.id}`}>Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}