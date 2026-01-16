import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Video, Plus, MoreVertical, Eye, Heart, MessageCircle } from "lucide-react"

export function CreativesScreen() {
  const creatives = [
    {
      id: 1,
      type: "video",
      title: "Промо ролик #1",
      status: "active",
      views: 12450,
      likes: 890,
      comments: 45,
      thumbnail: "/promotional-video-thumbnail.png",
    },
    {
      id: 2,
      type: "image",
      title: "Баннер акция",
      status: "moderation",
      views: 5230,
      likes: 423,
      comments: 12,
      thumbnail: "/promo-banner-blue.jpg",
    },
    {
      id: 3,
      type: "video",
      title: "Обучающий контент",
      status: "rejected",
      views: 0,
      likes: 0,
      comments: 0,
      thumbnail: "/educational-video-thumbnail.png",
    },
  ]

  const statusConfig = {
    active: { label: "Активен", color: "bg-success text-white" },
    moderation: { label: "На проверке", color: "bg-warning text-white" },
    rejected: { label: "Отклонён", color: "bg-destructive text-white" },
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Мои креативы</h1>
        <Button size="sm" className="gap-2">
          <Plus className="w-4 h-4" />
          Добавить
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Всего</p>
          <p className="text-2xl font-bold">12</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">Активных</p>
          <p className="text-2xl font-bold text-success">8</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-muted-foreground mb-1">На проверке</p>
          <p className="text-2xl font-bold text-warning">3</p>
        </Card>
      </div>

      {/* Creatives List */}
      <div className="space-y-3">
        {creatives.map((creative) => {
          const status = statusConfig[creative.status as keyof typeof statusConfig]
          return (
            <Card key={creative.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={creative.thumbnail || "/placeholder.svg"}
                  alt={creative.title}
                  className="w-full h-40 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className={status.color}>{status.label}</Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <div className="p-1.5 rounded-full bg-card/80 backdrop-blur-sm">
                    {creative.type === "video" ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-3">
                  <h3 className="font-semibold text-balance">{creative.title}</h3>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>

                {creative.status === "active" && (
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {creative.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {creative.likes}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {creative.comments}
                    </span>
                  </div>
                )}

                {creative.status === "rejected" && (
                  <p className="text-sm text-destructive">Причина: Нарушение правил платформы</p>
                )}
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
