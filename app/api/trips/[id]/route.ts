import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const trip = await prisma.trip.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: { vehicle: true, driver: true, expenses: true }
    })

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    const balanceAmount = (trip.freightAmount || 0) - (trip.advanceAmount || 0)
    return NextResponse.json({ ...trip, balanceAmount })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trip" }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    const data: any = {
      fromLocation: body.fromLocation,
      toLocation: body.toLocation,
      startDate: new Date(body.startDate),
      loadType: body.loadType,
      loadWeight: parseFloat(body.loadWeight),
    }
    
    if (body.endDate) data.endDate = new Date(body.endDate)
    if (body.vehicleId) data.vehicleId = body.vehicleId
    if (body.driverId) data.driverId = body.driverId
    if (body.distance) data.distance = parseFloat(body.distance)
    if (body.freightAmount) data.freightAmount = parseFloat(body.freightAmount)
    if (body.advanceAmount) data.advanceAmount = parseFloat(body.advanceAmount)
    if (body.loadValue) data.loadValue = parseFloat(body.loadValue)
    if (body.notes) data.notes = body.notes
    if (body.priority) data.priority = body.priority
    if (body.status) data.status = body.status
    if (body.paymentStatus) data.paymentStatus = body.paymentStatus

    const trip = await prisma.trip.update({
      where: { id: params.id, userId: session.user.id },
      data
    })

    return NextResponse.json(trip)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update trip" }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    const trip = await prisma.trip.update({
      where: { id: params.id, userId: session.user.id },
      data: {
        status: body.status,
        ...(body.status === 'COMPLETED' ? { endDate: new Date() } : {})
      }
    })

    return NextResponse.json(trip)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update trip status" }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.trip.delete({
      where: { id: params.id, userId: session.user.id }
    })

    return NextResponse.json({ message: "Trip deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete trip" }, { status: 500 })
  }
}