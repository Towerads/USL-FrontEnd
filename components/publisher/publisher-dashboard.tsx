"use client"

import { Card, Button, Badge, Space, Typography, Statistic, Row, Col, Tooltip } from 'antd';
import { BellOutlined, PlusOutlined, RiseOutlined, DollarOutlined, EyeOutlined, UserOutlined, PlayCircleOutlined, ClockCircleOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

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
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* Header with Notification */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '28px' }}>Дашборд</Title>
          <Badge dot style={{ boxShadow: '0 0 0 4px #fff' }}>
            <Button type="text" shape="circle" icon={<BellOutlined style={{ fontSize: '20px' }} />} />
          </Badge>
        </div>

        {/* Balance Cards with 5-day Freeze */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Card>
            <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Доступно</Text>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#1677ff' }}>234.50</div>
            <Text type="secondary" style={{ fontSize: '14px' }}>USDT</Text>
          </Card>
          <Card>
            <Tooltip title="Заработанные средства замораживаются на 5 дней">
              <div>
                <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>
                  Заморожено <ClockCircleOutlined style={{ fontSize: '12px', marginLeft: '4px' }} />
                </Text>
                <div style={{ fontSize: '28px', fontWeight: 700, color: '#faad14' }}>156.80</div>
                <Text type="secondary" style={{ fontSize: '14px' }}>USDT</Text>
              </div>
            </Tooltip>
          </Card>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Button 
            type="primary" 
            icon={<ArrowUpOutlined />} 
            size="large" 
            block
            style={{ fontWeight: 600, height: '48px' }}
          >
            Пополнить
          </Button>
          <Button 
            icon={<ArrowDownOutlined />} 
            size="large" 
            block
            style={{ fontWeight: 600, height: '48px' }}
          >
            Вывести
          </Button>
        </div>

        {/* 5-Day Freeze Info */}
        <Card style={{ background: 'rgba(250, 173, 20, 0.05)', borderColor: '#faad14' }}>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ClockCircleOutlined style={{ fontSize: '20px', color: '#faad14' }} />
              <Text strong style={{ fontSize: '15px' }}>Замороженные заработки</Text>
            </div>
            <div style={{ paddingLeft: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>Разморозка через 1 день:</Text>
                <Text strong style={{ fontSize: '14px' }}>45.20 USDT</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>Разморозка через 3 дня:</Text>
                <Text strong style={{ fontSize: '14px' }}>67.80 USDT</Text>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Text type="secondary" style={{ fontSize: '14px' }}>Разморозка через 5 дней:</Text>
                <Text strong style={{ fontSize: '14px' }}>43.80 USDT</Text>
              </div>
            </div>
            <Text type="secondary" style={{ fontSize: '13px', paddingLeft: '28px' }}>
              💡 Все заработанные средства замораживаются на 5 дней для защиты от мошенничества
            </Text>
          </Space>
        </Card>

        {/* Quick Stats */}
        <Row gutter={12}>
          <Col span={12}>
            <Card>
              <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Доход за месяц</Text>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#52c41a' }}>+391.30</div>
              <Text type="secondary" style={{ fontSize: '14px' }}>USDT</Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Подписчики</Text>
              <div style={{ fontSize: '28px', fontWeight: 700 }}>74.1K</div>
              <Text style={{ fontSize: '14px', color: '#52c41a' }}>+2.3K</Text>
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
