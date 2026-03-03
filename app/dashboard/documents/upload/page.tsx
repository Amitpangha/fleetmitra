"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Upload, X, FileText, AlertCircle, Calendar, Truck } from "lucide-react"
import { Button } from "@/components/button"
import { Input } from "@/components/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import toast from "react-hot-toast"

interface Vehicle {
  id: string
  registration: string
  model: string
}

export default function UploadDocumentPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [formData, setFormData] = useState({
    type: "Insurance",
    documentNumber: "",
    vehicleId: "",
    issuedDate: "",
    expiryDate: ""
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    // Mock vehicles
    setVehicles([
      { id: "1", registration: "MH12AB1234", model: "Tata LPK 2518" },
      { id: "2", registration: "DL5CQ9876", model: "Ashok Leyland Partner" },
      { id: "3", registration: "GJ01XY5678", model: "Mahindra Blazo X" }
    ])
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB")
      return
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPEG, PNG, and PDF files are allowed")
      return
    }

    setSelectedFile(file)
    
    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      toast.error("Please select a file to upload")
      return
    }

    if (!formData.vehicleId) {
      toast.error("Please select a vehicle")
      return
    }

    if (!formData.documentNumber) {
      toast.error("Please enter document number")
      return
    }

    if (!formData.issuedDate || !formData.expiryDate) {
      toast.error("Please enter issued and expiry dates")
      return
    }

    // Validate dates
    const issued = new Date(formData.issuedDate)
    const expiry = new Date(formData.expiryDate)
    if (expiry <= issued) {
      toast.error("Expiry date must be after issued date")
      return
    }

    setLoading(true)
    try {
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast.success("Document uploaded successfully")
      router.push('/dashboard/documents')
    } catch (error) {
      toast.error("Failed to upload document")
    } finally {
      setLoading(false)
    }
  }

  const documentTypes = [
    { value: "Insurance", label: "Insurance", icon: "🛡️" },
    { value: "Permit", label: "Permit", icon: "📋" },
    { value: "Registration", label: "Registration", icon: "📄" },
    { value: "PUC", label: "PUC (Pollution)", icon: "🌿" },
    { value: "Fitness", label: "Fitness Certificate", icon: "✅" }
  ]

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/dashboard/documents"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Documents
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Upload Document</h1>
        <p className="text-gray-500 mt-1">Upload and manage vehicle documents</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Document Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document File <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6">
                {selectedFile ? (
                  <div className="space-y-3">
                    {preview ? (
                      <div className="relative">
                        <img 
                          src={preview} 
                          alt="Preview" 
                          className="max-h-48 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null)
                            setPreview(null)
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-8 w-8 text-blue-600" />
                          <div>
                            <p className="font-medium text-gray-900">{selectedFile.name}</p>
                            <p className="text-sm text-gray-500">
                              {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <label className="flex flex-col items-center cursor-pointer">
                    <Upload className="h-10 w-10 text-gray-400 mb-3" />
                    <span className="text-sm font-medium text-gray-900 mb-1">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-xs text-gray-500 mb-2">
                      PDF, PNG, JPG up to 5MB
                    </span>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button type="button" variant="outline" size="sm">
                      Select File
                    </Button>
                  </label>
                )}
              </div>
            </div>

            {/* Document Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Document Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {documentTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({...formData, type: type.value})}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all ${
                      formData.type === type.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <span className="text-xs font-medium">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Document Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Number <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.documentNumber}
                onChange={(e) => setFormData({...formData, documentNumber: e.target.value.toUpperCase()})}
                placeholder="e.g., INS-2024-001"
                required
              />
            </div>

            {/* Vehicle Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.vehicleId}
                onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Vehicle</option>
                {vehicles.map(vehicle => (
                  <option key={vehicle.id} value={vehicle.id}>
                    {vehicle.registration} - {vehicle.model}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issued Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.issuedDate}
                  onChange={(e) => setFormData({...formData, issuedDate: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Expiry Warning */}
            {formData.expiryDate && (
              <div className={`p-3 rounded-lg flex items-start gap-3 ${
                new Date(formData.expiryDate) < new Date() 
                  ? 'bg-red-50' 
                  : new Date(formData.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                  ? 'bg-yellow-50'
                  : 'bg-green-50'
              }`}>
                <AlertCircle className={`h-5 w-5 flex-shrink-0 mt-0.5 ${
                  new Date(formData.expiryDate) < new Date() 
                    ? 'text-red-600' 
                    : new Date(formData.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`} />
                <div>
                  <p className={`text-sm font-medium ${
                    new Date(formData.expiryDate) < new Date() 
                      ? 'text-red-800' 
                      : new Date(formData.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      ? 'text-yellow-800'
                      : 'text-green-800'
                  }`}>
                    {new Date(formData.expiryDate) < new Date() 
                      ? 'This document has already expired!'
                      : new Date(formData.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                      ? 'This document will expire within 30 days'
                      : 'Document expiry date is valid'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={loading || !selectedFile} className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                {loading ? "Uploading..." : "Upload Document"}
              </Button>
              <Button type="button" variant="outline" asChild className="flex-1">
                <Link href="/dashboard/documents">Cancel</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}