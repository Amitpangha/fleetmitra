import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasToken: !!process.env.UPLOADTHING_TOKEN,
    tokenPrefix: process.env.UPLOADTHING_TOKEN ? process.env.UPLOADTHING_TOKEN.substring(0, 10) + '...' : null,
    nodeEnv: process.env.NODE_ENV
  })
}