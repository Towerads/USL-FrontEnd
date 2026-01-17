"use client"

import { Card, Button, Typography, Space, Tabs, Badge, Row, Col } from 'antd';
import { PlusOutlined, ShoppingOutlined, EyeOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export function CreativesNewScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('active');

  const creatives = {
    active: [
      {
        id: 1,
        title: "Новогодняя распродажа",
        type: "Видео",
        views: 45230,
        likes: 1234,
        comments: 89,
        status: "active",
      },
      {
        id: 2,
        title: "Промо акция зима",
        type: "Баннер",
        views: 32100,
        likes: 890,
        comments: 45,
        status: "active",
      },
    ],
    pending: [
      {
        id: 3,
        title: "Весенняя коллекция",
        type: "Видео",
        status: "pending",
        moderationNote: "На проверке модератором",
      },
    ],
    completed: [
      {
        id: 4,
        title: "Черная пятница 2024",
        type: "Баннер",
        views: 156000,
        likes: 4200,
        comments: 320,
        status: "completed",
      },
    ],
    drafts: [
      {
        id: 5,
        title: "Летняя распродажа",
        type: "Баннер",
        status: "draft",
      },
    ],
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge status="success" text="В работе" />;
      case "pending":
        return <Badge status="processing" text="На проверке" />;
      case "completed":
        return <Badge status="default" text="Завершен" />;
      case "draft":
        return <Badge status="warning" text="Черновик" />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px' }}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* Header */}
        <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '28px' }}>
          Креативы
        </Title>

        {/* Stats Panel */}
        <Card>
          <Title level={5} style={{ marginBottom: '16px', fontWeight: 700, fontSize: '16px' }}>Общая статистика</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Всего</Text>
                <Text strong style={{ fontSize: '18px' }}>8</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Активных</Text>
                <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>2</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Text type="secondary" style={{ fontSize: '12px' }}>Просмотры</Text>
                <Text strong style={{ fontSize: '18px' }}>233K</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            size="large" 
            block
            onClick={() => router.push('/campaign/create')}
            style={{ fontWeight: 600, height: '48px' }}
          >
            Создать креатив
          </Button>
          <Button 
            icon={<ShoppingOutlined />} 
            size="large" 
            block
            onClick={() => router.push('/campaign/create')}
            style={{ fontWeight: 600, height: '48px' }}
          >
            Заказать креатив
          </Button>
        </div>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'active', label: `В работе (${creatives.active.length})` },
            { key: 'pending', label: `На проверке (${creatives.pending.length})` },
            { key: 'completed', label: `Завершенные (${creatives.completed.length})` },
            { key: 'drafts', label: `Черновики (${creatives.drafts.length})` },
          ]}
        />

        {/* Creatives List */}
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          {creatives[activeTab as keyof typeof creatives].map((creative: any) => (
            <Card key={creative.id} hoverable>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <Title level={5} style={{ margin: 0, fontWeight: 700, fontSize: '16px' }}>
                      {creative.title}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>{creative.type}</Text>
                  </div>
                  {getStatusBadge(creative.status)}
                </div>

                {creative.status === 'pending' && creative.moderationNote && (
                  <div style={{ padding: '12px', background: 'rgba(22, 119, 255, 0.05)', borderRadius: '8px' }}>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      {creative.moderationNote}
                    </Text>
                  </div>
                )}

                {(creative.status === 'active' || creative.status === 'completed') && creative.views && (
                  <div style={{ display: 'flex', gap: '16px', paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
                    <Space size={4}>
                      <EyeOutlined style={{ color: 'var(--color-text-secondary)' }} />
                      <Text type="secondary" style={{ fontSize: '13px' }}>{creative.views.toLocaleString()}</Text>
                    </Space>
                    <Space size={4}>
                      <LikeOutlined style={{ color: 'var(--color-text-secondary)' }} />
                      <Text type="secondary" style={{ fontSize: '13px' }}>{creative.likes.toLocaleString()}</Text>
                    </Space>
                    <Space size={4}>
                      <MessageOutlined style={{ color: 'var(--color-text-secondary)' }} />
                      <Text type="secondary" style={{ fontSize: '13px' }}>{creative.comments}</Text>
                    </Space>
                  </div>
                )}

                {creative.status === 'draft' && (
                  <Button type="primary" block>
                    Продолжить редактирование
                  </Button>
                )}
              </Space>
            </Card>
          ))}
        </Space>
      </Space>
    </div>
  );
}
