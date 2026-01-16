import { CreativesScreen } from "@/components/screens/creatives-screen"
import { BottomNav } from "@/components/bottom-nav"

export default function AdvertiserCreativesPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <CreativesScreen />
      </div>
      <BottomNav userType="advertiser" />
    </div>
  )
}
