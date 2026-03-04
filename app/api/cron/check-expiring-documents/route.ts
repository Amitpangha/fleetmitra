import { prisma } from "@/lib/prisma"
import { sendEmail, emailTemplates } from "@/lib/email"
import { NextRequest, NextResponse } from "next/server"

// This endpoint should be called by a cron job (e.g., GitHub Actions, Vercel Cron, etc.)
export async function GET(request: NextRequest) {  // ✅ Add the request parameter
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    // Find all expiring documents (next 30 days)
    const expiringDocuments = await prisma.document.findMany({
      where: {
        expiryDate: {
          gte: now,
          lte: thirtyDaysFromNow,
        },
        status: 'VALID',
        notifications: {
          none: {
            type: 'EXPIRY_REMINDER',
            createdAt: {
              gte: now,
            },
          },
        },
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            settings: true,
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

    // Find expired documents
    const expiredDocuments = await prisma.document.findMany({
      where: {
        expiryDate: {
          lt: now,
        },
        status: 'VALID',
        notifications: {
          none: {
            type: 'EXPIRED',
          },
        },
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            settings: true,
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

    const notifications = []

    // Send notifications for expiring documents
    for (const doc of expiringDocuments) {
      if (doc.user.settings?.emailAlerts !== false) {
        const daysLeft = Math.ceil((doc.expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24))
        const entityName = doc.vehicle?.registration || doc.driver?.name

        const { subject, html } = emailTemplates.documentExpiringSoon({
          userName: doc.user.name || 'User',
          documentType: doc.type,
          documentNumber: doc.documentNumber,
          entityName,
          expiryDate: doc.expiryDate,
          daysLeft,
        })

        const emailResult = await sendEmail({
          to: doc.user.email,
          subject,
          html,
        })

        if (emailResult.success) {
          // Create notification record
          await prisma.notification.create({
            data: {
              userId: doc.userId,
              type: 'EXPIRY_REMINDER',
              title: `Document Expiring Soon: ${doc.type}`,
              message: `${doc.type} (${doc.documentNumber}) will expire in ${daysLeft} days.`,
              actionUrl: `/dashboard/documents/${doc.id}`,
            },
          })

          notifications.push({
            documentId: doc.id,
            type: 'expiring',
            emailSent: true,
          })
        }
      }
    }

    // Send notifications for expired documents
    for (const doc of expiredDocuments) {
      if (doc.user.settings?.emailAlerts !== false) {
        const entityName = doc.vehicle?.registration || doc.driver?.name

        const { subject, html } = emailTemplates.documentExpired({
          userName: doc.user.name || 'User',
          documentType: doc.type,
          documentNumber: doc.documentNumber,
          entityName,
          expiryDate: doc.expiryDate,
        })

        const emailResult = await sendEmail({
          to: doc.user.email,
          subject,
          html,
        })

        if (emailResult.success) {
          // Update document status
          await prisma.document.update({
            where: { id: doc.id },
            data: { status: 'EXPIRED' },
          })

          // Create notification record
          await prisma.notification.create({
            data: {
              userId: doc.userId,
              type: 'EXPIRED',
              title: `Document Expired: ${doc.type}`,
              message: `${doc.type} (${doc.documentNumber}) has expired.`,
              actionUrl: `/dashboard/documents/${doc.id}`,
            },
          })

          notifications.push({
            documentId: doc.id,
            type: 'expired',
            emailSent: true,
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: {
        expiring: expiringDocuments.length,
        expired: expiredDocuments.length,
        notifications: notifications.length,
      },
      notifications,
    })
  } catch (error) {
    console.error("Error checking expiring documents:", error)
    return NextResponse.json(
      { error: "Failed to check expiring documents" },
      { status: 500 }
    )
  }
}