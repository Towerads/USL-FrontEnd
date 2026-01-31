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
} from "antd"
import {
  PlusOutlined,
  ShoppingOutlined,
  EyeOutlined,
} from "@ant-design/icons"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"

const { Title, Text } = Typography

type Creative = {
  id: string
  title?: string
  type: string
  media_url: string
  click_url: string
  duration: number | null
  status: string
  created_at: string
}

export function CreativesNewScreen() {
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("active")
  const [creatives, setCreatives] = useState<Creative[]>([])
  const [loading, setLoading] = useState(true)

  // --------------------
  // LOAD FROM BACKEND
  // --------------------
  useEffect(() => {
    const tgUserId =
      window.Telegram?.WebApp?.initDataUnsafe?.user?.id

    if (!tgUserId) return

    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/advertiser/creatives`,
      {
        headers: {
          "X-TG-USER-ID": String(tgUserId),
        },
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setCreatives(data.creatives || [])
      })
      .finally(() => setLoading(false))
  }, [])

  // --------------------
  // GROUPING
  // --------------------
  const grouped = useMemo(() => {
    return {
      active: creatives.filter((c) =>
        ["active", "approved"].includes(c.status)
      ),
      pending: creatives.filter((c) => c.status === "pending"),
      drafts: creatives.filter((c) => c.status === "draft"),
      completed: creatives.filter((c) =>
        ["completed", "frozen"].includes(c.status)
      ),
    }
  }, [creatives])

  // --------------------
  // STATS
  // --------------------
  const totalCount = creatives.length
  const activeCount = grouped.active.length

  // просмотры пока честно не считаем
  const views = "—"

  // --------------------
  // STATUS BADGE
  // --------------------
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return <Badge status="success" text="В работе" />
      case "pending":
        return <Badge status="processing" text="На проверке" />
      case "draft":
        return <Badge status="warning" text="Черновик" />
      case "completed":
      case "frozen":
        return <Badge status="default" text="Завершен" />
      case "rejected":
        return <Badge status="error" text="Отклонён" />
      default:
        return null
    }
  }

  // --------------------
  // RENDER
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
        <Title level={2} style={{ margin: 0 }}>
          Креативы
        </Title>

        {/* STATS */}
        <Card>
          <Title level={5}>Общая статистика</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Text type="secondary">Всего</Text>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {totalCount}
              </div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Активных</Text>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#52c41a",
                }}
              >
                {activeCount}
              </div>
            </Col>
            <Col span={8}>
              <Text type="secondary">Просмотры</Text>
              <div style={{ fontSize: 18, fontWeight: 600 }}>
                {views}
              </div>
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
            {
              key: "active",
              label: `В работе (${grouped.active.length})`,
            },
            {
              key: "pending",
              label: `На проверке (${grouped.pending.length})`,
            },
            {
              key: "drafts",
              label: `Черновики (${grouped.drafts.length})`,
            },
            {
              key: "completed",
              label: `Завершённые (${grouped.completed.length})`,
            },
          ]}
        />

        {/* LIST */}
        {loading ? (
          <Spin />
        ) : grouped[activeTab as keyof typeof grouped].length === 0 ? (
          <Empty description="Пока пусто" />
        ) : (
          <Space direction="vertical" size={12} style={{ width: "100%" }}>
            {grouped[activeTab as keyof typeof grouped].map((c) => (
              <Card key={c.id} hoverable>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <div>
                      <Title level={5} style={{ margin: 0 }}>
                        {c.title || "Без названия"}
                      </Title>
                      <Text type="secondary">{c.type}</Text>
                    </div>
                    {getStatusBadge(c.status)}
                  </div>

                  {(c.status === "active" ||
                    c.status === "approved") && (
                    <Space size={6}>
                      <EyeOutlined />
                      <Text type="secondary">идёт показ</Text>
                    </Space>
                  )}

                  {c.status === "draft" && (
                    <Button type="primary" block>
                      Продолжить
                    </Button>
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
