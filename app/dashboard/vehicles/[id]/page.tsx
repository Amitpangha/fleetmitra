"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { 
  ArrowLeft,
  Edit,
  Trash2,
  Truck,
  Calendar,
  Wrench,
  FileText,
  AlertCircle,
  Fuel,
  User,
  MapPin,
  Phone,
  Mail,
  Download,
  Eye,
  Clock,
  IndianRupee,
  Package
} from "lucide-react"
import { Button } from "@/components/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/card"
import toast from "react-hot-toast"

interface Vehicle {
  id: string
  registration: string
  model: string
  make: string
  type: string
  capacity: number
  year: number
  status: "ACTIVE" | "MAINTENANCE" | "IDLE"
  fuelType: string
  imageUrl?: string
  insuranceExpiry?: string
  permitExpiry?: string
  fitnessExpiry?: string
  lastServiceDate?: string
  nextServiceDue?: number
  createdAt: string
  driver?: {
    id: string
    name: string
    phone: string
    email?: string
    licenseNumber: string
  }
  trips?: Array<{
    id: string
    from: string
    to: string
    date: string
    status: string
    amount: number
  }>
  documents?: Array<{
    id: string
    type: string
    name: string
    expiryDate?: string
    url: string
  }>
  maintenance?: Array<{
    id: string
    type: string
    date: string
    description: string
    cost: number
    workshop: string
  }>
}

export default function VehicleDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "trips" | "maintenance" | "documents">("overview")

  useEffect(() => {
    fetchVehicle()
  }, [])

  const fetchVehicle = async () => {
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      setVehicle(mockVehicle)
    } catch (error) {
      toast.error("Failed to fetch vehicle details")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return

    try {
      // In a real app, this would be an API call
      toast.success("Vehicle deleted successfully")
      router.push("/dashboard/vehicles")
    } catch (error) {
      toast.error("Failed to delete vehicle")
    }
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case "ACTIVE": return "bg-green-100 text-green-700"
      case "MAINTENANCE": return "bg-yellow-100 text-yellow-700"
      case "IDLE": return "bg-gray-100 text-gray-700"
      default: return "bg-gray-100 text-gray-700"
    }
  }

  const getDaysLeft = (expiryDate?: string) => {
    if (!expiryDate) return null
    const today = new Date()
    const expiry = new Date(expiryDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="text-center py-12">
        <Truck className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Vehicle not found</h3>
        <Button asChild>
          <Link href="/dashboard/vehicles">Back to Vehicles</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dashboard/vehicles"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Vehicles
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{vehicle.registration}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(vehicle.status)}`}>
              {vehicle.status}
            </span>
          </div>
          <p className="text-gray-500 mt-1">{vehicle.make} {vehicle.model}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/vehicles/${params.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Total Trips</p>
            <p className="text-2xl font-bold text-gray-900">{vehicle.trips?.length || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">
              ₹{vehicle.trips?.reduce((sum, t) => sum + t.amount, 0).toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Maintenance Cost</p>
            <p className="text-2xl font-bold text-orange-600">
              ₹{vehicle.maintenance?.reduce((sum, m) => sum + m.cost, 0).toLocaleString() || 0}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Documents</p>
            <p className="text-2xl font-bold text-gray-900">{vehicle.documents?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          <TabButton 
            active={activeTab === "overview"} 
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </TabButton>
          <TabButton 
            active={activeTab === "trips"} 
            onClick={() => setActiveTab("trips")}
          >
            Trips ({vehicle.trips?.length || 0})
          </TabButton>
          <TabButton 
            active={activeTab === "maintenance"} 
            onClick={() => setActiveTab("maintenance")}
          >
            Maintenance ({vehicle.maintenance?.length || 0})
          </TabButton>
          <TabButton 
            active={activeTab === "documents"} 
            onClick={() => setActiveTab("documents")}
          >
            Documents ({vehicle.documents?.length || 0})
          </TabButton>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <InfoRow label="Registration" value={vehicle.registration} />
              <InfoRow label="Make" value={vehicle.make} />
              <InfoRow label="Model" value={vehicle.model} />
              <InfoRow label="Type" value={vehicle.type} />
              <InfoRow label="Capacity" value={`${vehicle.capacity} tons`} />
              <InfoRow label="Year" value={vehicle.year?.toString() || "N/A"} />
              <InfoRow label="Fuel Type" value={vehicle.fuelType} />
              <InfoRow label="Added On" value={new Date(vehicle.createdAt).toLocaleDateString()} />
            </CardContent>
          </Card>

          {/* Driver Information */}
          <Card>
            <CardHeader>
              <CardTitle>Assigned Driver</CardTitle>
            </CardHeader>
            <CardContent>
              {vehicle.driver ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{vehicle.driver.name}</p>
                      <p className="text-sm text-gray-500">Driver</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{vehicle.driver.phone}</span>
                    </div>
                    {vehicle.driver.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{vehicle.driver.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span>License: {vehicle.driver.licenseNumber}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">No driver assigned</p>
                  <Button variant="outline" size="sm">Assign Driver</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents Expiry */}
          <Card>
            <CardHeader>
              <CardTitle>Documents Expiry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <ExpiryItem 
                  label="Insurance"
                  date={vehicle.insuranceExpiry}
                  daysLeft={getDaysLeft(vehicle.insuranceExpiry)}
                />
                <ExpiryItem 
                  label="Permit"
                  date={vehicle.permitExpiry}
                  daysLeft={getDaysLeft(vehicle.permitExpiry)}
                />
                <ExpiryItem 
                  label="Fitness Certificate"
                  date={vehicle.fitnessExpiry}
                  daysLeft={getDaysLeft(vehicle.fitnessExpiry)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Info */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Last Service</span>
                  <span className="font-medium text-gray-900">
                    {vehicle.lastServiceDate ? new Date(vehicle.lastServiceDate).toLocaleDateString() : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Next Service Due</span>
                  <span className="font-medium text-gray-900">
                    {vehicle.nextServiceDue ? `${vehicle.nextServiceDue} km` : "N/A"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "trips" && (
        <Card>
          <CardHeader>
            <CardTitle>Trip History</CardTitle>
          </CardHeader>
          <CardContent>
            {vehicle.trips && vehicle.trips.length > 0 ? (
              <div className="space-y-3">
                {vehicle.trips.map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{trip.from} → {trip.to}</p>
                      <p className="text-sm text-gray-500">{new Date(trip.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">₹{trip.amount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">{trip.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No trips found</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "maintenance" && (
        <Card>
          <CardHeader>
            <CardTitle>Maintenance Records</CardTitle>
          </CardHeader>
          <CardContent>
            {vehicle.maintenance && vehicle.maintenance.length > 0 ? (
              <div className="space-y-3">
                {vehicle.maintenance.map((record) => (
                  <div key={record.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-gray-900">{record.type}</p>
                      <p className="text-sm font-medium text-gray-900">₹{record.cost.toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{record.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <span>{new Date(record.date).toLocaleDateString()}</span>
                      <span>{record.workshop}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No maintenance records</p>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "documents" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <Button size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Upload New
            </Button>
          </CardHeader>
          <CardContent>
            {vehicle.documents && vehicle.documents.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vehicle.documents.map((doc) => {
                  const daysLeft = doc.expiryDate ? getDaysLeft(doc.expiryDate) : null
                  return (
                    <div key={doc.id} className="p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-gray-400" />
                          <p className="font-medium text-gray-900">{doc.type}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <a href={doc.url} target="_blank" className="p-1 hover:bg-gray-200 rounded">
                            <Eye className="h-4 w-4" />
                          </a>
                          <a href={doc.url} download className="p-1 hover:bg-gray-200 rounded">
                            <Download className="h-4 w-4" />
                          </a>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{doc.name}</p>
                      {daysLeft && (
                        <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1
                          ${daysLeft < 0 ? 'bg-red-100 text-red-700' :
                            daysLeft < 30 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'}`}>
                          <AlertCircle className="h-3 w-3" />
                          {daysLeft < 0 ? 'Expired' : `${daysLeft} days left`}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">No documents uploaded</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Tab Button Component
function TabButton({ active, onClick, children }: any) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-1 text-sm font-medium border-b-2 -mb-px ${
        active 
          ? 'border-blue-600 text-blue-600' 
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {children}
    </button>
  )
}

// Info Row Component
function InfoRow({ label, value }: any) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

// Expiry Item Component
function ExpiryItem({ label, date, daysLeft }: any) {
  if (!date) {
    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm text-gray-400">Not set</span>
      </div>
    )
  }

  const getExpiryColor = () => {
    if (daysLeft < 0) return "text-red-600"
    if (daysLeft < 30) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <div className="text-right">
        <span className="text-sm text-gray-900">{new Date(date).toLocaleDateString()}</span>
        <p className={`text-xs ${getExpiryColor()}`}>
          {daysLeft < 0 ? 'Expired' : `${daysLeft} days left`}
        </p>
      </div>
    </div>
  )
}

// Mock Data
const mockVehicle: Vehicle = {
  id: "1",
  registration: "MH12AB1234",
  model: "LPK 2518",
  make: "Tata",
  type: "Truck",
  capacity: 25,
  year: 2023,
  status: "ACTIVE",
  fuelType: "Diesel",
  insuranceExpiry: "2025-03-15",
  permitExpiry: "2024-12-20",
  fitnessExpiry: "2024-08-10",
  lastServiceDate: "2024-02-15",
  nextServiceDue: 15000,
  createdAt: "2023-01-15",
  driver: {
    id: "1",
    name: "Ramesh Kumar",
    phone: "+91 98765 43210",
    email: "ramesh@example.com",
    licenseNumber: "DL-0420113456789"
  },
  trips: [
    {
      id: "1",
      from: "Mumbai",
      to: "Delhi",
      date: "2024-03-15",
      status: "Completed",
      amount: 45000
    },
    {
      id: "2",
      from: "Delhi",
      to: "Bangalore",
      date: "2024-03-10",
      status: "Completed",
      amount: 62000
    }
  ],
  maintenance: [
    {
      id: "1",
      type: "Oil Change",
      date: "2024-02-15",
      description: "Engine oil and filter change",
      cost: 4500,
      workshop: "Tata Authorized Service"
    },
    {
      id: "2",
      type: "Tyre Rotation",
      date: "2024-01-20",
      description: "Tyre rotation and balancing",
      cost: 1200,
      workshop: "Quick Service Center"
    }
  ],
  documents: [
    {
      id: "1",
      type: "Insurance",
      name: "insurance_2024.pdf",
      expiryDate: "2025-03-15",
      url: "#"
    },
    {
      id: "2",
      type: "Permit",
      name: "national_permit.pdf",
      expiryDate: "2024-12-20",
      url: "#"
    }
  ]
}