import { PublisherDashboardNew } from "@/components/screens/publisher-dashboard-new"
import { BottomNav } from "@/components/bottom-nav"

export default function PublisherPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <PublisherDashboardNew />
      </div>
      <BottomNav userType="publisher" />
    </div>
  )
}
