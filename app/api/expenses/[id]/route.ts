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

    const expense = await prisma.expense.findFirst({
      where: { id: params.id, userId: session.user.id },
      include: { vehicle: true, driver: true, trip: true }
    })

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    }

    return NextResponse.json(expense)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch expense" }, { status: 500 })
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
      amount: parseFloat(body.amount),
      type: body.type,
      date: new Date(body.date),
      description: body.description,
      vehicleId: body.vehicleId,
      driverId: body.driverId,
      tripId: body.tripId,
      paymentMethod: body.paymentMethod,
      notes: body.notes,
      receiptUrl: body.receiptUrl,
    }

    const expense = await prisma.expense.update({
      where: { id: params.id, userId: session.user.id },
      data
    })

    return NextResponse.json(expense)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update expense" }, { status: 500 })
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

    await prisma.expense.delete({
      where: { id: params.id, userId: session.user.id }
    })

    return NextResponse.json({ message: "Expense deleted successfully" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete expense" }, { status: 500 })
  }
}