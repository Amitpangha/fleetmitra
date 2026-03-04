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

    const vehicle = await prisma.vehicle.findFirst({
      where: {
        id: id,
        userId: session.user.id
      },
      include: {
        trips: {
          orderBy: { startDate: 'desc' },
          take: 10
        },
        expenses: {
          orderBy: { date: 'desc' },
          take: 10
        },
        documents: true
      }
    })

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("Error fetching vehicle:", error)
    return NextResponse.json(
      { error: "Failed to fetch vehicle" },
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

    const vehicle = await prisma.vehicle.update({
      where: {
        id: id,
        userId: session.user.id
      },
      data: {
        registration: body.registration,
        type: body.type,
        model: body.model,
        capacity: parseFloat(body.capacity),
        make: body.make,
        year: body.year ? parseInt(body.year) : null,
        fuelType: body.fuelType,
        status: body.status,
        fitnessExpiry: body.fitnessExpiry ? new Date(body.fitnessExpiry) : null,
        insuranceExpiry: body.insuranceExpiry ? new Date(body.insuranceExpiry) : null,
        lastServiceDate: body.lastServiceDate ? new Date(body.lastServiceDate) : null,
        permitExpiry: body.permitExpiry ? new Date(body.permitExpiry) : null,
        nextServiceDue: body.nextServiceDue ? parseInt(body.nextServiceDue) : null,
      }
    })

    return NextResponse.json(vehicle)
  } catch (error) {
    console.error("Error updating vehicle:", error)
    return NextResponse.json(
      { error: "Failed to update vehicle" },
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

    await prisma.vehicle.delete({
      where: {
        id: id,
        userId: session.user.id
      }
    })

    return NextResponse.json({ message: "Vehicle deleted successfully" })
  } catch (error) {
    console.error("Error deleting vehicle:", error)
    return NextResponse.json(
      { error: "Failed to delete vehicle" },
      { status: 500 }
    )
  }
}
