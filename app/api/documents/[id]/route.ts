import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

type RouteContext = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    const document = await prisma.document.findFirst({
      where: {
        id: id,
        userId: (session.user as any).id,  // ✅ Use type assertion
      },
      include: {
        vehicle: true,
        driver: true
      }
    })

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    return NextResponse.json(document)
  } catch (error) {
    console.error("Error fetching document:", error)
    return NextResponse.json({ error: "Failed to fetch document" }, { status: 500 })
  }
}

// Apply the same pattern to PATCH and DELETE methods

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const body = await request.json()
    
    const driver = await prisma.driver.update({
      where: { 
        id: id, 
        userId: (session.user as any).id 
      },
      data: {
        name: body.name,
        phone: body.phone,
        email: body.email,
        licenseNumber: body.licenseNumber,
        licenseExpiry: body.licenseExpiry ? new Date(body.licenseExpiry) : null,
        experience: body.experience ? parseInt(body.experience) : null,
        rating: body.rating ? parseFloat(body.rating) : null,
        status: body.status,
        emergencyContact: body.emergencyContact,
        bloodGroup: body.bloodGroup,
      }
    })

    return NextResponse.json(driver)
  } catch (error) {
    console.error("Error updating driver:", error)
    return NextResponse.json({ error: "Failed to update driver" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params

    await prisma.driver.delete({
      where: { 
        id: id, 
        userId: (session.user as any).id 
      }
    })

    return NextResponse.json({ message: "Driver deleted successfully" })
  } catch (error) {
    console.error("Error deleting driver:", error)
    return NextResponse.json({ error: "Failed to delete driver" }, { status: 500 })
  }
}