import { WalletScreen } from "@/components/screens/wallet-screen"
import { BottomNav } from "@/components/bottom-nav"

export default function WalletPage() {
  return (
    <div className="flex flex-col h-screen bg-background ">
      <div className="flex-1 overflow-y-auto pb-20">
        <WalletScreen />
      </div>
      <BottomNav />
    </div>
  )
}
