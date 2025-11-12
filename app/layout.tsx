import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { NotificationsPopup } from "@/components/notifications-popup"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FashionTech Academy - Technology Courses for Fashion Innovators",
  description:
    "Learn cutting-edge digital tools, 3D design, AI-powered pattern making, and sustainable tech solutions for fashion professionals.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <NotificationsPopup />
        <Analytics />
      </body>
    </html>
  )
}
