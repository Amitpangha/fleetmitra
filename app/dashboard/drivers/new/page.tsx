"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function NewDriverPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    licenseNumber: "",
    licenseExpiry: "",
    experience: "",
    rating: "",
    status: "AVAILABLE",
    emergencyContact: "",
    bloodGroup: "",
  })

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/drivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create driver")
      }

      router.push("/dashboard/drivers")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/dashboard/drivers"
          className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-bold mb-4 transition-colors"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Drivers
        </Link>
        
        <div className="flex items-center gap-3 mb-2">
          <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
            <span className="text-3xl">👤</span>
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Add New Driver</h1>
            <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">Enter driver details below</p>
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

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 space-y-8">
        {/* Personal Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Personal Information</h2>
          
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                Full Name <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., John Doe"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                Phone Number <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="e.g., +91 9876543210"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g., john@example.com"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
              />
            </div>

            {/* Blood Group */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Blood Group</label>
              <select
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
              >
                <option value="" className="font-medium">Select blood group</option>
                {bloodGroups.map(bg => (
                  <option key={bg} value={bg} className="font-medium">{bg}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* License Information */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">License Information</h2>
          
          <div className="space-y-4">
            {/* License Number */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">
                License Number <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                required
                placeholder="e.g., DL-04201123456"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400 uppercase"
              />
            </div>

            {/* License Expiry */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">License Expiry Date</label>
              <input
                type="date"
                name="licenseExpiry"
                value={formData.licenseExpiry}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Experience (years)</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                min="0"
                max="50"
                placeholder="e.g., 5"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Employment Details</h2>
          
          <div className="space-y-4">
            {/* Status */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
              >
                <option value="AVAILABLE" className="font-medium">Available</option>
                <option value="ON_TRIP" className="font-medium">On Trip</option>
                <option value="OFF_DUTY" className="font-medium">Off Duty</option>
              </select>
            </div>

            {/* Rating */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Rating (0-5)</label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                min="0"
                max="5"
                step="0.1"
                placeholder="e.g., 4.5"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
              />
            </div>

            {/* Emergency Contact */}
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Emergency Contact Number</label>
              <input
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                placeholder="e.g., +91 9876543210"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-end pt-6 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/dashboard/drivers"
            className="w-full sm:w-auto px-6 py-3 text-center text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </span>
            ) : (
              "Save Driver"
            )}
          </button>
        </div>
      </form>

      {/* Help Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-blue-900 dark:text-blue-400">Driver Information</h4>
            <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mt-1">
              All fields marked with <span className="text-red-500">*</span> are required. 
              License expiry will be monitored for automatic notifications.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}