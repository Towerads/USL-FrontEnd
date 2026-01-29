"use client"

import { ProfileNewScreen } from "@/components/screens/profile-new-screen"
import { BottomNav } from "@/components/bottom-nav"

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="flex-1 overflow-y-auto pb-20">
        <ProfileNewScreen />
      </div>

      {/* пока всегда advertiser */}
      <BottomNav userType="advertiser" />
    </div>
  )
}
