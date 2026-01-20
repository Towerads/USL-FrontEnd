import type React from "react"
import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AntdProvider } from "@/components/antd-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "USL — Платформа для рекламы",
  description: "Telegram Mini App для рекламодателей и паблишеров",
  generator: "",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className="font-sans antialiased">
        <AntdProvider>
          {children}
        </AntdProvider>
        <Analytics />
      </body>
    </html>
  )
}
