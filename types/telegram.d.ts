export {}

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        initDataUnsafe?: {
          user?: {
            id: number
            first_name?: string
            last_name?: string
            username?: string
          }
        }
      }
    }

    __TG_USER__?: {
      id: number
      first_name?: string
      last_name?: string
      username?: string
    }
  }
}
