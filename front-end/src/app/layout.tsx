"use client"
import { Inter } from 'next/font/google'
import { ConfigProvider } from 'antd'
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"
import ProtectedRoute from '@/components/ProtectedRoute'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-background text-foreground`}>
        <AuthProvider>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#ec4899',
                colorBgBase: '#1a1b27',
                colorText: "#FAFAFA",
                colorTextBase: '#ffffff',
                colorBorder: "#70707B",
                colorBorderSecondary: "#3F3F46",
                borderRadius: 8,
              },
            }}
          >

        {/* <ProtectedRoute> */}
            {children}
        {/* </ProtectedRoute> */}
          </ConfigProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

