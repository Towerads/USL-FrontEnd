import { SecurityScreen } from "@/components/screens/security-screen"
import { BottomNav } from "@/components/bottom-nav"

export default function SecurityPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <SecurityScreen />
      </div>
      <BottomNav />
    </div>
  )
}
