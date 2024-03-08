import '@/styles/globals.css'

import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'

import { Toaster } from '@/components/ui/sonner'
import { TRPCReactProvider } from '@/trpc/react'

export const runtime = 'edge'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata = {
  title: process.env.appName,
  description: `${process.env.appName} is a simples clone of the real Reddit app`,
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang='en'>
        <body className={`font-sans ${inter.variable}`}>
          <TRPCReactProvider>
            {children}
            <Toaster />
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
