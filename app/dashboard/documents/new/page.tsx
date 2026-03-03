"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { UploadButton } from "@uploadthing/react"
import { OurFileRouter } from "@/app/api/uploadthing/core"

interface Vehicle {
  id: string
  registration: string
}

interface Driver {
  id: string
  name: string
}

export default function NewDocumentPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [uploadedFile, setUploadedFile] = useState<{
    fileUrl: string
    fileName: string
    fileSize: number
    fileKey: string
  } | null>(null)

  const documentTypes = [
    "Insurance",
    "Fitness",
    "Permit",
    "Registration",
    "License",
    "Pollution",
    "Other"
  ]

  const [formData, setFormData] = useState({
    type: "",
    documentNumber: "",
    issuedDate: "",
    expiryDate: "",
    vehicleId: "",
    driverId: "",
    status: "VALID",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [vehiclesRes, driversRes] = await Promise.all([
        fetch('/api/vehicles'),
        fetch('/api/drivers')
      ])

      if (vehiclesRes.ok) {
        const data = await vehiclesRes.json()
        setVehicles(data)
      }

      if (driversRes.ok) {
        const data = await driversRes.json()
        setDrivers(data)
      }
    } catch (err) {
      console.error("Error fetching data:", err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!formData.type) {
      setError("Please select document type")
      return
    }
    if (!formData.documentNumber) {
      setError("Please enter document number")
      return
    }
    if (!formData.issuedDate) {
      setError("Please select issued date")
      return
    }
    if (!formData.expiryDate) {
      setError("Please select expiry date")
      return
    }
    if (!uploadedFile) {
      setError("Please upload a document file")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          fileUrl: uploadedFile.fileUrl,
          fileName: uploadedFile.fileName,
          fileSize: uploadedFile.fileSize,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create document")
      }

      router.push("/dashboard/documents")
      router.refresh()
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.type && 
           formData.documentNumber && 
           formData.issuedDate && 
           formData.expiryDate && 
           uploadedFile
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header with breadcrumb */}
        <div className="mb-8">
          <Link
            href="/dashboard/documents"
            className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors mb-4 group"
          >
            <svg className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Documents
          </Link>
          
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg shadow-blue-200">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Upload New Document</h1>
              <p className="text-sm text-slate-600 mt-1">Add a document to your secure vault</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3 animate-slideIn">
            <span className="text-red-500">⚠️</span>
            <span className="text-sm font-medium text-red-700">{error}</span>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Progress Steps */}
          <div className="px-6 pt-6 pb-4 border-b border-slate-100">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                    (step === 1 && uploadedFile) || 
                    (step === 2 && formData.type && formData.documentNumber) ||
                    (step === 3 && isFormValid())
                      ? 'bg-green-500 text-white shadow-lg shadow-green-200'
                      : step === 1 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                        : 'bg-slate-100 text-slate-400'
                  }`}>
                    {step === 1 && (uploadedFile ? '✓' : '1')}
                    {step === 2 && (formData.type && formData.documentNumber ? '✓' : '2')}
                    {step === 3 && (isFormValid() ? '✓' : '3')}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-0.5 mx-2 rounded ${
                      (step === 1 && uploadedFile) || (step === 2 && formData.type && formData.documentNumber)
                        ? 'bg-green-500'
                        : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Step 1: File Upload */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">1</span>
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Upload File</h2>
              </div>
              
              {!uploadedFile ? (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 transition-all bg-slate-50/50">
                  <UploadButton<OurFileRouter>
                    endpoint="documentUploader"
                    onUploadBegin={() => {
                      setIsUploading(true)
                      setUploadProgress(0)
                    }}
                    onClientUploadComplete={(res) => {
                      if (res && res[0]) {
                        setUploadedFile({
                          fileUrl: res[0].ufsUrl,
                          fileName: res[0].name,
                          fileSize: res[0].size,
                          fileKey: res[0].key,
                        })
                        setUploadProgress(100)
                        setIsUploading(false)
                      }
                    }}
                    onUploadProgress={(progress) => {
                      setUploadProgress(progress)
                    }}
                    onUploadError={(error) => {
                      setError(`Upload failed: ${error.message}`)
                      setIsUploading(false)
                    }}
                    appearance={{
                      button: "bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm",
                      container: "w-full",
                      allowedContent: "text-sm text-slate-500 mt-3",
                    }}
                    content={{
                      button: isUploading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Uploading... {uploadProgress}%
                        </span>
                      ) : "Choose File",
                      allowedContent: "PDF, PNG, JPG up to 4MB",
                    }}
                  />
                  
                  {isUploading && (
                    <div className="mt-4">
                      <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-2">{uploadProgress}% uploaded</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">{uploadedFile.fileName}</p>
                      <p className="text-xs text-green-600">{(uploadedFile.fileSize / 1024).toFixed(2)} KB • Uploaded successfully</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadedFile(null)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Step 2: Document Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">2</span>
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Document Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                    Document Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900"
                  >
                    <option value="">Select type</option>
                    {documentTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                    Document Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="documentNumber"
                    value={formData.documentNumber}
                    onChange={handleChange}
                    required
                    placeholder="e.g., DL-123456789"
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                    Issued Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="issuedDate"
                    value={formData.issuedDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Association */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-lg text-xs font-bold">3</span>
                <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wide">Associate With (Optional)</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">Vehicle</label>
                  <select
                    name="vehicleId"
                    value={formData.vehicleId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900"
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map(vehicle => (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.registration}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-medium text-slate-700 uppercase tracking-wide">Driver</label>
                  <select
                    name="driverId"
                    value={formData.driverId}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-slate-900"
                  >
                    <option value="">Select a driver</option>
                    {drivers.map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200">
              <Link
                href="/dashboard/documents"
                className="px-6 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading || isUploading || !isFormValid()}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg shadow-blue-200"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                    </svg>
                    Save Document
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Help Card */}
        <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-blue-600">💡</span>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-blue-900">Pro Tip</h4>
              <p className="text-sm text-blue-700 mt-1">
                Upload clear, readable copies of your documents. We'll automatically track expiry dates 
                and send you reminders before they expire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}