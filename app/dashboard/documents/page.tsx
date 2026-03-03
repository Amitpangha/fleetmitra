"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Document {
  id: string
  type: string
  documentNumber: string
  issuedDate: string
  expiryDate: string
  fileUrl?: string
  fileName?: string
  status: string
  vehicle?: { registration: string }
  driver?: { name: string }
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterType, setFilterType] = useState("ALL")
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  const documentTypes = ["Insurance", "Fitness", "Permit", "Registration", "License", "Pollution", "Other"]

  useEffect(() => {
    fetchDocuments()
  }, [filterType])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterType !== "ALL") params.append('type', filterType)
      
      const response = await fetch(`/api/documents?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch documents')
      
      const data = await response.json()
      setDocuments(data)
      setError(null)
    } catch (err) {
      setError("Failed to load documents")
    } finally {
      setLoading(false)
    }
  }

  const getStatusInfo = (expiryDate: string) => {
    const today = new Date()
    const expiry = new Date(expiryDate)
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 3600 * 24))

    if (daysUntilExpiry < 0) {
      return { 
        color: 'bg-red-100 text-red-700 border-red-200', 
        text: 'Expired', 
        icon: '❌',
        badge: 'bg-red-500'
      }
    } else if (daysUntilExpiry <= 30) {
      return { 
        color: 'bg-amber-100 text-amber-700 border-amber-200', 
        text: `${daysUntilExpiry} days left`, 
        icon: '⚠️',
        badge: 'bg-amber-500'
      }
    } else {
      return { 
        color: 'bg-emerald-100 text-emerald-700 border-emerald-200', 
        text: 'Valid', 
        icon: '✅',
        badge: 'bg-emerald-500'
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-sm font-medium text-slate-600">Loading documents...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Documents</h1>
            <p className="text-sm text-slate-600 mt-1">Manage your vehicle and driver documents</p>
          </div>
          <Link
            href="/dashboard/documents/new"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg shadow-blue-200"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Upload Document
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3">
            <span className="text-red-500">⚠️</span>
            <span className="text-sm font-medium text-red-700">{error}</span>
          </div>
        )}

        {/* Filter Bar */}
        <div className="mb-6">
          <div className="relative inline-block">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="inline-flex items-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {filterType === 'ALL' ? 'All Documents' : filterType}
            </button>

            {showFilterMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 py-1 z-10 animate-fadeIn">
                <button
                  onClick={() => {
                    setFilterType("ALL")
                    setShowFilterMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  All Documents
                </button>
                {documentTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      setFilterType(type)
                      setShowFilterMenu(false)
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {type}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Documents Grid */}
        {documents.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-12 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No documents yet</h3>
            <p className="text-sm text-slate-600 mb-6">Get started by uploading your first document</p>
            <Link
              href="/dashboard/documents/new"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Upload Document
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => {
              const status = getStatusInfo(doc.expiryDate)
              
              return (
                <Link
                  key={doc.id}
                  href={`/dashboard/documents/${doc.id}`}
                  className="group bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all overflow-hidden"
                >
                  {/* Status Bar */}
                  <div className={`h-1.5 ${status.badge}`}></div>
                  
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <svg className="w-5 h-5 text-slate-600 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{doc.type}</h3>
                          <p className="text-xs text-slate-500 mt-0.5">{doc.documentNumber}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${status.color}`}>
                        {status.icon} {status.text}
                      </span>
                    </div>

                    {/* Association */}
                    {(doc.vehicle || doc.driver) && (
                      <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                        {doc.vehicle && (
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-600">🚛</span>
                            <span className="font-medium text-slate-900">{doc.vehicle.registration}</span>
                          </div>
                        )}
                        {doc.driver && (
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <span className="text-slate-600">👤</span>
                            <span className="font-medium text-slate-900">{doc.driver.name}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Dates */}
                    <div className="flex justify-between text-xs">
                      <div>
                        <span className="text-slate-500">Issued:</span>
                        <span className="ml-1 font-medium text-slate-900">
                          {new Date(doc.issuedDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Expires:</span>
                        <span className={`ml-1 font-medium ${
                          new Date(doc.expiryDate) < new Date() ? 'text-red-600' : 'text-slate-900'
                        }`}>
                          {new Date(doc.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* View Link */}
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <span className="text-sm text-blue-600 group-hover:text-blue-700 font-medium inline-flex items-center">
                        View Details
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}