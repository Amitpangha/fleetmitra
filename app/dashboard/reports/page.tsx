"use client"

import { useState } from "react"
import Link from "next/link"

export default function ReportsPage() {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reportType, setReportType] = useState('expense')
  const [format, setFormat] = useState('pdf')
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })

  const reportTypes = [
    { value: 'expense', label: 'Expense Report', icon: '💰', description: 'Detailed expense breakdown with categories and totals' },
    { value: 'trip', label: 'Trip Report', icon: '🗺️', description: 'Trip summary with routes, dates, and freight amounts' },
    { value: 'document', label: 'Document Report', icon: '📄', description: 'Document status with expiry tracking' },
  ]

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: reportType,
          format,
          dateRange: {
            start: dateRange.start,
            end: dateRange.end,
          },
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate report')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `report.${format === 'excel' ? 'xlsx' : 'pdf'}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Generate Reports</h1>
        <p className="text-gray-700 dark:text-gray-300 font-medium mt-1">Create detailed reports for expenses, trips, and documents</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-500 text-red-700 dark:text-red-400 p-4 rounded-xl flex items-start gap-3">
          <span className="text-xl">❌</span>
          <span className="font-bold">{error}</span>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 space-y-8">
        {/* Report Type Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">1. Select Report Type</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setReportType(type.value)}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  reportType === type.value
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                }`}
              >
                <div className="text-4xl mb-3">{type.icon}</div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{type.label}</h3>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{type.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">2. Choose Format</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setFormat('pdf')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${
                format === 'pdf'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <span className="text-2xl">📄</span>
              <span className="font-bold text-gray-900 dark:text-white">PDF Document</span>
            </button>
            <button
              onClick={() => setFormat('excel')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${
                format === 'excel'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
              }`}
            >
              <span className="text-2xl">📊</span>
              <span className="font-bold text-gray-900 dark:text-white">Excel Spreadsheet</span>
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">3. Select Date Range</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-800 dark:text-gray-200">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium"
              />
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleGenerateReport}
            disabled={isGenerating}
            className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-800 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto text-lg"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating Report...
              </>
            ) : (
              <>
                <span>📊</span>
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {/* Features Card */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
        <h3 className="font-bold text-blue-900 dark:text-blue-400 mb-3">Report Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-300">
            <span>✓</span> Professional PDF formatting
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-300">
            <span>✓</span> Excel with multiple sheets
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-300">
            <span>✓</span> Date range filtering
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-blue-800 dark:text-blue-300">
            <span>✓</span> Summary statistics
          </div>
        </div>
      </div>
    </div>
  )
}