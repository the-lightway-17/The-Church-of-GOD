import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/components/providers/auth-provider'
import { ThemeProvider } from '@/components/providers/theme-provider'
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
    default: 'Christ Mission - Striving to Know the Father',
    template: '%s | Christ Mission',
  },
  description:
    'Join a vibrant community of believers seeking to know God the Father. Ask questions, share insights, earn badges, and grow in your faith together.',
  keywords: [
    'Bible study',
    'Christian community',
    'Scripture',
    'Faith',
    'Q&A',
    'Bible questions',
    'Spiritual growth',
    'Know the Father',
  ],
  authors: [{ name: 'Christ Mission' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Christ Mission',
    title: 'Christ Mission - Striving to Know the Father',
    description: 'Join a vibrant community of believers seeking to know God the Father.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Christ Mission',
    description: 'Join a vibrant community of believers seeking to know God the Father.',
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
        <ThemeProvider>
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1 pb-16 md:pb-0">{children}</main>
              <MobileNav />
            </div>
          </AuthProvider>
        </ThemeProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
