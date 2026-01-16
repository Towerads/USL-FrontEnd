"use client"

import { Card, Button, Badge, Space, Typography, Statistic, Row, Col } from 'antd';
import { BellOutlined, PlusOutlined, RiseOutlined, DollarOutlined, EyeOutlined, UserOutlined, PlayCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export function PublisherDashboard() {
  const activeChannels = [
    {
      id: 1,
      name: "Технологии будущего",
      subscribers: 45200,
      status: "active",
      revenue: "234.50",
      impressions: 89450,
      engagement: "4.2",
    },
    {
      id: 2,
      name: "Бизнес идеи",
      subscribers: 28900,
      status: "active",
      revenue: "156.80",
      impressions: 56230,
      engagement: "3.8",
    },
  ]

  return (
    <div style={{ padding: '16px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0 }}>Паблишер</Title>
            <Text type="secondary">UP Stream Lab</Text>
          </div>
          <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: '20px' }} />} />
        </div>

        {/* Quick Stats */}
        <Row gutter={12}>
          <Col span={12}>
            <Card style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)' }}>
              <Statistic
                title="Доход"
                value={391.30}
                precision={2}
                prefix="+"
                suffix="USDT"
                valueStyle={{ fontSize: '24px', fontWeight: 'bold', color: '#10B981' }}
              />
              <Text type="secondary" style={{ fontSize: '12px' }}>USDT за месяц</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card style={{ background: 'linear-gradient(135deg, rgba(65, 105, 225, 0.1) 0%, rgba(65, 105, 225, 0.05) 100%)' }}>
              <Statistic
                title="Подписчики"
                value="74.1K"
                prefix={<UserOutlined />}
                valueStyle={{ fontSize: '24px', fontWeight: 'bold' }}
              />
              <Text type="success" style={{ fontSize: '12px' }}>+2.3K за месяц</Text>
            </Card>
          </Col>
        </Row>

        {/* Performance Overview */}
        <Card>
          <Title level={5} style={{ marginBottom: '12px' }}>Общая статистика</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Space size="small">
                  <EyeOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>Показы</Text>
                </Space>
                <Text strong style={{ fontSize: '18px' }}>145.7K</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Space size="small">
                  <PlayCircleOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>Просмотры</Text>
                </Space>
                <Text strong style={{ fontSize: '18px' }}>89.2K</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Space size="small">
                  <RiseOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>CPM</Text>
                </Space>
                <Text strong style={{ fontSize: '18px', color: '#4169E1' }}>$2.68</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Active Channels */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <Title level={4} style={{ margin: 0 }}>Мои каналы</Title>
            <Button icon={<PlusOutlined />}>
              Добавить
            </Button>
          </div>

          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {activeChannels.map((channel) => (
              <Card key={channel.id}>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Title level={5} style={{ margin: 0 }}>{channel.name}</Title>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {channel.subscribers.toLocaleString()} подписчиков
                      </Text>
                    </div>
                    <Badge status="success" text="Активен" />
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    borderRadius: '8px'
                  }}>
                    <Text type="secondary" style={{ fontSize: '14px' }}>Доход за месяц</Text>
                    <Text strong style={{ fontSize: '18px', color: '#10B981' }}>+{channel.revenue} USDT</Text>
                  </div>

                  <Row gutter={8} style={{ paddingTop: '8px', borderTop: '1px solid var(--color-border)' }}>
                    <Col span={8}>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Показы</Text>
                      <Text strong style={{ fontSize: '14px' }}>{channel.impressions.toLocaleString()}</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Вовлечённость</Text>
                      <Text strong style={{ fontSize: '14px' }}>{channel.engagement}%</Text>
                    </Col>
                    <Col span={8}>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Статус</Text>
                      <Text strong style={{ fontSize: '14px', color: '#10B981' }}>Отлично</Text>
                    </Col>
                  </Row>
                </Space>
              </Card>
            ))}
          </Space>
        </div>

        {/* Quick Actions */}
        <Card style={{ background: 'linear-gradient(90deg, rgba(65, 105, 225, 0.05) 0%, rgba(59, 130, 246, 0.05) 100%)' }}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Title level={5} style={{ margin: 0, marginBottom: '8px' }}>Увеличьте доход</Title>
              <Text type="secondary" style={{ fontSize: '14px' }}>
                Подключите больше каналов и зарабатывайте на размещении рекламы
              </Text>
            </div>
            <Button type="primary" block>Добавить канал</Button>
          </Space>
        </Card>
      </Space>
    </div>
  )
}
