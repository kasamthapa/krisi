import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Farmer Market',
  description: 'Connect farmers with businesses',
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