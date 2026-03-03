import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        read: false,
      },
      data: { read: true },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error marking all as read:", error)
    return NextResponse.json(
      { error: "Failed to mark all as read" },
      { status: 500 }
    )
  }
}