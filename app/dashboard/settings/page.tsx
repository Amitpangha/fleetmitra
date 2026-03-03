"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface Settings {
  language: string
  theme: string
  notifications: boolean
  emailAlerts: boolean
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [settings, setSettings] = useState<Settings>({
    language: 'en',
    theme: 'light',
    notifications: true,
    emailAlerts: true,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/user/profile')
      if (!response.ok) throw new Error('Failed to fetch settings')
      const data = await response.json()
      setSettings(data.settings)
    } catch (err) {
      setError("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        language: formData.get('language'),
        theme: formData.get('theme'),
        notifications: formData.get('notifications') === 'on',
        emailAlerts: formData.get('emailAlerts') === 'on',
      }

      const response = await fetch('/api/user/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update settings')
      }

      setSuccess('Settings updated successfully')
      setSettings(data as Settings)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-blue-100 rounded-xl">
              <span className="text-3xl">⚙️</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Settings
              </h1>
              <p className="text-gray-600 mt-1">Manage your application preferences</p>
            </div>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-start gap-3">
            <span className="text-xl">❌</span>
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg flex items-start gap-3">
            <span className="text-xl">✅</span>
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8">
          {/* Preferences Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b">
              <span className="text-2xl">🎨</span>
              <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Language</label>
                <select
                  name="language"
                  defaultValue={settings.language}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="en">English 🇺🇸</option>
                  <option value="hi">हिन्दी (Hindi) 🇮🇳</option>
                  <option value="gu">ગુજરાતી (Gujarati) 🇮🇳</option>
                  <option value="mr">मराठी (Marathi) 🇮🇳</option>
                  <option value="ta">தமிழ் (Tamil) 🇮🇳</option>
                  <option value="te">తెలుగు (Telugu) 🇮🇳</option>
                  <option value="bn">বাংলা (Bengali) 🇮🇳</option>
                  <option value="kn">ಕನ್ನಡ (Kannada) 🇮🇳</option>
                  <option value="ml">മലയാളം (Malayalam) 🇮🇳</option>
                </select>
                <p className="text-xs text-gray-500">Choose your preferred language</p>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Theme</label>
                <select
                  name="theme"
                  defaultValue={settings.theme}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                >
                  <option value="light">Light ☀️</option>
                  <option value="dark">Dark 🌙</option>
                  <option value="system">System Default 💻</option>
                </select>
                <p className="text-xs text-gray-500">Choose your preferred theme</p>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b">
              <span className="text-2xl">🔔</span>
              <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Push Notifications</p>
                  <p className="text-sm text-gray-500 mt-1">Receive notifications in the app</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    name="notifications"
                    defaultChecked={settings.notifications}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>

              <label className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div>
                  <p className="font-medium text-gray-900">Email Alerts</p>
                  <p className="text-sm text-gray-500 mt-1">Receive email notifications for important updates</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    name="emailAlerts"
                    defaultChecked={settings.emailAlerts}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>
            </div>
          </div>

          {/* Data Management Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b">
              <span className="text-2xl">📊</span>
              <h2 className="text-xl font-semibold text-gray-800">Data Management</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => window.open('/api/export/vehicles', '_blank')}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left flex items-center gap-3"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <span className="text-xl">🚛</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Export Vehicles</p>
                  <p className="text-xs text-gray-500">Download vehicle list as CSV</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => window.open('/api/export/drivers', '_blank')}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left flex items-center gap-3"
              >
                <div className="p-2 bg-green-100 rounded-lg">
                  <span className="text-xl">👤</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Export Drivers</p>
                  <p className="text-xs text-gray-500">Download driver list as CSV</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => window.open('/api/export/trips', '_blank')}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left flex items-center gap-3"
              >
                <div className="p-2 bg-purple-100 rounded-lg">
                  <span className="text-xl">🗺️</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Export Trips</p>
                  <p className="text-xs text-gray-500">Download trip history as CSV</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => window.open('/api/export/expenses', '_blank')}
                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left flex items-center gap-3"
              >
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-xl">💰</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">Export Expenses</p>
                  <p className="text-xs text-gray-500">Download expense report as CSV</p>
                </div>
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 pb-2 border-b">
              <span className="text-2xl">⚠️</span>
              <h2 className="text-xl font-semibold text-red-600">Danger Zone</h2>
            </div>
            
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <h3 className="font-medium text-red-800 mb-2">Delete Account</h3>
              <p className="text-sm text-red-600 mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you absolutely sure? This action cannot be undone.')) {
                    // Handle account deletion
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Account
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end pt-6 border-t">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all font-medium flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <span>💾</span>
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>

        {/* Help Card */}
        <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <h4 className="font-medium text-blue-900">Need Help?</h4>
              <p className="text-sm text-blue-700 mt-1">
                If you're having trouble with your settings, please contact our support team at 
                <a href="mailto:support@fleetmitra.com" className="font-medium underline ml-1">support@fleetmitra.com</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}