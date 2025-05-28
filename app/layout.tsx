import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'File Uploader',
  description: 'File Uploader',
  generator: 'File Uploader',
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
