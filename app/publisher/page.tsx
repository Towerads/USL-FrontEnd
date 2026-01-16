import { PublisherDashboard } from "@/components/publisher/publisher-dashboard"
import { BottomNav } from "@/components/bottom-nav"
import { FloatingSupportButton } from "@/components/floating-support-button"

export default function PublisherPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <PublisherDashboard />
      </div>
      <FloatingSupportButton />
      <BottomNav userType="publisher" />
    </div>
  )
}
