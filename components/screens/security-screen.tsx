import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Shield, Lock, Smartphone, Key, ChevronRight, CheckCircle2, AlertTriangle } from "lucide-react"

export function SecurityScreen() {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <h1 className="text-2xl font-bold">Безопасность</h1>

      {/* Security Status */}
      <Card className="p-4 bg-primary/5 border-primary/20">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-primary/10">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Статус безопасности</h3>
            <p className="text-sm text-muted-foreground mb-3">Ваш аккаунт защищён на 85%</p>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "85%" }} />
            </div>
          </div>
        </div>
      </Card>

      {/* Authentication */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Аутентификация</h2>
        <div className="space-y-2">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-medium">Изменить пароль</p>
                  <p className="text-xs text-muted-foreground">Последнее изменение: 2 дня назад</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-success/10">
                  <Smartphone className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">Двухфакторная аутентификация</p>
                    <CheckCircle2 className="w-4 h-4 text-success" />
                  </div>
                  <p className="text-xs text-muted-foreground">Защита через SMS</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-muted">
                  <Key className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">PIN-код</p>
                    <Badge variant="outline" className="text-xs">
                      Рекомендуется
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Быстрый вход в приложение</p>
                </div>
              </div>
              <Switch />
            </div>
          </Card>
        </div>
      </div>

      {/* Active Sessions */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Активные сессии</h2>
        <div className="space-y-2">
          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium">iPhone 15 Pro</p>
                  <Badge className="bg-success text-white text-xs">Текущая</Badge>
                </div>
                <p className="text-xs text-muted-foreground">Москва, Россия</p>
                <p className="text-xs text-muted-foreground">Последняя активность: только что</p>
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium mb-1">Android • Chrome</p>
                <p className="text-xs text-muted-foreground">Санкт-Петербург, Россия</p>
                <p className="text-xs text-muted-foreground">Последняя активность: 3 дня назад</p>
              </div>
              <Button size="sm" variant="ghost" className="text-destructive">
                Завершить
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Security Tips */}
      <Card className="p-4 bg-warning/5 border-warning/20">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
          <div>
            <h3 className="font-semibold mb-1">Советы по безопасности</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Не передавайте пароль третьим лицам</li>
              <li>• Используйте уникальный пароль для каждого сервиса</li>
              <li>• Регулярно проверяйте активные сессии</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
