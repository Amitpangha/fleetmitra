"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"

interface Expense {
  id: string
  amount: number
  type: string
  description?: string
  date: string
  paymentMethod?: string
  notes?: string
  receiptUrl?: string
  createdAt: string
  vehicle?: {
    id: string
    registration: string
  }
  driver?: {
    id: string
    name: string
  }
  trip?: {
    id: string
    tripNumber: string
  }
}

export default function ExpenseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [expense, setExpense] = useState<Expense | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchExpense()
  }, [params.id])

  const fetchExpense = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/expenses/${params.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch expense')
      }
      
      const data = await response.json()
      setExpense(data)
      setError(null)
    } catch (err) {
      console.error("Error fetching expense:", err)
      setError("Failed to load expense details")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this expense?')) return
    
    try {
      const response = await fetch(`/api/expenses/${params.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete expense')
      }
      
      router.push('/dashboard/expenses')
      router.refresh()
    } catch (err) {
      console.error("Error deleting expense:", err)
      alert("Failed to delete expense")
    }
  }

  const getTypeColor = (type: string) => {
    const colors: {[key: string]: string} = {
      'Fuel': 'bg-orange-100 text-orange-800',
      'Maintenance': 'bg-yellow-100 text-yellow-800',
      'Repair': 'bg-red-100 text-red-800',
      'Insurance': 'bg-blue-100 text-blue-800',
      'Tax': 'bg-purple-100 text-purple-800',
      'Toll': 'bg-indigo-100 text-indigo-800',
      'Salary': 'bg-green-100 text-green-800',
      'Other': 'bg-gray-100 text-gray-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error || !expense) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error || "Expense not found"}
        </div>
        <Link
          href="/dashboard/expenses"
          className="mt-4 inline-block text-blue-600 hover:text-blue-800"
        >
          ← Back to Expenses
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <Link
              href="/dashboard/expenses"
              className="text-blue-600 hover:text-blue-800 mb-2 inline-block"
            >
              ← Back to Expenses
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Expense Details</h1>
            <p className="text-gray-600 mt-1">
              Recorded on {new Date(expense.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <Link
              href={`/dashboard/expenses/${expense.id}/edit`}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amount Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="text-4xl font-bold text-gray-900">₹{expense.amount.toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${getTypeColor(expense.type)}`}>
                {expense.type}
              </span>
            </div>
          </div>

          {/* Description Card */}
          {expense.description && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-700">{expense.description}</p>
            </div>
          )}

          {/* Notes Card */}
          {expense.notes && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Additional Notes</h2>
              <p className="text-gray-700">{expense.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column - Details */}
        <div className="space-y-6">
          {/* Date & Payment */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Transaction Details</h2>
            <dl className="space-y-3">
              <div>
                <dt className="text-sm text-gray-500">Date</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {new Date(expense.date).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">Payment Method</dt>
                <dd className="mt-1 text-sm font-medium text-gray-900">
                  {expense.paymentMethod || 'Not specified'}
                </dd>
              </div>
            </dl>
          </div>

          {/* Associated With */}
          {(expense.vehicle || expense.driver || expense.trip) && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Associated With</h2>
              <dl className="space-y-3">
                {expense.vehicle && (
                  <div>
                    <dt className="text-sm text-gray-500">Vehicle</dt>
                    <dd className="mt-1">
                      <Link
                        href={`/dashboard/vehicles/${expense.vehicle.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {expense.vehicle.registration}
                      </Link>
                    </dd>
                  </div>
                )}
                {expense.driver && (
                  <div>
                    <dt className="text-sm text-gray-500">Driver</dt>
                    <dd className="mt-1">
                      <Link
                        href={`/dashboard/drivers/${expense.driver.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {expense.driver.name}
                      </Link>
                    </dd>
                  </div>
                )}
                {expense.trip && (
                  <div>
                    <dt className="text-sm text-gray-500">Trip</dt>
                    <dd className="mt-1">
                      <Link
                        href={`/dashboard/trips/${expense.trip.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {expense.trip.tripNumber}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Receipt */}
          {expense.receiptUrl && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Receipt</h2>
              <a
                href={expense.receiptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                View Receipt
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}