import { CampaignsScreen } from "@/components/screens/campaigns-screen"
import { BottomNav } from "@/components/bottom-nav"

export default function CampaignsPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <CampaignsScreen />
      </div>
      <BottomNav />
    </div>
  )
}
