import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const where: any = { userId: session.user.id }
    
    if (searchParams.get('vehicleId')) where.vehicleId = searchParams.get('vehicleId')
    if (searchParams.get('driverId')) where.driverId = searchParams.get('driverId')
    if (searchParams.get('tripId')) where.tripId = searchParams.get('tripId')
    if (searchParams.get('type')) where.type = searchParams.get('type')

    const expenses = await prisma.expense.findMany({
      where,
      include: {
        vehicle: { select: { registration: true } },
        driver: { select: { name: true } },
        trip: { select: { tripNumber: true } }
      },
      orderBy: { date: 'desc' }
    })

    const total = expenses.reduce((sum, exp) => sum + exp.amount, 0)

    return NextResponse.json({ expenses, summary: { total, count: expenses.length } })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expenses" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    const data: any = {
      userId: session.user.id,
      amount: parseFloat(body.amount),
      type: body.type,
      date: new Date(body.date),
    }
    
    if (body.description) data.description = body.description
    if (body.vehicleId) data.vehicleId = body.vehicleId
    if (body.driverId) data.driverId = body.driverId
    if (body.tripId) data.tripId = body.tripId
    if (body.paymentMethod) data.paymentMethod = body.paymentMethod
    if (body.notes) data.notes = body.notes
    if (body.receiptUrl) data.receiptUrl = body.receiptUrl

    const expense = await prisma.expense.create({ data })
    return NextResponse.json(expense, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Database error while creating expense" }, { status: 500 })
  }
}