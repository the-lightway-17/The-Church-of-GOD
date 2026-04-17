import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SessionProvider } from '@/components/providers/session-provider'
import { Header } from '@/components/layout/header'
import { MobileNav } from '@/components/layout/mobile-nav'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: {
    default: 'Scripture Connect - Bible Study Community',
    template: '%s | Scripture Connect',
  },
  description:
    'Join a vibrant community of believers. Ask questions, share insights, earn badges, and grow in your faith together.',
  keywords: [
    'Bible study',
    'Christian community',
    'Scripture',
    'Faith',
    'Q&A',
    'Bible questions',
    'Spiritual growth',
  ],
  authors: [{ name: 'Scripture Connect' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Scripture Connect',
    title: 'Scripture Connect - Bible Study Community',
    description: 'Join a vibrant community of believers exploring Scripture together.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scripture Connect',
    description: 'Join a vibrant community of believers exploring Scripture together.',
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1a4d2e' },
    { media: '(prefers-color-scheme: dark)', color: '#2d7a4a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${playfair.variable} bg-background`}
    >
      <body className="min-h-screen font-sans antialiased">
        <SessionProvider>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1 pb-16 md:pb-0">{children}</main>
            <MobileNav />
          </div>
        </SessionProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
