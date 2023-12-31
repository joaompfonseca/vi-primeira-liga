import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ResponsiveAppBar from "@/app/components/ResponsiveAppBar";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Primeira Liga',
  description: 'Statistics for the Portuguese Primeira Liga',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
