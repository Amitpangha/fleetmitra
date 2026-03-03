"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewVehiclePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)
  
  const [formData, setFormData] = useState({
    registration: "",
    type: "",
    model: "",
    capacity: "",
    make: "",
    year: "",
    fuelType: "Diesel",
    status: "ACTIVE",
    fitnessExpiry: "",
    insuranceExpiry: "",
    lastServiceDate: "",
    permitExpiry: "",
    nextServiceDue: "",
  })

  const vehicleTypes = ["Truck", "Trailer", "Container", "Flatbed", "Refrigerated", "Tanker", "Dumper", "Other"]
  const fuelTypes = ["Diesel", "Petrol", "Electric", "CNG", "Hybrid"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/vehicles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create vehicle")
      }

      router.push("/dashboard/vehicles")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/vehicles"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Vehicles
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <span className="text-3xl">🚛</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Add New Vehicle</h1>
            <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">Enter vehicle details below</p>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-start gap-3">
          <span className="text-xl">❌</span>
          <span className="font-bold">{error}</span>
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
              currentStep >= step 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`flex-1 h-1 mx-2 ${
                currentStep > step 
                  ? 'bg-blue-600' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 space-y-8">
        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Basic Information</h2>
            
            <div className="space-y-4">
              {/* Registration - FIXED CONTRAST */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  Registration Number <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="registration"
                  value={formData.registration}
                  onChange={handleChange}
                  required
                  placeholder="e.g., HR20B1234"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
                />
              </div>

              {/* Vehicle Type - FIXED CONTRAST */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  Vehicle Type <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                >
                  <option value="" className="font-medium">Select vehicle type</option>
                  {vehicleTypes.map(type => (
                    <option key={type} value={type} className="font-medium">{type}</option>
                  ))}
                </select>
              </div>

              {/* Make - FIXED CONTRAST */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  Make <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Tata, Volvo"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
                />
              </div>

              {/* Model - FIXED CONTRAST */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  Model <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 2518, 3523"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
                />
              </div>

              {/* Year - FIXED CONTRAST */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Year</label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  placeholder="e.g., 2024"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Technical Details */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Technical Details</h2>
            
            <div className="space-y-4">
              {/* Capacity - FIXED CONTRAST */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                  Capacity (tons) <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  step="0.1"
                  min="0"
                  placeholder="e.g., 25"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
                />
              </div>

              {/* Fuel Type - FIXED CONTRAST */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Fuel Type</label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                >
                  {fuelTypes.map(type => (
                    <option key={type} value={type} className="font-medium">{type}</option>
                  ))}
                </select>
              </div>

              {/* Status - FIXED CONTRAST */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
                >
                  <option value="ACTIVE" className="font-medium">Active</option>
                  <option value="MAINTENANCE" className="font-medium">Maintenance</option>
                  <option value="INACTIVE" className="font-medium">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents & Expiry */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Documents & Expiry</h2>
            
            <div className="space-y-4">
              {/* Fitness Expiry - FIXED CONTRAST */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Fitness Expiry Date</label>
                <input
                  type="date"
                  name="fitnessExpiry"
                  value={formData.fitnessExpiry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>

              {/* Insurance Expiry - FIXED CONTRAST */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Insurance Expiry Date</label>
                <input
                  type="date"
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>

              {/* Permit Expiry - FIXED CONTRAST */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Permit Expiry Date</label>
                <input
                  type="date"
                  name="permitExpiry"
                  value={formData.permitExpiry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>

              {/* Last Service Date - FIXED CONTRAST */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Last Service Date</label>
                <input
                  type="date"
                  name="lastServiceDate"
                  value={formData.lastServiceDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
                />
              </div>

              {/* Next Service Due - FIXED CONTRAST */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Next Service Due (km)</label>
                <input
                  type="number"
                  name="nextServiceDue"
                  value={formData.nextServiceDue}
                  onChange={handleChange}
                  min="0"
                  placeholder="e.g., 5000"
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              ← Previous
            </button>
          ) : (
            <div></div>
          )}
          
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-md transition-all"
            >
              Next →
            </button>
          ) : (
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-xl hover:from-green-700 hover:to-green-800 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Vehicle"
              )}
            </button>
          )}
        </div>
      </form>

      {/* Help Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-400">Quick Tips</h4>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mt-1">
              Fill in all required fields marked with <span className="text-red-500">*</span>. 
              You can add document expiry dates later from the document management section.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}