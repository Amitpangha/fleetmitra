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

    const drivers = await prisma.driver.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(drivers)
  } catch (error: any) {
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Driver with this phone or license already exists" },
          { status: 409 }
        )
      }
    }
    return NextResponse.json({ error: "Failed to fetch drivers" }, { status: 500 })
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
      name: body.name,
      phone: body.phone,
      licenseNumber: body.licenseNumber,
    }
    
    if (body.email) data.email = body.email
    if (body.licenseExpiry) data.licenseExpiry = new Date(body.licenseExpiry)
    if (body.experience) data.experience = parseInt(body.experience)
    if (body.rating) data.rating = parseFloat(body.rating)
    if (body.status) data.status = body.status
    if (body.emergencyContact) data.emergencyContact = body.emergencyContact
    if (body.bloodGroup) data.bloodGroup = body.bloodGroup

    const driver = await prisma.driver.create({ data })
    return NextResponse.json(driver, { status: 201 })
  } catch (error: any) {
    if (error && typeof error === "object" && "code" in error) {
       if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Driver with this phone or license already exists" }, 
        { status: 409 }
      )
    }
    }
    if (error.code === 'P2002') {
      return NextResponse.json({ error: "Driver with this phone or license already exists" }, { status: 409 })
    }
    return NextResponse.json({ error: "Database error while creating driver" }, { status: 500 })
  }
}