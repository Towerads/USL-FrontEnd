import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, ExternalLink, Eye, Users, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"

export function PublisherChannels() {
  const channels = [
    {
      id: 1,
      name: "Технологии будущего",
      username: "@tech_future",
      subscribers: 45200,
      status: "active",
      revenue: "234.50",
      impressions: 89450,
      engagement: "4.2",
      category: "Технологии",
    },
    {
      id: 2,
      name: "Бизнес идеи",
      username: "@business_ideas",
      subscribers: 28900,
      status: "active",
      revenue: "156.80",
      impressions: 56230,
      engagement: "3.8",
      category: "Бизнес",
    },
    {
      id: 3,
      name: "Криптовалюта News",
      username: "@crypto_news",
      subscribers: 62100,
      status: "pending",
      revenue: "0",
      impressions: 0,
      engagement: "0",
      category: "Финансы",
    },
  ]

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Мои каналы</h1>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input placeholder="Поиск каналов..." className="pl-9" />
      </div>

      <Card className="p-4 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Общий доход</p>
            <p className="text-2xl font-bold text-success">+391.30 USDT</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Всего каналов</p>
            <p className="text-2xl font-bold">{channels.length}</p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        {channels.map((channel) => (
          <Card key={channel.id} className="p-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-balance">{channel.name}</h3>
                    <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{channel.username}</p>
                  <Badge variant="outline" className="mt-1 text-[10px]">
                    {channel.category}
                  </Badge>
                </div>
                <Badge
                  className={
                    channel.status === "active"
                      ? "bg-success text-white"
                      : channel.status === "pending"
                        ? "bg-warning text-white"
                        : "bg-muted text-muted-foreground"
                  }
                >
                  {channel.status === "active" ? "Активен" : "Модерация"}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Подписчики</p>
                    <p className="text-sm font-semibold">{channel.subscribers.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Показы</p>
                    <p className="text-sm font-semibold">{channel.impressions.toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Вовлечённость</p>
                    <p className="text-sm font-semibold">{channel.engagement}%</p>
                  </div>
                </div>
              </div>

              {channel.status === "active" && (
                <div className="flex items-center justify-between p-3 bg-success/5 rounded-lg">
                  <span className="text-sm text-muted-foreground">Доход за месяц</span>
                  <span className="text-lg font-bold text-success">+{channel.revenue} USDT</span>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  Статистика
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  Настройки
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-gradient-to-r from-primary/5 to-accent/5">
        <h3 className="font-semibold mb-2">Добавьте новый канал</h3>
        <p className="text-sm text-muted-foreground mb-3">
          Подключите Telegram канал и начните зарабатывать на рекламе
        </p>
        <Button className="w-full">Подключить канал</Button>
      </Card>
    </div>
  )
}
