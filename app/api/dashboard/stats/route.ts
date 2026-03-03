import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfYear = new Date(now.getFullYear(), 0, 1)

    const [
      vehicles,
      drivers,
      trips,
      expenses,
      monthlyExpenses,
      yearlyExpenses,
      recentTrips,
      expiringItems
    ] = await Promise.all([
      prisma.vehicle.findMany({ where: { userId }, select: { status: true } }),
      prisma.driver.findMany({ where: { userId }, select: { status: true } }),
      prisma.trip.findMany({ where: { userId }, select: { status: true, freightAmount: true } }),
      prisma.expense.findMany({ where: { userId }, select: { amount: true, date: true, type: true } }),
      prisma.expense.aggregate({ where: { userId, date: { gte: startOfMonth } }, _sum: { amount: true } }),
      prisma.expense.aggregate({ where: { userId, date: { gte: startOfYear } }, _sum: { amount: true } }),
      prisma.trip.findMany({
        where: { userId },
        take: 5,
        orderBy: { startDate: 'desc' },
        include: { vehicle: { select: { registration: true } }, driver: { select: { name: true } } }
      }),
      Promise.all([
        prisma.vehicle.findMany({ where: { userId, fitnessExpiry: { lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) } } }),
        prisma.vehicle.findMany({ where: { userId, insuranceExpiry: { lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) } } }),
        prisma.vehicle.findMany({ where: { userId, permitExpiry: { lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) } } }),
        prisma.driver.findMany({ where: { userId, licenseExpiry: { lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) } } })
      ])
    ])

    const vehicleStats = {
      total: vehicles.length,
      active: vehicles.filter(v => v.status === 'ACTIVE').length,
      maintenance: vehicles.filter(v => v.status === 'MAINTENANCE').length,
      inactive: vehicles.filter(v => v.status === 'INACTIVE').length
    }

    const driverStats = {
      total: drivers.length,
      available: drivers.filter(d => d.status === 'AVAILABLE').length,
      onTrip: drivers.filter(d => d.status === 'ON_TRIP').length,
      offDuty: drivers.filter(d => d.status === 'OFF_DUTY').length
    }

    const tripStats = {
      total: trips.length,
      planned: trips.filter(t => t.status === 'PLANNED').length,
      inProgress: trips.filter(t => t.status === 'IN_PROGRESS').length,
      completed: trips.filter(t => t.status === 'COMPLETED').length,
      cancelled: trips.filter(t => t.status === 'CANCELLED').length,
      totalFreight: trips.reduce((sum, t) => sum + (t.freightAmount || 0), 0)
    }

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
    const expensesByType = expenses.reduce((acc: any, exp) => {
      acc[exp.type] = (acc[exp.type] || 0) + exp.amount
      return acc
    }, {})

    const last6Months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date()
      d.setMonth(d.getMonth() - i)
      last6Months.push(d.toLocaleString('default', { month: 'short' }))
    }

    const monthlyExpenseData = last6Months.map(month => {
      const monthIndex = new Date(Date.parse(month + " 1, 2000")).getMonth()
      return expenses
        .filter(e => new Date(e.date).getMonth() === monthIndex)
        .reduce((sum, e) => sum + e.amount, 0)
    })

    const [fitnessExpiring, insuranceExpiring, permitExpiring, licenseExpiring] = expiringItems

    return NextResponse.json({
      vehicleStats,
      driverStats,
      tripStats,
      expenseStats: {
        total: totalExpenses,
        monthly: monthlyExpenses._sum.amount || 0,
        yearly: yearlyExpenses._sum.amount || 0,
        byType: expensesByType,
        monthlyTrend: { labels: last6Months, data: monthlyExpenseData }
      },
      recentTrips: recentTrips.map(trip => ({
        id: trip.id,
        tripNumber: trip.tripNumber,
        fromLocation: trip.fromLocation,
        toLocation: trip.toLocation,
        status: trip.status,
        startDate: trip.startDate,
        vehicle: trip.vehicle?.registration,
        driver: trip.driver?.name
      })),
      expiringSoon: {
        fitness: fitnessExpiring,
        insurance: insuranceExpiring,
        permit: permitExpiring,
        license: licenseExpiring
      },
      alerts: { totalExpiring: fitnessExpiring.length + insuranceExpiring.length + permitExpiring.length + licenseExpiring.length }
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch dashboard statistics" }, { status: 500 })
  }
}