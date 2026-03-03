import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import {
  generateExpensePDF,
  generateTripPDF,
  generateDocumentReportPDF,
  generateExpenseExcel,
  generateTripExcel,
  generateDocumentExcel,
} from "@/lib/reports"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { type, format, dateRange, filters } = body

    const startDate = dateRange?.start ? new Date(dateRange.start) : new Date(new Date().setMonth(new Date().getMonth() - 1))
    const endDate = dateRange?.end ? new Date(dateRange.end) : new Date()

    let reportData: any
    let buffer: Buffer
    let filename: string

    switch (type) {
      case 'expense':
        // Fetch expense data
        const expenses = await prisma.expense.findMany({
          where: {
            userId: session.user.id,
            date: { gte: startDate, lte: endDate },
            ...(filters?.vehicleId && { vehicleId: filters.vehicleId }),
            ...(filters?.driverId && { driverId: filters.driverId }),
            ...(filters?.type && { type: filters.type }),
          },
          include: {
            vehicle: { select: { registration: true } },
            driver: { select: { name: true } },
            trip: { select: { tripNumber: true } },
          },
          orderBy: { date: 'asc' },
        })

        // Calculate totals by type
        const totalsByType: Record<string, number> = {}
        let grandTotal = 0
        expenses.forEach(exp => {
          totalsByType[exp.type] = (totalsByType[exp.type] || 0) + exp.amount
          grandTotal += exp.amount
        })

        reportData = {
          title: 'Expense Report',
          dateRange: { start: startDate, end: endDate },
          generatedAt: new Date(),
          companyName: session.user.companyName,
          expenses: expenses.map(e => ({
            date: e.date,
            type: e.type,
            description: e.description,
            amount: e.amount,
            vehicle: e.vehicle?.registration,
            driver: e.driver?.name,
            trip: e.trip?.tripNumber,
            paymentMethod: e.paymentMethod,
          })),
          totals: {
            byType: totalsByType,
            grandTotal,
          },
        }

        filename = `expense-report-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}`
        
        if (format === 'excel') {
          buffer = await generateExpenseExcel(reportData)
          filename += '.xlsx'
        } else {
          buffer = await generateExpensePDF(reportData)
          filename += '.pdf'
        }
        break

      case 'trip':
        // Fetch trip data
        const trips = await prisma.trip.findMany({
          where: {
            userId: session.user.id,
            startDate: { gte: startDate, lte: endDate },
            ...(filters?.status && { status: filters.status }),
            ...(filters?.vehicleId && { vehicleId: filters.vehicleId }),
            ...(filters?.driverId && { driverId: filters.driverId }),
          },
          include: {
            vehicle: { select: { registration: true } },
            driver: { select: { name: true } },
          },
          orderBy: { startDate: 'asc' },
        })

        const completed = trips.filter(t => t.status === 'COMPLETED').length
        const inProgress = trips.filter(t => t.status === 'IN_PROGRESS').length
        const planned = trips.filter(t => t.status === 'PLANNED').length
        const totalFreight = trips.reduce((sum, t) => sum + (t.freightAmount || 0), 0)

        reportData = {
          title: 'Trip Report',
          dateRange: { start: startDate, end: endDate },
          generatedAt: new Date(),
          companyName: session.user.companyName,
          trips: trips.map(t => ({
            tripNumber: t.tripNumber,
            fromLocation: t.fromLocation,
            toLocation: t.toLocation,
            startDate: t.startDate,
            endDate: t.endDate,
            status: t.status,
            loadType: t.loadType,
            loadWeight: t.loadWeight,
            freightAmount: t.freightAmount,
            vehicle: t.vehicle?.registration,
            driver: t.driver?.name,
          })),
          summary: {
            totalTrips: trips.length,
            completed,
            inProgress,
            planned,
            totalFreight,
            avgFreight: trips.length ? totalFreight / trips.length : 0,
          },
        }

        filename = `trip-report-${startDate.toISOString().split('T')[0]}-to-${endDate.toISOString().split('T')[0]}`
        
        if (format === 'excel') {
          buffer = await generateTripExcel(reportData)
          filename += '.xlsx'
        } else {
          buffer = await generateTripPDF(reportData)
          filename += '.pdf'
        }
        break

      case 'document':
        // Fetch document data
        const documents = await prisma.document.findMany({
          where: {
            userId: session.user.id,
            ...(filters?.status && { status: filters.status }),
            ...(filters?.type && { type: filters.type }),
          },
          include: {
            vehicle: { select: { registration: true } },
            driver: { select: { name: true } },
          },
          orderBy: { expiryDate: 'asc' },
        })

        const now = new Date()
        const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

        const valid = documents.filter(d => d.expiryDate > thirtyDaysFromNow).length
        const expiringSoon = documents.filter(d => d.expiryDate <= thirtyDaysFromNow && d.expiryDate > now).length
        const expired = documents.filter(d => d.expiryDate <= now).length

        reportData = {
          title: 'Document Status Report',
          dateRange: { start: startDate, end: endDate },
          generatedAt: new Date(),
          companyName: session.user.companyName,
          documents: documents.map(d => ({
            type: d.type,
            documentNumber: d.documentNumber,
            issuedDate: d.issuedDate,
            expiryDate: d.expiryDate,
            status: d.status,
            entityName: d.vehicle?.registration || d.driver?.name,
            daysUntilExpiry: Math.ceil((d.expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24)),
          })),
          summary: {
            total: documents.length,
            valid,
            expiringSoon,
            expired,
          },
        }

        filename = `document-report-${new Date().toISOString().split('T')[0]}`
        
        if (format === 'excel') {
          buffer = await generateDocumentExcel(reportData)
          filename += '.xlsx'
        } else {
          buffer = await generateDocumentReportPDF(reportData)
          filename += '.pdf'
        }
        break

      default:
        return NextResponse.json({ error: "Invalid report type" }, { status: 400 })
    }

    // Return the file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': format === 'excel' 
          ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          : 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error) {
    console.error("Error generating report:", error)
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    )
  }
}