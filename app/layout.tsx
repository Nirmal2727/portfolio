import type React from "react"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import CustomCursor from "@/components/custom-cursor"
import ParticleBackground from "@/components/particle-background"
import ScrollProgress from "@/components/scroll-progress"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "3D Visualizer Portfolio",
  description: "Portfolio website showcasing 3D renders, animations, and interactive models",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-black text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <CustomCursor />
          <ParticleBackground />
          <ScrollProgress />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
