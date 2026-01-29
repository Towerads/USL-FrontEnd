export {}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initDataUnsafe?: {
          user?: {
            id: number
            first_name: string
            username?: string
          }
        }
      }
    }
  }
}
