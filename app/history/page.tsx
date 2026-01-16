import { HistoryScreen } from "@/components/screens/history-screen"
import { BottomNav } from "@/components/bottom-nav"

export default function HistoryPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <HistoryScreen />
      </div>
      <BottomNav />
    </div>
  )
}
