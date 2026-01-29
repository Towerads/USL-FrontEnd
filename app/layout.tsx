"use client"

import { useEffect } from "react"

export default function RootLayout({ children }) {
  useEffect(() => {
    const tg = window.Telegram?.WebApp
    if (!tg) return

    tg.ready()
    tg.expand()

    // сохраним пользователя глобально
    window.__TG_USER__ = tg.initDataUnsafe?.user
    console.log("TG USER:", window.__TG_USER__)
  }, [])

  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}


