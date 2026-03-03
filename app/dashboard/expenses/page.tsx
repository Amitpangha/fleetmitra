"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface Expense {
  id: string
  amount: number
  type: string
  description?: string
  date: string
  paymentMethod?: string
  vehicle?: { registration: string }
  driver?: { name: string }
  trip?: { tripNumber: string }
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  useEffect(() => {
    fetchExpenses()
  }, [typeFilter, dateRange])

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (typeFilter !== "ALL") params.append('type', typeFilter)
      if (dateRange.start) params.append('startDate', dateRange.start)
      if (dateRange.end) params.append('endDate', dateRange.end)
      
      const response = await fetch(`/api/expenses?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to fetch expenses')
      
      const data = await response.json()
      setExpenses(data.expenses || [])
      setError(null)
    } catch (err) {
      setError("Failed to load expenses")
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Fuel': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      'Maintenance': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      'Repair': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      'Insurance': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      'Tax': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
      'Toll': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
      'Salary': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    }
    return colors[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
  }

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = 
      expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.vehicle?.registration?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.driver?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const totalAmount = filteredExpenses.reduce((sum, e) => sum + e.amount, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="spinner-md mx-auto"></div>
          <p className="mt-4 text-gray-700 dark:text-gray-300 font-medium">Loading expenses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Expenses</h1>
          <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">Track and manage all expenses</p>
        </div>
        <Link
          href="/dashboard/expenses/new"
          className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-md transition-all flex items-center justify-center gap-2"
        >
          <span>➕</span>
          Add Expense
        </Link>
      </div>

      {/* Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">₹{totalAmount.toLocaleString()}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Number of Transactions</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{filteredExpenses.length}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Average per Transaction</p>
            <p className="text-3xl font-bold text-gray-900 dark:text-white">
              ₹{(totalAmount / (filteredExpenses.length || 1)).toLocaleString()}
            </p>
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

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative md:col-span-2">
          <input
            type="text"
            placeholder="🔍 Search expenses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400"
          />
          <span className="absolute left-3 top-3.5 text-gray-600 dark:text-gray-400">🔍</span>
        </div>
        
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold"
        >
          <option value="ALL" className="font-medium">All Types</option>
          <option value="Fuel" className="font-medium">Fuel</option>
          <option value="Maintenance" className="font-medium">Maintenance</option>
          <option value="Repair" className="font-medium">Repair</option>
          <option value="Insurance" className="font-medium">Insurance</option>
          <option value="Toll" className="font-medium">Toll</option>
          <option value="Salary" className="font-medium">Salary</option>
        </select>

        <input
          type="date"
          placeholder="Start Date"
          value={dateRange.start}
          onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
        />
      </div>

      {/* Expenses Table */}
      {filteredExpenses.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-6xl mb-4 opacity-50">💰</div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No expenses found</h3>
          <p className="text-gray-700 dark:text-gray-300 font-medium mb-6">
            {searchTerm ? "Try adjusting your search" : "Get started by adding your first expense"}
          </p>
          {!searchTerm && (
            <Link
              href="/dashboard/expenses/new"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800"
            >
              Add Expense
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Date</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase">Associated With</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 text-xs font-bold rounded-full ${getTypeColor(expense.type)}`}>
                        {expense.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {expense.description || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                      ₹{expense.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {expense.vehicle && <div>🚛 {expense.vehicle.registration}</div>}
                      {expense.driver && <div>👤 {expense.driver.name}</div>}
                      {expense.trip && <div>🗺️ {expense.trip.tripNumber}</div>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}