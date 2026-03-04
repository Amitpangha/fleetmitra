import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
n    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const vehicleId = searchParams.get('vehicleId')
    const driverId = searchParams.get('driverId')
    const type = searchParams.get('type')
    const status = searchParams.get('status')

    const where: any = { 
      userId: (session.user as any).id  // ✅ Use type assertion
    }
    
    if (vehicleId) where.vehicleId = vehicleId
    if (driverId) where.driverId = driverId
    if (type && type !== 'ALL') where.type = type
    if (status && status !== 'ALL') where.status = status

    const documents = await prisma.document.findMany({
      where,
      include: {
        vehicle: { select: { registration: true } },
        driver: { select: { name: true } }
      },
      orderBy: { expiryDate: 'asc' }
    })

    return NextResponse.json(documents)
  } catch (error) {
    console.error("Error fetching documents:", error)
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
n    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    
    const document = await prisma.document.create({
      data: {
        userId: (session.user as any).id,  // ✅ Use type assertion
        type: body.type,
        documentNumber: body.documentNumber,
        issuedDate: new Date(body.issuedDate),
        expiryDate: new Date(body.expiryDate),
        fileUrl: body.fileUrl,
        fileName: body.fileName,
        fileSize: body.fileSize,
        mimeType: body.mimeType,
        status: body.status || 'VALID',
        vehicleId: body.vehicleId || null,
        driverId: body.driverId || null,
      }
    })

    return NextResponse.json(document, { status: 201 })
  } catch (error) {
    console.error("Error creating document:", error)
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 })
  }
}