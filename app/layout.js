import './globals.css'
import Fathom from './components/Fathom.jsx';

export const metadata = {
  title: 'Resolver!',
  description: 'Embrace the Chance!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
      <Fathom />
      {children}
      </body>
    </html>
  )
}
