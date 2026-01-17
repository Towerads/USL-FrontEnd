"use client"

import { ChannelsCatalogScreen } from "@/components/screens/channels-catalog-screen"
import { BottomNav } from "@/components/bottom-nav"
import { useEffect, useState } from "react"

export default function ChannelsCatalogPage() {
  const [userType, setUserType] = useState<'advertiser' | 'publisher' | null>(null)

  useEffect(() => {
    const savedUserType = localStorage.getItem('userType') as 'advertiser' | 'publisher' | null
    setUserType(savedUserType)
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <ChannelsCatalogScreen />
      </div>
      <BottomNav userType={userType || 'default'} />
    </div>
  )
}
