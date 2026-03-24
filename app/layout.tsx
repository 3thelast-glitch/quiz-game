import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Quiz Game',
  description: 'لعبة مسابقات ثقافية جماعية',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  )
}