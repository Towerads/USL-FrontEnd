"use client"

import { Card, Button, Badge, Space, Typography, Statistic, Progress, Row, Col } from 'antd';
import { BellOutlined, PlusOutlined, RiseOutlined, EyeOutlined, AimOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export function AdvertiserDashboard() {
  const activeCampaigns = [
    {
      id: 1,
      name: "Промо акция зима",
      status: "active",
      budget: "500",
      spent: "320",
      impressions: 45230,
      clicks: 1234,
      ctr: "2.73",
    },
    {
      id: 2,
      name: "Новогодняя распродажа",
      status: "paused",
      budget: "1000",
      spent: "680",
      impressions: 89450,
      clicks: 2876,
      ctr: "3.22",
    },
  ]

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <div>
            <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '28px' }}>Рекламодатель</Title>
            <Text type="secondary" style={{ fontSize: '15px' }}>UP Stream Lab</Text>
          </div>
          <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: '20px' }} />} />
        </div>

        {/* Quick Stats */}
        <Row gutter={12}>
          <Col span={12}>
            <Card>
              <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Баланс</Text>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>1,234.56</div>
              <Text type="secondary" style={{ fontSize: '14px' }}>USDT</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Потрачено</Text>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>1,000</div>
              <Text type="secondary" style={{ fontSize: '14px' }}>USDT</Text>
            </Card>
          </Col>
        </Row>

        {/* Performance Overview */}
        <Card>
          <Title level={5} style={{ marginBottom: '16px', fontWeight: 700, fontSize: '18px' }}>Общая статистика</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Space size="small">
                  <EyeOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>Показы</Text>
                </Space>
                <Text strong style={{ fontSize: '18px' }}>134.7K</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Space size="small">
                  <AimOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Клики</Text>
                </Space>
                <Text strong style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em' }}>4.1K</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Space size="small">
                  <RiseOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                  <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>CTR</Text>
                </Space>
                <Text strong style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em', color: '#0070F3' }}>3.04%</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Active Campaigns */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: '20px' }}>Активные кампании</Title>
            <Button type="primary" icon={<PlusOutlined />} size="large">
              Создать
            </Button>
          </div>

          <Space direction="vertical" size={10} style={{ width: '100%' }}>
            {activeCampaigns.map((campaign) => (
              <Card key={campaign.id}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Title level={5} style={{ margin: 0, fontWeight: 700, fontSize: '16px' }}>{campaign.name}</Title>
                      <Text type="secondary" style={{ fontSize: '14px' }}>ID: #{campaign.id}</Text>
                    </div>
                    <Badge 
                      status={campaign.status === "active" ? "success" : "warning"}
                      text={campaign.status === "active" ? "Активна" : "На паузе"}
                    />
                  </div>

                  <Space direction="vertical" size="small" style={{ width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text type="secondary" style={{ fontSize: '14px' }}>Бюджет</Text>
                      <Text strong style={{ fontSize: '14px' }}>
                        {campaign.spent} / {campaign.budget} USDT
                      </Text>
                    </div>
                    <Progress 
                      percent={(Number.parseFloat(campaign.spent) / Number.parseFloat(campaign.budget)) * 100} 
                      showInfo={false}
                      strokeColor="#4169E1"
                    />
                  </Space>

                  <Row gutter={8} style={{ paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
                    <Col span={8}>
                      <Text type="secondary" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Показы</Text>
                      <Text strong style={{ fontSize: '20px', fontWeight: 600, letterSpacing: '-0.02em' }}>{campaign.impressions.toLocaleString()}</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Клики</Text>
                      <Text strong style={{ fontSize: '14px' }}>{campaign.clicks}</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>CTR</Text>
                      <Text strong style={{ fontSize: '14px', color: '#10B981' }}>{campaign.ctr}%</Text>
                    </Col>
                  </Row>
                </Space>
              </Card>
            ))}
          </Space>
        </div>

        {/* Quick Actions */}
        <Card style={{ background: 'linear-gradient(135deg, rgba(22, 119, 255, 0.1) 0%, rgba(64, 150, 255, 0.05) 100%)' }}>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Title level={5} style={{ margin: 0, marginBottom: '8px', fontWeight: 700, fontSize: '18px' }}>Начните продвижение</Title>
              <Text type="secondary" style={{ fontSize: '15px' }}>
                Создайте кампанию и начните привлекать клиентов уже сегодня
              </Text>
            </div>
            <Button type="primary" block size="large">Создать первую кампанию</Button>
          </Space>
        </Card>
      </Space>
    </div>
  )
}
