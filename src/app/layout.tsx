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
      <body className="flex min-h-screen flex-col">
        <main className="flex-1">
          {children}
        </main>

        <footer className="text-center text-xs text-gray-400 py-6 px-4">
          Disclaimer: This is an independent, unofficial calculator. Not affiliated with or endorsed by Bilt or Bilt Rewards. Calculations are estimates; refer to official terms for accuracy.
        </footer>
      </body>
    </html>
  )
}
