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

    const trips = await prisma.trip.findMany({
      where: { userId: session.user.id },
      include: {
        vehicle: { select: { registration: true } },
        driver: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(trips)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const tripNumber = `TRIP-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    const data: any = {
      userId: session.user.id,
      tripNumber,
      fromLocation: body.fromLocation,
      toLocation: body.toLocation,
      startDate: new Date(body.startDate),
      loadType: body.loadType,
      loadWeight: parseFloat(body.loadWeight),
      status: body.status || "PLANNED",
    }
    
    if (body.vehicleId) data.vehicleId = body.vehicleId
    if (body.driverId) data.driverId = body.driverId
    if (body.endDate) data.endDate = new Date(body.endDate)
    if (body.distance) data.distance = parseFloat(body.distance)
    if (body.freightAmount) data.freightAmount = parseFloat(body.freightAmount)
    if (body.advanceAmount) data.advanceAmount = parseFloat(body.advanceAmount)
    if (body.loadValue) data.loadValue = parseFloat(body.loadValue)
    if (body.notes) data.notes = body.notes
    if (body.priority) data.priority = body.priority
    if (body.paymentStatus) data.paymentStatus = body.paymentStatus

    const trip = await prisma.trip.create({ data })
    return NextResponse.json(trip, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Database error while creating trip" }, { status: 500 })
  }
}