"use client"

import { Card, Button, Badge, Space, Typography, Statistic } from 'antd';
import { PlusOutlined, PlayCircleOutlined, PauseCircleOutlined, EyeOutlined, AimOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export function CampaignsScreen() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px' }}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* Coming Soon Banner */}
        <Card style={{ borderStyle: 'dashed' }}>
          <div style={{ textAlign: 'center' }}>
            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <div style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%', 
                backgroundColor: 'rgba(65, 105, 225, 0.1)' 
              }}>
                <PlayCircleOutlined style={{ fontSize: '24px', color: '#4169E1' }} />
              </div>
              <Title level={4} style={{ margin: 0 }}>Размещение постов</Title>
              <Text type="secondary">Функция будет доступна в ближайшее время</Text>
              <Badge count="Скоро" style={{ backgroundColor: '#f0f0f0', color: 'rgba(0, 0, 0, 0.65)' }} />
            </Space>
          </div>
        </Card>

        {/* Active Campaigns Preview */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: '20px' }}>Активные кампании</Title>
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Создать
            </Button>
          </div>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {[
              { id: 1, name: "Промо видео #1", status: "active", views: 1543, clicks: 127, budget: "250.00" },
              { id: 2, name: "Анонс продукта", status: "paused", views: 892, clicks: 45, budget: "150.00" },
              { id: 3, name: "Летняя распродажа", status: "active", views: 2341, clicks: 198, budget: "400.00" },
              { id: 4, name: "Новый продукт 2025", status: "active", views: 3120, clicks: 245, budget: "500.00" },
              { id: 5, name: "Спецпредложение", status: "paused", views: 567, clicks: 34, budget: "120.00" },
            ].map((campaign) => (
              <Card key={campaign.id}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text strong style={{ fontSize: '16px', display: 'block' }}>{campaign.name}</Text>
                      <Space size="small" style={{ marginTop: '4px' }}>
                        <Badge 
                          status={campaign.status === "active" ? "processing" : "default"}
                          text={campaign.status === "active" ? "Активна" : "На паузе"}
                        />
                        <Text type="secondary" style={{ fontSize: '12px' }}>Бюджет: {campaign.budget} USDT</Text>
                      </Space>
                    </div>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '16px', 
                    paddingTop: '8px', 
                    borderTop: '1px solid var(--color-border)' 
                  }}>
                    <Space size="small">
                      <EyeOutlined style={{ color: 'var(--color-text-secondary)' }} />
                      <Text strong>{campaign.views.toLocaleString()}</Text>
                    </Space>
                    <Space size="small">
                      <AimOutlined style={{ color: 'var(--color-text-secondary)' }} />
                      <Text strong>{campaign.clicks}</Text>
                    </Space>
                    <div style={{ marginLeft: 'auto' }}>
                      <Button type="text">Подробнее</Button>
                    </div>
                  </div>
                </Space>
              </Card>
            ))}
          </Space>
        </div>
      </Space>
    </div>
  )
}
