"use client"

import { Card, Button, Badge, Space, Typography, Row, Col, Image } from 'antd';
import { PictureOutlined, VideoCameraOutlined, PlusOutlined, MoreOutlined, EyeOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

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
    active: { label: "Активен", status: "success" as const },
    moderation: { label: "На проверке", status: "warning" as const },
    rejected: { label: "Отклонён", status: "error" as const },
  }

  return (
    <div style={{ padding: '16px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>Мои креативы</Title>
          <Button type="primary" icon={<PlusOutlined />}>
            Добавить
          </Button>
        </div>

        <Row gutter={12}>
          <Col span={8}>
            <Card>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Всего</Text>
              <Title level={2} style={{ margin: 0 }}>12</Title>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Активных</Text>
              <Title level={2} style={{ margin: 0, color: '#10B981' }}>8</Title>
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>На проверке</Text>
              <Title level={2} style={{ margin: 0, color: '#F59E0B' }}>3</Title>
            </Card>
          </Col>
        </Row>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          {creatives.map((creative) => {
            const status = statusConfig[creative.status as keyof typeof statusConfig]
            return (
              <Card key={creative.id} style={{ overflow: 'hidden' }}>
                <div style={{ position: 'relative', marginBottom: '12px' }}>
                  <Image
                    src={creative.thumbnail || "/placeholder.svg"}
                    alt={creative.title}
                    style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }}
                    preview={false}
                  />
                  <div style={{ position: 'absolute', top: '8px', left: '8px' }}>
                    <Badge status={status.status} text={status.label} />
                  </div>
                  <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                    <div style={{ 
                      padding: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                      backdropFilter: 'blur(4px)'
                    }}>
                      {creative.type === "video" ? 
                        <VideoCameraOutlined style={{ fontSize: '16px' }} /> : 
                        <PictureOutlined style={{ fontSize: '16px' }} />
                      }
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <Title level={5} style={{ margin: 0 }}>{creative.title}</Title>
                  <Button type="text" icon={<MoreOutlined />} />
                </div>

                {creative.status === "active" && (
                  <Space size="large">
                    <Space size="small">
                      <EyeOutlined />
                      <Text>{creative.views.toLocaleString()}</Text>
                    </Space>
                    <Space size="small">
                      <HeartOutlined />
                      <Text>{creative.likes}</Text>
                    </Space>
                    <Space size="small">
                      <MessageOutlined />
                      <Text>{creative.comments}</Text>
                    </Space>
                  </Space>
                )}

                {creative.status === "rejected" && (
                  <Text type="danger" style={{ fontSize: '14px' }}>Причина: Нарушение правил платформы</Text>
                )}
              </Card>
            )
          })}
        </Space>
      </Space>
    </div>
  )
}
