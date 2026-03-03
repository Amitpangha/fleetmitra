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

    const vehicles = await prisma.vehicle.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(vehicles)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
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
      registration: body.registration,
      type: body.type,
      model: body.model,
      capacity: parseFloat(body.capacity),
    }
    
    if (body.make) data.make = body.make
    if (body.year) data.year = parseInt(body.year)
    if (body.fuelType) data.fuelType = body.fuelType
    if (body.status) data.status = body.status
    if (body.fitnessExpiry) data.fitnessExpiry = new Date(body.fitnessExpiry)
    if (body.insuranceExpiry) data.insuranceExpiry = new Date(body.insuranceExpiry)
    if (body.lastServiceDate) data.lastServiceDate = new Date(body.lastServiceDate)
    if (body.permitExpiry) data.permitExpiry = new Date(body.permitExpiry)
    if (body.nextServiceDue) data.nextServiceDue = parseInt(body.nextServiceDue)

    const vehicle = await prisma.vehicle.create({ data })
    return NextResponse.json(vehicle, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Database error while creating vehicle" }, { status: 500 })
  }
}