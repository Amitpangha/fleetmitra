import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

// Correct type for Next.js 15
type RouteParams = {
  params: Promise<{ id: string }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const document = await prisma.document.findFirst({
      where: { 
        id: id, 
        userId: session.user.id 
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

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    
    const document = await prisma.document.update({
      where: { 
        id: id, 
        userId: session.user.id 
      },
      data: { status: body.status }
    })

    return NextResponse.json(document)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update document" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.document.delete({
      where: { 
        id: id, 
        userId: session.user.id 
      }
    })

    return NextResponse.json({ message: "Document deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
  }
}