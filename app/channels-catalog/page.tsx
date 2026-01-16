import { ChannelsCatalogScreen } from "@/components/screens/channels-catalog-screen"
import { BottomNav } from "@/components/bottom-nav"
import { FloatingSupportButton } from "@/components/floating-support-button"

export default function ChannelsCatalogPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <ChannelsCatalogScreen />
      </div>
      <FloatingSupportButton />
      <BottomNav userType="advertiser" />
    </div>
  )
}
