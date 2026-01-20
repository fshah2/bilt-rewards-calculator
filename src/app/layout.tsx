import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bilt Card 2.0 Rewards Calculator',
  description: 'Calculate your Bilt Points and Bilt Cash earnings for Blue, Obsidian, and Palladium cards',
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
