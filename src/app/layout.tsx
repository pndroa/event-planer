import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Event Planer',
  description: 'Pep Digital - Event Planer',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
