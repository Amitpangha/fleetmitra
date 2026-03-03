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

    const driver = await prisma.driver.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: { trips: { orderBy: { startDate: 'desc' }, take: 10 } }
    })

    if (!driver) {
      return NextResponse.json({ error: "Driver not found" }, { status: 404 })
    }

    return NextResponse.json(driver)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch driver" }, { status: 500 })
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
      name: body.name,
      phone: body.phone,
      licenseNumber: body.licenseNumber,
      email: body.email,
      licenseExpiry: body.licenseExpiry ? new Date(body.licenseExpiry) : null,
      experience: body.experience ? parseInt(body.experience) : null,
      rating: body.rating ? parseFloat(body.rating) : null,
      status: body.status,
      emergencyContact: body.emergencyContact,
      bloodGroup: body.bloodGroup,
    }

    const driver = await prisma.driver.update({
      where: { id: params.id, userId: session.user.id },
      data
    })

    return NextResponse.json(driver)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update driver" }, { status: 500 })
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

    await prisma.driver.delete({
      where: { id: params.id, userId: session.user.id }
    })

    return NextResponse.json({ message: "Driver deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete driver" }, { status: 500 })
  }
}