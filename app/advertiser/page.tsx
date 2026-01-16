import { AdvertiserDashboard } from "@/components/advertiser/advertiser-dashboard"
import { BottomNav } from "@/components/bottom-nav"

export default function AdvertiserPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <AdvertiserDashboard />
      </div>
      <BottomNav userType="advertiser" />
    </div>
  )
}
