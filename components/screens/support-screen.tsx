import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Mail, Phone, FileText, HelpCircle, Send, ChevronRight, Clock, CheckCircle2 } from "lucide-react"

export function SupportScreen() {
  const tickets = [
    {
      id: "#SUP-1234",
      title: "Проблема с выводом средств",
      status: "open",
      date: "15 янв, 14:32",
      lastReply: "Ожидает ответа поддержки",
    },
    {
      id: "#SUP-1221",
      title: "Вопрос по комиссии",
      status: "answered",
      date: "12 янв, 10:15",
      lastReply: "Получен ответ от поддержки",
    },
    {
      id: "#SUP-1198",
      title: "Модерация креатива",
      status: "closed",
      date: "8 янв, 18:45",
      lastReply: "Запрос решён",
    },
  ]

  const faqItems = [
    "Как пополнить баланс?",
    "Какие комиссии при выводе?",
    "Как создать рекламную кампанию?",
    "Правила модерации контента",
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-warning text-white">Открыт</Badge>
      case "answered":
        return <Badge className="bg-primary text-white">Отвечен</Badge>
      case "closed":
        return <Badge variant="outline">Закрыт</Badge>
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="w-4 h-4 text-warning" />
      case "answered":
        return <MessageCircle className="w-4 h-4 text-primary" />
      case "closed":
        return <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
      default:
        return null
    }
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h1 className="text-2xl font-bold">Поддержка</h1>

      {/* Contact Options */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 flex flex-col items-center gap-2 hover:bg-secondary/50 transition-colors cursor-pointer">
          <div className="p-2 rounded-full bg-primary/10">
            <MessageCircle className="w-5 h-5 text-primary" />
          </div>
          <span className="text-xs font-medium text-center">Чат</span>
        </Card>

        <Card className="p-3 flex flex-col items-center gap-2 hover:bg-secondary/50 transition-colors cursor-pointer">
          <div className="p-2 rounded-full bg-accent/10">
            <Mail className="w-5 h-5 text-accent" />
          </div>
          <span className="text-xs font-medium text-center">Email</span>
        </Card>

        <Card className="p-3 flex flex-col items-center gap-2 hover:bg-secondary/50 transition-colors cursor-pointer">
          <div className="p-2 rounded-full bg-success/10">
            <Phone className="w-5 h-5 text-success" />
          </div>
          <span className="text-xs font-medium text-center">Телефон</span>
        </Card>
      </div>

      {/* FAQ */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Частые вопросы</h2>
          <Button size="sm" variant="ghost">
            Все
          </Button>
        </div>
        <div className="space-y-2">
          {faqItems.map((item, index) => (
            <Card key={index} className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <span className="flex-1 text-sm font-medium">{item}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* My Tickets */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Мои обращения</h2>
        <div className="space-y-2">
          {tickets.map((ticket) => (
            <Card key={ticket.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="mt-1">{getStatusIcon(ticket.status)}</div>
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-balance">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground">{ticket.id}</p>
                    </div>
                    {getStatusBadge(ticket.status)}
                  </div>
                  <p className="text-xs text-muted-foreground">{ticket.lastReply}</p>
                  <p className="text-xs text-muted-foreground">{ticket.date}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* New Request */}
      <Card className="p-4">
        <h3 className="font-semibold mb-3">Новое обращение</h3>
        <div className="space-y-3">
          <Input placeholder="Тема обращения" />
          <Textarea placeholder="Опишите вашу проблему..." rows={4} />
          <Button className="w-full gap-2">
            <Send className="w-4 h-4" />
            Отправить
          </Button>
        </div>
      </Card>

      {/* Help Resources */}
      <Card className="p-4 bg-muted/50">
        <div className="flex items-start gap-3">
          <FileText className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">База знаний</h3>
            <p className="text-sm text-muted-foreground mb-2">Документация и руководства пользователя</p>
            <Button size="sm" variant="outline">
              Перейти
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
