import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ArrowUpRight, ArrowDownLeft, Clock, CheckCircle2, XCircle, Search, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HistoryScreen() {
  const transactions = [
    {
      id: "TXN-001",
      type: "deposit",
      amount: "500.00",
      status: "completed",
      title: "Пополнение USDT",
      date: "15 янв 2025, 14:32",
      fee: "0.00",
    },
    {
      id: "TXN-002",
      type: "withdrawal",
      amount: "250.00",
      status: "completed",
      title: "Вывод USDT",
      date: "15 янв 2025, 10:15",
      fee: "2.50",
    },
    {
      id: "TXN-003",
      type: "payment",
      amount: "75.00",
      status: "pending",
      title: "Оплата кампании #1234",
      date: "14 янв 2025, 18:45",
      fee: "0.00",
    },
    {
      id: "TXN-004",
      type: "income",
      amount: "120.00",
      status: "completed",
      title: "Доход от размещения",
      date: "14 янв 2025, 12:20",
      fee: "0.00",
    },
    {
      id: "TXN-005",
      type: "withdrawal",
      amount: "1000.00",
      status: "failed",
      title: "Вывод USDT",
      date: "13 янв 2025, 09:30",
      fee: "10.00",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="w-4 h-4 text-success" />
      case "pending":
        return <Clock className="w-4 h-4 text-warning" />
      case "failed":
        return <XCircle className="w-4 h-4 text-destructive" />
      default:
        return null
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-success text-white">Завершено</Badge>
      case "pending":
        return <Badge className="bg-warning text-white">В обработке</Badge>
      case "failed":
        return <Badge className="bg-destructive text-white">Отклонено</Badge>
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    if (type === "deposit" || type === "income") {
      return <ArrowDownLeft className="w-4 h-4" />
    }
    return <ArrowUpRight className="w-4 h-4" />
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">История операций</h1>
        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
          <Download className="w-4 h-4" />
          Экспорт
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Поиск по ID или описанию" className="pl-9" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Все</TabsTrigger>
          <TabsTrigger value="income">Доходы</TabsTrigger>
          <TabsTrigger value="expenses">Расходы</TabsTrigger>
          <TabsTrigger value="pending">В ожидании</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3 mt-4">
          {transactions.map((tx) => (
            <Card key={tx.id} className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={`p-2 rounded-full mt-1 ${
                    tx.type === "deposit" || tx.type === "income" ? "bg-success/10" : "bg-muted"
                  }`}
                >
                  {getTypeIcon(tx.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-balance">{tx.title}</p>
                      <p className="text-xs text-muted-foreground">{tx.date}</p>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          tx.type === "deposit" || tx.type === "income" ? "text-success" : "text-foreground"
                        }`}
                      >
                        {tx.type === "deposit" || tx.type === "income" ? "+" : "-"}
                        {tx.amount} USDT
                      </p>
                      {tx.fee !== "0.00" && <p className="text-xs text-muted-foreground">Комиссия: {tx.fee}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground font-mono">{tx.id}</p>
                    {getStatusBadge(tx.status)}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="income" className="mt-4">
          <p className="text-sm text-muted-foreground text-center py-8">Отображение только входящих транзакций</p>
        </TabsContent>

        <TabsContent value="expenses" className="mt-4">
          <p className="text-sm text-muted-foreground text-center py-8">Отображение только исходящих транзакций</p>
        </TabsContent>

        <TabsContent value="pending" className="mt-4">
          <p className="text-sm text-muted-foreground text-center py-8">Отображение транзакций в обработке</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
