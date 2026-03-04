"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

interface Document {
  id: string
  type: string
  documentNumber: string
  issuedDate: string
  expiryDate: string
  fileUrl?: string
  fileName?: string
  fileSize?: number
  mimeType?: string
  status: string
  vehicle?: {
    id: string
    registration: string
    model: string
  }
  driver?: {
    id: string
    name: string
    phone: string
  }
  createdAt: string
}

export default function DocumentDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [document, setDocument] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    fetchDocument()
  }, [params.id])

  const fetchDocument = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/documents/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch document')
      const data = await response.json()
      setDocument(data)
      setError(null)
    } catch (err) {
      setError("Failed to load document details")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) return
    
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/documents/${params.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) throw new Error('Failed to delete document')
      
      router.push('/dashboard/documents')
      router.refresh()
    } catch (err) {
      setError("Failed to delete document")
      setIsDeleting(false)
    }
  }

  const getStatusInfo = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24))

    if (daysUntilExpiry < 0) {
      return { color: 'bg-red-100 text-red-800', text: 'Expired', icon: '❌' }
    } else if (daysUntilExpiry <= 30) {
      return { color: 'bg-yellow-100 text-yellow-800', text: `${daysUntilExpiry} days left`, icon: '⚠️' }
    } else {
      return { color: 'bg-green-100 text-green-800', text: 'Valid', icon: '✅' }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading document...</p>
        </div>
      </div>
    )
  }

  if (error || !document) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">❌</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error</h3>
        <p className="text-sm text-gray-500 mb-4">{error || "Document not found"}</p>
        <Link
          href="/dashboard/documents"
          className="text-blue-600 hover:text-blue-800"
        >
          ← Back to Documents
        </Link>
      </div>
    )
  }

  const status = getStatusInfo(document.expiryDate)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Link
            href="/dashboard/documents"
            className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
          >
            ← Back to Documents
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Document Details</h1>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          {document.fileUrl && (
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
            >
              View File
            </a>
          )}
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex-1 sm:flex-none px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`${status.color} p-4 rounded-lg flex items-center gap-2`}>
        <span className="text-xl">{status.icon}</span>
        <span className="font-medium">Status: {status.text}</span>
      </div>

      {/* Document Details */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Document Type</h2>
            <p className="text-lg font-semibold text-gray-900">{document.type}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Document Number</h2>
            <p className="text-lg font-semibold text-gray-900">{document.documentNumber}</p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Issued Date</h2>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(document.issuedDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <h2 className="text-sm font-medium text-gray-500 mb-1">Expiry Date</h2>
            <p className="text-lg font-semibold text-gray-900">
              {new Date(document.expiryDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* File Info */}
        {document.fileName && (
          <div className="border-t pt-4">
            <h2 className="text-sm font-medium text-gray-500 mb-2">File Information</h2>
            <p className="text-gray-900">Name: {document.fileName}</p>
            {document.fileSize && (
              <p className="text-gray-600 text-sm mt-1">
                Size: {(document.fileSize / 1024).toFixed(2)} KB
              </p>
            )}
          </div>
        )}

        {/* Associated With */}
        {(document.vehicle || document.driver) && (
          <div className="border-t pt-4">
            <h2 className="text-sm font-medium text-gray-500 mb-3">Associated With</h2>
            <div className="space-y-3">
              {document.vehicle && (
                <Link
                  href={`/dashboard/vehicles/${document.vehicle.id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🚛</span>
                    <div>
                      <p className="font-medium text-gray-900">{document.vehicle.registration}</p>
                      <p className="text-sm text-gray-600">{document.vehicle.model}</p>
                    </div>
                  </div>
                </Link>
              )}
              {document.driver && (
                <Link
                  href={`/dashboard/drivers/${document.driver.id}`}
                  className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👤</span>
                    <div>
                      <p className="font-medium text-gray-900">{document.driver.name}</p>
                      <p className="text-sm text-gray-600">{document.driver.phone}</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        )}

        {/* Metadata */}
        <div className="border-t pt-4">
          <p className="text-xs text-gray-400">
            Added on {new Date(document.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}