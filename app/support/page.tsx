import { SupportScreen } from "@/components/screens/support-screen"
import { BottomNav } from "@/components/bottom-nav"

export default function SupportPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <SupportScreen />
      </div>
      <BottomNav />
    </div>
  )
}
