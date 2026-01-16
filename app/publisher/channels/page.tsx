import { PublisherChannels } from "@/components/publisher/publisher-channels"
import { BottomNav } from "@/components/bottom-nav"

export default function PublisherChannelsPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <PublisherChannels />
      </div>
      <BottomNav userType="publisher" />
    </div>
  )
}
