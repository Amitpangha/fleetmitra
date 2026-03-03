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

    const vehicle = await prisma.vehicle.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: { trips: true, expenses: true, documents: true }
    })

    if (!vehicle) {
      return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
    }

    return NextResponse.json(vehicle)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicle" }, { status: 500 })
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
    
    const vehicle = await prisma.vehicle.update({
      where: { id: params.id, userId: session.user.id },
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
    return NextResponse.json({ error: "Failed to update vehicle" }, { status: 500 })
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

    await prisma.vehicle.delete({
      where: { id: params.id, userId: session.user.id }
    })

    return NextResponse.json({ message: "Vehicle deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete vehicle" }, { status: 500 })
  }
}