import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

// CORRECT type for Next.js 15
type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    const trip = await prisma.trip.findFirst({
      where: {
        id: id,
        userId: session.user.id
      },
      include: {
        vehicle: true,
        driver: true,
        expenses: {
          orderBy: {
            date: 'desc'
          }
        }
      }
    })

    if (!trip) {
      return NextResponse.json({ error: "Trip not found" }, { status: 404 })
    }

    // Calculate balance amount
    const balanceAmount = (trip.freightAmount || 0) - (trip.advanceAmount || 0)

    return NextResponse.json({
      ...trip,
      balanceAmount
    })
  } catch (error) {
    console.error("Error fetching trip:", error)
    return NextResponse.json(
      { error: "Failed to fetch trip" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()

    const trip = await prisma.trip.update({
      where: {
        id: id,
        userId: session.user.id
      },
      data: {
        fromLocation: body.fromLocation,
        toLocation: body.toLocation,
        startDate: new Date(body.startDate),
        loadType: body.loadType,
        loadWeight: parseFloat(body.loadWeight),
        endDate: body.endDate ? new Date(body.endDate) : null,
        vehicleId: body.vehicleId || null,
        driverId: body.driverId || null,
        distance: body.distance ? parseFloat(body.distance) : null,
        freightAmount: body.freightAmount ? parseFloat(body.freightAmount) : null,
        advanceAmount: body.advanceAmount ? parseFloat(body.advanceAmount) : null,
        loadValue: body.loadValue ? parseFloat(body.loadValue) : null,
        notes: body.notes,
        priority: body.priority,
        status: body.status,
        paymentStatus: body.paymentStatus,
      },
      include: {
        vehicle: true,
        driver: true
      }
    })

    return NextResponse.json(trip)
  } catch (error) {
    console.error("Error updating trip:", error)
    return NextResponse.json(
      { error: "Failed to update trip" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()

    const trip = await prisma.trip.update({
      where: {
        id: id,
        userId: session.user.id
      },
      data: {
        status: body.status,
        ...(body.status === 'COMPLETED' ? { endDate: new Date() } : {})
      }
    })

    return NextResponse.json(trip)
  } catch (error) {
    console.error("Error updating trip status:", error)
    return NextResponse.json(
      { error: "Failed to update trip status" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    await prisma.trip.delete({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    return NextResponse.json({ message: "Trip deleted successfully" })
  } catch (error) {
    console.error("Error deleting trip:", error)
    return NextResponse.json(
      { error: "Failed to delete trip" },
      { status: 500 }
    )
  }
}
