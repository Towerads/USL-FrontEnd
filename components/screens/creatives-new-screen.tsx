"use client"

import {
  Card,
  Button,
  Typography,
  Space,
  Tabs,
  Badge,
  Row,
  Col,
  Spin,
  Empty,
  message,
} from "antd"
import {
  PlusOutlined,
  ShoppingOutlined,
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
} from "@ant-design/icons"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

const { Title, Text } = Typography

type Creative = {
  id: string
  title?: string
  type: string
  media_url?: string
  click_url?: string
  duration?: number | null
  status: string
  created_at?: string
}

export function CreativesNewScreen() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("active")
  const [creatives, setCreatives] = useState<Creative[]>([])
  const [loading, setLoading] = useState(true)

  // --------------------
  // LOAD CREATIVES FROM BACKEND
  // --------------------
  const loadCreatives = async () => {
    const tgUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id
    if (!tgUserId) return

    setLoading(true)

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/advertiser/creatives`,
      {
        headers: {
          "X-TG-USER-ID": String(tgUserId),
        },
      }
    )

    const data = await res.json()
    setCreatives(data.creatives || [])
    setLoading(false)
  }

  useEffect(() => {
    loadCreatives()
  }, [])

  // --------------------
  // SUBMIT TO MODERATION
  // --------------------
  const submitCreative = async (id: string) => {
    const tgUserId = window.Telegram?.WebApp?.initDataUnsafe?.user?.id
    if (!tgUserId) return

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/advertiser/creatives/${id}/submit`,
      {
        method: "POST",
        headers: {
          "X-TG-USER-ID": String(tgUserId),
        },
      }
    )

    message.success("Креатив отправлен на модерацию")
    loadCreatives()
  }

  // --------------------
  // GROUPING (НЕ МЕНЯЛ)
  // --------------------
  const grouped = useMemo(() => {
    return {
      active: creatives.filter((c) =>
        ["active", "approved"].includes(c.status)
      ),
      pending: creatives.filter((c) => c.status === "pending"),
      completed: creatives.filter((c) =>
        ["completed", "frozen"].includes(c.status)
      ),
      drafts: creatives.filter((c) => c.status === "draft"),
    }
  }, [creatives])

  // --------------------
  // BADGE (НЕ МЕНЯЛ)
  // --------------------
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return <Badge status="success" text="В работе" />
      case "pending":
        return <Badge status="processing" text="На проверке" />
      case "completed":
      case "frozen":
        return <Badge status="default" text="Завершен" />
      case "draft":
        return <Badge status="warning" text="Черновик" />
      case "rejected":
        return <Badge status="error" text="Отклонён" />
      default:
        return null
    }
  }

  // --------------------
  // RENDER (ВЁРСТКУ НЕ ТРОГАЛ)
  // --------------------
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
        <Title level={2} style={{ margin: 0, fontWeight: 700 }}>
          Креативы
        </Title>

        {/* STATS */}
        <Card>
          <Title level={5}>Общая статистика</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Text type="secondary">Всего</Text>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {creatives.length}
              </div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Активных</Text>
              <div style={{ fontSize: 18, fontWeight: 600, color: "#52c41a" }}>
                {grouped.active.length}
              </div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Просмотры</Text>
              <div style={{ fontSize: 18, fontWeight: 600 }}>—</div>
            </Col>
          </Row>
        </Card>

        {/* ACTIONS */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            block
            onClick={() => router.push("/campaign/create")}
          >
            Создать креатив
          </Button>
          <Button
            icon={<ShoppingOutlined />}
            size="large"
            block
            onClick={() => router.push("/campaign/create")}
          >
            Заказать креатив
          </Button>
        </div>

        {/* TABS */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: "active", label: `В работе (${grouped.active.length})` },
            { key: "pending", label: `На проверке (${grouped.pending.length})` },
            {
              key: "completed",
              label: `Завершенные (${grouped.completed.length})`,
            },
            { key: "drafts", label: `Черновики (${grouped.drafts.length})` },
          ]}
        />

        {/* LIST */}
        {loading ? (
          <Spin />
        ) : grouped[activeTab as keyof typeof grouped].length === 0 ? (
          <Empty description="Пока пусто" />
        ) : (
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {grouped[activeTab as keyof typeof grouped].map((creative) => (
              <Card key={creative.id} hoverable>
                <Space direction="vertical" size={12} style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                    }}
                  >
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {creative.title || "Без названия"}
                      </Title>
                      <Text type="secondary">{creative.type}</Text>
                    </div>
                    {getStatusBadge(creative.status)}
                  </div>

                  {creative.status === "draft" && (
                    <Button
                      type="primary"
                      block
                      onClick={() => submitCreative(creative.id)}
                    >
                      Отправить на модерацию
                    </Button>
                  )}

                  {creative.status === "pending" && (
                    <Text type="secondary">Ожидает проверки</Text>
                  )}
                </Space>
              </Card>
            ))}
          </Space>
        )}
      </Space>
    </div>
  )
}
