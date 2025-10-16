import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/react"
import { Geist } from "next/font/google"
import "./globals.css"
import StyledComponentsRegistry from '../lib/registry'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "ai news",
  description: "latest news in artificial intelligence and machine learning",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${geistSans.variable} antialiased`}>
      <body>
        <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
      </body>
      <Analytics />
    </html>
  )
}
