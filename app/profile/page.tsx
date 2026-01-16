import { ProfileScreen } from "@/components/screens/profile-screen"
import { BottomNav } from "@/components/bottom-nav"
import { FloatingSupportButton } from "@/components/floating-support-button"

export default function ProfilePage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <ProfileScreen />
      </div>
      <FloatingSupportButton />
      <BottomNav />
    </div>
  )
}
