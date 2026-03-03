import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { language, theme, notifications, emailAlerts } = body

    const settings = await prisma.userSettings.upsert({
      where: { userId: session.user.id },
      update: {
        language,
        theme,
        notifications,
        emailAlerts,
      },
      create: {
        userId: session.user.id,
        language,
        theme,
        notifications,
        emailAlerts,
      },
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error("Error updating settings:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}