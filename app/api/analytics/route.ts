import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = (session.user as any).id
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month'  // ✅ Make sure this line exists

    const now = new Date()
    let startDate: Date
    let previousStartDate: Date

    // Calculate date ranges based on period
    switch(period) {  // This should work if period is defined above
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7))
        previousStartDate = new Date(now.setDate(now.getDate() - 14))
        break
      // ... rest of cases
   
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        previousStartDate = new Date(now.setMonth(now.getMonth() - 2))
        break
      case 'quarter':
        startDate = new Date(now.setMonth(now.getMonth() - 3))
        previousStartDate = new Date(now.setMonth(now.getMonth() - 6))
        break
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1))
        previousStartDate = new Date(now.setFullYear(now.getFullYear() - 2))
        break
      default:
        startDate = new Date(now.setMonth(now.getMonth() - 1))
        previousStartDate = new Date(now.setMonth(now.getMonth() - 2))
    }

    // Fetch current period data
    const [
      currentTrips,
      previousTrips,
      currentExpenses,
      previousExpenses,
      currentDocuments,
      previousDocuments,
      vehicleUtilization,
      driverPerformance,
      revenueByMonth,
      expenseByCategory,
    ] = await Promise.all([
      // Current trips
      prisma.trip.findMany({
        where: {
          userId,
          startDate: { gte: startDate }
        }
      }),

      // Previous trips for comparison
      prisma.trip.findMany({
        where: {
          userId,
          startDate: {
            gte: previousStartDate,
            lt: startDate
          }
        }
      }),

      // Current expenses
      prisma.expense.findMany({
        where: {
          userId,
          date: { gte: startDate }
        }
      }),

      // Previous expenses
      prisma.expense.findMany({
        where: {
          userId,
          date: {
            gte: previousStartDate,
            lt: startDate
          }
        }
      }),

      // Current documents
      prisma.document.findMany({
        where: {
          userId,
          createdAt: { gte: startDate }
        }
      }),

      // Previous documents
      prisma.document.findMany({
        where: {
          userId,
          createdAt: {
            gte: previousStartDate,
            lt: startDate
          }
        }
      }),

      // Vehicle utilization
      prisma.vehicle.findMany({
        where: { userId },
        include: {
          trips: {
            where: {
              startDate: { gte: startDate }
            }
          }
        }
      }),

      // Driver performance
      prisma.driver.findMany({
        where: { userId },
        include: {
          trips: {
            where: {
              startDate: { gte: startDate }
            }
          }
        }
      }),

      // Revenue by month (last 6 months)
      prisma.trip.groupBy({
        by: ['startDate'],
        where: {
          userId,
          status: 'COMPLETED',
          startDate: {
            gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
          }
        },
        _sum: {
          freightAmount: true
        }
      }),

      // Expenses by category
      prisma.expense.groupBy({
        by: ['type'],
        where: {
          userId,
          date: { gte: startDate }
        },
        _sum: {
          amount: true
        }
      })
    ])

    // Calculate metrics
    const currentTripCount = currentTrips.length
    const previousTripCount = previousTrips.length
    const tripGrowth = previousTripCount === 0 ? 100 : ((currentTripCount - previousTripCount) / previousTripCount) * 100

    const currentRevenue = currentTrips.reduce((sum, t) => sum + (t.freightAmount || 0), 0)
    const previousRevenue = previousTrips.reduce((sum, t) => sum + (t.freightAmount || 0), 0)
    const revenueGrowth = previousRevenue === 0 ? 100 : ((currentRevenue - previousRevenue) / previousRevenue) * 100

    const currentExpenseTotal = currentExpenses.reduce((sum, e) => sum + e.amount, 0)
    const previousExpenseTotal = previousExpenses.reduce((sum, e) => sum + e.amount, 0)
    const expenseGrowth = previousExpenseTotal === 0 ? 100 : ((currentExpenseTotal - previousExpenseTotal) / previousExpenseTotal) * 100

    const profit = currentRevenue - currentExpenseTotal
    const previousProfit = previousRevenue - previousExpenseTotal
    const profitGrowth = previousProfit === 0 ? 100 : ((profit - previousProfit) / previousProfit) * 100

    // Vehicle utilization
    const vehicleStats = vehicleUtilization.map(v => ({
      registration: v.registration,
      tripCount: v.trips.length,
      utilization: (v.trips.length / currentTripCount) * 100
    }))

    // Driver performance
    const driverStats = driverPerformance.map(d => ({
      name: d.name,
      tripCount: d.trips.length,
      revenue: d.trips.reduce((sum, t) => sum + (t.freightAmount || 0), 0),
      rating: d.rating || 0
    }))

    // Revenue trend
    const revenueTrend = Array.from({ length: 6 }, (_, i) => {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthData = revenueByMonth.filter(r => 
        new Date(r.startDate).getMonth() === date.getMonth() &&
        new Date(r.startDate).getFullYear() === date.getFullYear()
      )
      return {
        month: date.toLocaleString('default', { month: 'short' }),
        revenue: monthData.reduce((sum, r) => sum + (r._sum.freightAmount || 0), 0)
      }
    }).reverse()

    return NextResponse.json({
      period,
      metrics: {
        trips: {
          current: currentTripCount,
          previous: previousTripCount,
          growth: tripGrowth.toFixed(1)
        },
        revenue: {
          current: currentRevenue,
          previous: previousRevenue,
          growth: revenueGrowth.toFixed(1)
        },
        expenses: {
          current: currentExpenseTotal,
          previous: previousExpenseTotal,
          growth: expenseGrowth.toFixed(1)
        },
        profit: {
          current: profit,
          previous: previousProfit,
          growth: profitGrowth.toFixed(1)
        },
        documents: {
          current: currentDocuments.length,
          previous: previousDocuments.length,
          growth: previousDocuments.length === 0 ? 100 : ((currentDocuments.length - previousDocuments.length) / previousDocuments.length * 100).toFixed(1)
        }
      },
      charts: {
        revenueTrend,
        expenseByCategory: expenseByCategory.map(e => ({
          category: e.type,
          amount: e._sum.amount || 0
        })),
        vehicleUtilization: vehicleStats.sort((a, b) => b.utilization - a.utilization).slice(0, 5),
        driverPerformance: driverStats.sort((a, b) => b.revenue - a.revenue).slice(0, 5)
      },
      insights: generateInsights({
        tripGrowth,
        revenueGrowth,
        expenseGrowth,
        profitGrowth,
        topVehicle: vehicleStats[0],
        topDriver: driverStats[0],
        expenseByCategory: expenseByCategory.map(e => ({ type: e.type, amount: e._sum.amount || 0 }))
      })
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    )
  }
}

function generateInsights(data: any) {
  const insights = []

  // Trip insights
  if (data.tripGrowth > 0) {
    insights.push({
      type: 'positive',
      icon: '📈',
      title: 'Trip Volume Increasing',
      message: `Trips are up ${data.tripGrowth}% compared to previous period. Great performance!`
    })
  } else if (data.tripGrowth < 0) {
    insights.push({
      type: 'warning',
      icon: '⚠️',
      title: 'Trip Volume Decreasing',
      message: `Trips are down ${Math.abs(data.tripGrowth)}%. Consider reviewing your operations.`
    })
  }

  // Revenue insights
  if (data.revenueGrowth > 10) {
    insights.push({
      type: 'positive',
      icon: '💰',
      title: 'Revenue Surge',
      message: `Revenue increased by ${data.revenueGrowth}%. Excellent growth!`
    })
  } else if (data.revenueGrowth < -10) {
    insights.push({
      type: 'negative',
      icon: '📉',
      title: 'Revenue Drop',
      message: `Revenue decreased by ${Math.abs(data.revenueGrowth)}%. Time to analyze pricing.`
    })
  }

  // Profit margin
  const profitMargin = (data.profit / data.revenue) * 100
  if (profitMargin > 20) {
    insights.push({
      type: 'positive',
      icon: '💎',
      title: 'Healthy Profit Margin',
      message: `Profit margin is ${profitMargin.toFixed(1)}%. Great efficiency!`
    })
  } else if (profitMargin < 5) {
    insights.push({
      type: 'warning',
      icon: '🔻',
      title: 'Low Profit Margin',
      message: `Profit margin is only ${profitMargin.toFixed(1)}%. Review your expenses.`
    })
  }

  // Top performer insights
  if (data.topVehicle) {
    insights.push({
      type: 'info',
      icon: '🏆',
      title: 'Top Performing Vehicle',
      message: `${data.topVehicle.registration} completed ${data.topVehicle.tripCount} trips this period.`
    })
  }

  if (data.topDriver) {
    insights.push({
      type: 'info',
      icon: '⭐',
      title: 'Top Performing Driver',
      message: `${data.topDriver.name} generated ₹${data.topDriver.revenue.toLocaleString()} in revenue.`
    })
  }

  // Expense insights
  const topExpense = data.expenseByCategory.sort((a: any, b: any) => b.amount - a.amount)[0]
  if (topExpense && topExpense.amount > data.revenue * 0.3) {
    insights.push({
      type: 'warning',
      icon: '🔥',
      title: 'High Fuel Costs',
      message: `${topExpense.type} expenses are ${((topExpense.amount / data.revenue) * 100).toFixed(1)}% of revenue. Consider optimization.`
    })
  }

  return insights
}