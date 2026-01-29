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
import { API_URL } from "../../lib/api"


const { Title, Text } = Typography

type Advertiser = {
  id: string
  telegram_user_id: string
  email: string
  status: string
  created_at: string
}

type TgUser = {
  id: number
  first_name?: string
  username?: string
}

export function ProfileNewScreen() {
  const [userType, setUserType] = useState<"advertiser" | "publisher">(
    "advertiser"
  )
  const [advertiser, setAdvertiser] = useState<Advertiser | null>(null)
  const [tgUser, setTgUser] = useState<TgUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log("INIT PROFILE SCREEN")

    const tg = window.Telegram?.WebApp
    let user: TgUser | null = null

    if (tg?.initDataUnsafe?.user?.id) {
      // ✅ Реальный Telegram
      user = tg.initDataUnsafe.user
      console.log("TG USER (REAL):", user)
    } else {
      // ⚠️ FALLBACK ДЛЯ БРАУЗЕРА
      user = {
        id: 123456789,
        first_name: "Browser",
        username: "debug_user",
      }
      console.warn("TG USER (FALLBACK):", user)
    }

    setTgUser(user)

    fetch(`${API_URL}/advertiser/me`, {
      headers: {
        "X-TG-USER-ID": String(user.id),
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("HTTP " + res.status)
        return res.json()
      })
      .then((data) => {
        console.log("BACKEND DATA:", data)
        setAdvertiser(data.advertiser)
      })
      .catch((err) => {
        console.error("FETCH ERROR:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <Spin fullscreen />
  }

  if (!advertiser || !tgUser) {
    return <div style={{ padding: 20 }}>Ошибка загрузки профиля</div>
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        paddingBottom: "100px",
      }}
    >
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", paddingTop: "20px" }}>
          <Avatar
            size={80}
            icon={<UserOutlined />}
            style={{ marginBottom: "12px" }}
          />
          <Title level={3} style={{ margin: 0, fontWeight: 700 }}>
            {tgUser.first_name || "Без имени"}
          </Title>
          <Text type="secondary">
            @{tgUser.username || tgUser.id}
          </Text>
        </div>

        {/* Account Type */}
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: "rgba(22, 119, 255, 0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {userType === "advertiser" ? (
                <RocketOutlined style={{ fontSize: 20, color: "#1677ff" }} />
              ) : (
                <TeamOutlined style={{ fontSize: 20, color: "#52c41a" }} />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <Text strong style={{ display: "block", marginBottom: "8px" }}>
                Тип аккаунта
              </Text>

              <Radio.Group
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                style={{ width: "100%" }}
              >
                <Space direction="vertical" style={{ width: "100%" }} size={8}>
                  <Radio value="advertiser">Рекламодатель</Radio>
                  <Radio value="publisher" disabled>
                    Паблишер (скоро)
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>
        </Card>

        {/* Balance */}
        <div>
          <Text strong style={{ display: "block", marginBottom: "12px" }}>
            Баланс
          </Text>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
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

        {/* Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Button type="primary" icon={<ArrowUpOutlined />} size="large" block>
            Пополнить
          </Button>
          <Button icon={<ArrowDownOutlined />} size="large" block>
            Вывести
          </Button>
        </div>

        <Divider />

        {/* Menu */}
        <Space direction="vertical" size={12} style={{ width: "100%" }}>
          <Button type="text" block href="/support-chat">
            <Space>
              <CustomerServiceOutlined />
              <Text strong>Поддержка</Text>
            </Space>
            <RightOutlined />
          </Button>

          <Button type="text" block>
            <Space>
              <GiftOutlined />
              <Text strong>Реферальная программа</Text>
            </Space>
            <RightOutlined />
          </Button>

          <Button type="text" block href="/settings">
            <Space>
              <SettingOutlined />
              <Text strong>Настройки</Text>
            </Space>
            <RightOutlined />
          </Button>
        </Space>

        {/* App Info */}
        <div style={{ textAlign: "center", paddingTop: 20 }}>
          <Text type="secondary">USL версия 1.0.0</Text>
          <br />
          <Text type="secondary">© 2025 UP Stream Lab</Text>
        </div>
      </Space>
    </div>
  )
}
