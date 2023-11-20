import './globals.css'
import Fathom from './components/Fathom.jsx';

export const metadata = {
    title: 'Irreversible Resolver: Make Decisions Easy!',
    description: 'Embrace the Chance! Resolver helps you make everyday decisions in a fun and interactive way. Choose your options and let Resolver decide for you!',
}

export default function RootLayout({children}) {
    return (
        <html lang="en">
        <body className="antialiased">
        <Fathom/>
        {children}
        </body>
        </html>
    )
}
