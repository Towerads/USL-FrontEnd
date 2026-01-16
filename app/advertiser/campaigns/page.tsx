import { AdvertiserCampaigns } from "@/components/advertiser/advertiser-campaigns"
import { BottomNav } from "@/components/bottom-nav"

export default function AdvertiserCampaignsPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <AdvertiserCampaigns />
      </div>
      <BottomNav userType="advertiser" />
    </div>
  )
}
