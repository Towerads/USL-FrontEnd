import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"

export function AdvertiserCampaigns() {
  const campaigns = [
    {
      id: 1,
      name: "Промо акция зима",
      status: "active",
      budget: "500",
      spent: "320",
      impressions: 45230,
      clicks: 1234,
      ctr: "2.73",
      startDate: "15 янв",
      endDate: "31 янв",
    },
    {
      id: 2,
      name: "Новогодняя распродажа",
      status: "paused",
      budget: "1000",
      spent: "680",
      impressions: 89450,
      clicks: 2876,
      ctr: "3.22",
      startDate: "20 дек",
      endDate: "10 янв",
    },
    {
      id: 3,
      name: "Весенняя коллекция",
      status: "draft",
      budget: "750",
      spent: "0",
      impressions: 0,
      clicks: 0,
      ctr: "0",
      startDate: "1 мар",
      endDate: "31 мар",
    },
  ]

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Кампании</h1>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Создать
        </Button>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Поиск кампаний..." className="pl-9" />
        </div>
        <Button size="icon" variant="outline">
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button size="sm" variant="default">
          Все
        </Button>
        <Button size="sm" variant="outline">
          Активные
        </Button>
        <Button size="sm" variant="outline">
          На паузе
        </Button>
        <Button size="sm" variant="outline">
          Черновики
        </Button>
      </div>

      <div className="space-y-3">
        {campaigns.map((campaign) => (
          <Card key={campaign.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-balance">{campaign.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {campaign.startDate} - {campaign.endDate}
                  </p>
                </div>
                <Badge
                  className={
                    campaign.status === "active"
                      ? "bg-success text-white"
                      : campaign.status === "paused"
                        ? "bg-warning text-white"
                        : "bg-muted text-muted-foreground"
                  }
                >
                  {campaign.status === "active" ? "Активна" : campaign.status === "paused" ? "На паузе" : "Черновик"}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Бюджет</span>
                  <span className="font-medium">
                    {campaign.spent} / {campaign.budget} USDT
                  </span>
                </div>
                {campaign.status !== "draft" && (
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{
                        width: `${(Number.parseFloat(campaign.spent) / Number.parseFloat(campaign.budget)) * 100}%`,
                      }}
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border">
                <div>
                  <p className="text-xs text-muted-foreground">Показы</p>
                  <p className="text-sm font-semibold">{campaign.impressions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Клики</p>
                  <p className="text-sm font-semibold">{campaign.clicks}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">CTR</p>
                  <p className="text-sm font-semibold text-success">{campaign.ctr}%</p>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Редактировать
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  {campaign.status === "active" ? "Пауза" : campaign.status === "paused" ? "Запустить" : "Опубликовать"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
