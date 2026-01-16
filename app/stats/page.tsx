import { StatsScreen } from "@/components/screens/stats-screen"
import { BottomNav } from "@/components/bottom-nav"
import { FloatingSupportButton } from "@/components/floating-support-button"

export default function StatsPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <StatsScreen />
      </div>
      <FloatingSupportButton />
      <BottomNav />
    </div>
  )
}
