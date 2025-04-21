import type { Metadata } from 'next'
import React from 'react'
import Navbar1 from '@/components/Navbar1'
import Navbar2 from '@/components/Navbar2'
import Navbar from '@/components/Navbar'


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
      <body>
      <Navbar/>
      {children}
      </body>
    </html>
  )
}
