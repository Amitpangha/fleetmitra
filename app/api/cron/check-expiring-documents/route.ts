import { prisma } from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    const expiringDocuments = await prisma.document.findMany({
      where: {
        expiryDate: {
          gte: now,
          lte: thirtyDaysFromNow,
        },
        status: 'VALID',
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        vehicle: {
          select: {
            registration: true,
          },
        },
        driver: {
          select: {
            name: true,
          },
        },
      },
    })

    const expiredDocuments = await prisma.document.findMany({
      where: {
        expiryDate: {
          lt: now,
        },
        status: 'VALID',
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
        vehicle: {
          select: {
            registration: true,
          },
        },
        driver: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      processed: {
        expiring: expiringDocuments.length,
        expired: expiredDocuments.length,
      },
    })
  } catch (error) {
    console.error("Error checking expiring documents:", error)
    return NextResponse.json(
      { error: "Failed to check expiring documents" },
      { status: 500 }
    )
  }
}
