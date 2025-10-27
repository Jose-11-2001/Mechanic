import './globals.css'

export const metadata = {
  title: 'Bode Automotive',
  description: 'Car Service Center',
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