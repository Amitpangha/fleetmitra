import type { Metadata } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { getServerSession } from "next-auth"
import SessionProvider from "@/components/SessionProvider"
import { authOptions } from "@/lib/auth"
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
})

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  title: "FleetMitra - Enterprise Fleet Management Platform",
  description: "Transform your fleet operations with AI-powered insights, real-time tracking, and automated compliance.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
        <ThemeProvider>
          <SessionProvider session={session}>
            {children}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}