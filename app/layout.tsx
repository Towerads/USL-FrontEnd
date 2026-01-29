"use client";

import Script from "next/script";
import { ReactNode, useEffect } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (!tg) {
      console.warn("Telegram WebApp not available yet");
      return;
    }

    tg.ready();
    tg.expand();

    // @ts-ignore
    window.__TG_USER__ = tg.initDataUnsafe?.user;
    console.log("TG USER:", window.__TG_USER__);
  }, []);

  return (
    <html lang="ru">
      <head>
        {/* 🔥 ОБЯЗАТЕЛЬНО */}
        <Script
          src="https://telegram.org/js/telegram-web-app.js"
          strategy="beforeInteractive"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

