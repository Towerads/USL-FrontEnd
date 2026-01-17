import { CreativesNewScreen } from "@/components/screens/creatives-new-screen"
import { BottomNav } from "@/components/bottom-nav"

export default function CreativesPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <CreativesNewScreen />
      </div>
      <BottomNav userType="advertiser" />
    </div>
  )
}
