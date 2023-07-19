import './globals.css'

export const metadata = {
  title: 'Resolver!',
  description: 'Embrace the Chance!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
