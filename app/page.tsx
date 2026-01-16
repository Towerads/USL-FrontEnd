"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Page() {
  const router = useRouter()

  useEffect(() => {
    // Проверяем, выбрал ли пользователь тип аккаунта
    const userType = localStorage.getItem('userType')
    
    if (!userType) {
      // Если нет - показываем онбординг
      router.push('/onboarding')
    } else {
      // Если есть - перенаправляем на соответствующую страницу
      if (userType === 'advertiser') {
        router.push('/advertiser')
      } else if (userType === 'publisher') {
        router.push('/publisher')
      } else {
        router.push('/wallet')
      }
    }
  }, [router])

  return null
}
