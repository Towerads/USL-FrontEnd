"use client"

import { Card, Button, Badge, Space, Typography, Statistic, Progress, Row, Col, Tabs } from 'antd';
import { BellOutlined, PlusOutlined, RiseOutlined, EyeOutlined, AimOutlined, DollarOutlined, ArrowUpOutlined, ArrowDownOutlined, ClockCircleOutlined, CheckCircleOutlined, PauseCircleOutlined, EditOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;

export function AdvertiserDashboard() {
  const [activeTab, setActiveTab] = useState('active');

  const campaigns = {
    active: [
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
        name: "Летняя распродажа",
        status: "active",
        budget: "800",
        spent: "450",
        impressions: 62100,
        clicks: 1890,
        ctr: "3.04",
      },
    ],
    pending: [
      {
        id: 3,
        name: "Новый продукт 2025",
        status: "pending",
        budget: "600",
        spent: "0",
        moderationNote: "На модерации",
      },
    ],
    paused: [
      {
        id: 4,
        name: "Новогодняя распродажа",
        status: "paused",
        budget: "1000",
        spent: "680",
        impressions: 89450,
        clicks: 2876,
        ctr: "3.22",
      },
    ],
    draft: [
      {
        id: 5,
        name: "Черновик кампании",
        status: "draft",
        budget: "300",
        spent: "0",
      },
    ],
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge status="success" text="Активна" />;
      case "pending":
        return <Badge status="processing" text="На модерации" />;
      case "paused":
        return <Badge status="warning" text="На паузе" />;
      case "draft":
        return <Badge status="default" text="Черновик" />;
      default:
        return null;
    }
  }

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

        {/* Balance Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Card>
            <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Доступно</Text>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#1677ff' }}>1,234.56</div>
            <Text type="secondary" style={{ fontSize: '14px' }}>USDT</Text>
          </Card>
          <Card>
            <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Заморожено</Text>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#faad14' }}>320.00</div>
            <Text type="secondary" style={{ fontSize: '14px' }}>USDT</Text>
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

        {/* Campaigns with Tabs */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: '20px' }}>Кампании</Title>
            <Button type="primary" icon={<PlusOutlined />} size="large" href="/campaign/create">
              Создать
            </Button>
          </div>

          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              { key: 'active', label: `Активные (${campaigns.active.length})` },
              { key: 'pending', label: `На модерации (${campaigns.pending.length})` },
              { key: 'paused', label: `На паузе (${campaigns.paused.length})` },
              { key: 'draft', label: `Черновики (${campaigns.draft.length})` },
            ]}
          />

          <Space direction="vertical" size={10} style={{ width: '100%', marginTop: '16px' }}>
            {campaigns[activeTab as keyof typeof campaigns].map((campaign: any) => (
              <Card key={campaign.id} hoverable>
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <Title level={5} style={{ margin: 0, fontWeight: 700, fontSize: '16px' }}>{campaign.name}</Title>
                      <Text type="secondary" style={{ fontSize: '14px' }}>ID: #{campaign.id}</Text>
                    </div>
                    {getStatusBadge(campaign.status)}
                  </div>

                  {campaign.status === 'pending' && campaign.moderationNote && (
                    <div style={{ padding: '12px', background: 'rgba(22, 119, 255, 0.05)', borderRadius: '8px' }}>
                      <Text type="secondary" style={{ fontSize: '14px' }}>
                        <ClockCircleOutlined style={{ marginRight: '8px' }} />
                        {campaign.moderationNote}
                      </Text>
                    </div>
                  )}

                  {campaign.status !== 'draft' && (
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text type="secondary" style={{ fontSize: '14px' }}>Бюджет</Text>
                        <Text strong style={{ fontSize: '14px' }}>
                          {campaign.spent} / {campaign.budget} USDT
                        </Text>
                      </div>
                      {campaign.status !== 'pending' && (
                        <Progress 
                          percent={(Number.parseFloat(campaign.spent) / Number.parseFloat(campaign.budget)) * 100} 
                          showInfo={false}
                          strokeColor="#1677ff"
                        />
                      )}
                    </Space>
                  )}

                  {(campaign.status === 'active' || campaign.status === 'paused') && campaign.impressions && (
                    <Row gutter={8} style={{ paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
                      <Col span={8}>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Показы</Text>
                        <Text strong style={{ fontSize: '16px' }}>{campaign.impressions.toLocaleString()}</Text>
                      </Col>
                      <Col span={8}>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Клики</Text>
                        <Text strong style={{ fontSize: '16px' }}>{campaign.clicks}</Text>
                      </Col>
                      <Col span={8}>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>CTR</Text>
                        <Text strong style={{ fontSize: '16px', color: '#52c41a' }}>{campaign.ctr}%</Text>
                      </Col>
                    </Row>
                  )}

                  {campaign.status === 'draft' && (
                    <Button type="primary" icon={<EditOutlined />} block>
                      Продолжить редактирование
                    </Button>
                  )}
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
