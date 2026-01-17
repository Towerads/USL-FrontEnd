"use client"

import { StatsNewScreen } from "@/components/screens/stats-new-screen"
import { BottomNav } from "@/components/bottom-nav"
import { useEffect, useState } from "react"

export default function StatsPage() {
  const [userType, setUserType] = useState<'advertiser' | 'publisher' | null>(null)

  useEffect(() => {
    const savedUserType = localStorage.getItem('userType') as 'advertiser' | 'publisher' | null
    setUserType(savedUserType)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <StatsNewScreen />
      </div>
      <BottomNav userType={userType || 'default'} />
    </div>
  )
}
