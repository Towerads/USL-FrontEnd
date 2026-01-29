"use client"

import {
  Card,
  Button,
  Avatar,
  Space,
  Typography,
  Radio,
  Divider,
  Spin,
  message,
} from "antd"
import {
  UserOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  CustomerServiceOutlined,
  GiftOutlined,
  SettingOutlined,
  RightOutlined,
  RocketOutlined,
  TeamOutlined,
} from "@ant-design/icons"
import { useEffect, useState } from "react"

const { Title, Text } = Typography

const API_URL = "https://towerads-backend.onrender.com"

type Advertiser = {
  id: string
  telegram_user_id: string
  email: string | null
  status: string
  created_at: string
}

export function ProfileScreen() {
  const [loading, setLoading] = useState(true)
  const [advertiser, setAdvertiser] = useState<Advertiser | null>(null)
  const [tgUser, setTgUser] = useState<any>(null)
  const [userType, setUserType] = useState<"advertiser" | "publisher">(
    "advertiser"
  )

  useEffect(() => {
    // 1️⃣ Проверяем Telegram WebApp
    const tg = (window as any).Telegram?.WebApp
    if (!tg) {
      console.warn("Telegram WebApp not found (browser mode)")
      setLoading(false)
      return
    }

    tg.ready()
    tg.expand()

    const user = tg.initDataUnsafe?.user
    if (!user?.id) {
      message.error("Не удалось получить Telegram user")
      setLoading(false)
      return
    }

    setTgUser(user)

    // 2️⃣ Запрос в бекенд
    fetch(`${API_URL}/advertiser/me`, {
      headers: {
        "X-TG-USER-ID": String(user.id),
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text()
          throw new Error(text)
        }
        return res.json()
      })
      .then((data) => {
        console.log("✅ BACKEND RESPONSE:", data)
        setAdvertiser(data.advertiser)
        setUserType("advertiser")
      })
      .catch((err) => {
        console.error("❌ BACKEND ERROR:", err)
        message.error("Ошибка загрузки профиля")
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <Spin fullscreen />
  }

  if (!tgUser || !advertiser) {
    return (
      <div style={{ padding: 20 }}>
        <Title level={4}>Профиль недоступен</Title>
        <Text type="secondary">
          Откройте приложение через Telegram Mini App
        </Text>
      </div>
    )
  }

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        {/* HEADER */}
        <div style={{ textAlign: "center" }}>
          <Avatar size={80} icon={<UserOutlined />} />
          <Title level={3} style={{ marginTop: 12 }}>
            {tgUser.first_name} {tgUser.last_name}
          </Title>
          <Text type="secondary">@{tgUser.username}</Text>
        </div>

        {/* ACCOUNT TYPE */}
        <Card>
          <Text strong>Тип аккаунта</Text>
          <Radio.Group value={userType} style={{ marginTop: 12 }}>
            <Space direction="vertical">
              <Radio value="advertiser">
                <RocketOutlined /> Рекламодатель
              </Radio>
              <Radio value="publisher" disabled>
                <TeamOutlined /> Паблишер (скоро)
              </Radio>
            </Space>
          </Radio.Group>
        </Card>

        {/* BALANCE */}
        <div>
          <Text strong>Баланс</Text>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginTop: 12,
            }}
          >
            <Card>
              <Text type="secondary">Доступно</Text>
              <div style={{ fontSize: 24, fontWeight: 700 }}>0.00</div>
              <Text type="secondary">USDT</Text>
            </Card>
            <Card>
              <Text type="secondary">Заморожено</Text>
              <div style={{ fontSize: 24, fontWeight: 700 }}>0.00</div>
              <Text type="secondary">USDT</Text>
            </Card>
          </div>
        </div>

        {/* ACTIONS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
          }}
        >
          <Button type="primary" icon={<ArrowUpOutlined />}>
            Пополнить
          </Button>
          <Button icon={<ArrowDownOutlined />}>Вывести</Button>
        </div>

        <Divider />

        {/* MENU */}
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button type="text" block href="/support-chat">
            <CustomerServiceOutlined /> Поддержка
            <RightOutlined />
          </Button>

          <Button type="text" block>
            <GiftOutlined /> Реферальная программа
            <RightOutlined />
          </Button>

          <Button type="text" block href="/settings">
            <SettingOutlined /> Настройки
            <RightOutlined />
          </Button>
        </Space>

        {/* INFO */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Text type="secondary">USL v1.0.0</Text>
        </div>
      </Space>
    </div>
  )
}
