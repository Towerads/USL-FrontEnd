"use client"

import { Card, Button, Typography, Space, Input, Tag, Badge } from 'antd';
import { SearchOutlined, StarOutlined, EyeOutlined, TeamOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;

export function ChannelsCatalogScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const channels = [
    {
      id: 1,
      name: "Крипто Новости",
      username: "@cryptonews_daily",
      subscribers: 125000,
      category: "Криптовалюты",
      cpm: 15,
      engagement: 8.5,
      verified: true,
      description: "Ежедневные новости из мира криптовалют и блокчейна"
    },
    {
      id: 2,
      name: "Tech Review",
      username: "@tech_review_ru",
      subscribers: 89000,
      category: "Технологии",
      cpm: 12,
      engagement: 6.2,
      verified: true,
      description: "Обзоры гаджетов и новых технологий"
    },
    {
      id: 3,
      name: "Бизнес Идеи",
      username: "@business_ideas",
      subscribers: 56000,
      category: "Бизнес",
      cpm: 18,
      engagement: 9.1,
      verified: false,
      description: "Идеи для стартапов и малого бизнеса"
    },
    {
      id: 4,
      name: "Инвестиции 2025",
      username: "@invest_2025",
      subscribers: 203000,
      category: "Финансы",
      cpm: 25,
      engagement: 7.8,
      verified: true,
      description: "Инвестиционные стратегии и аналитика рынков"
    },
  ];

  const categories = ["Все", "Криптовалюты", "Технологии", "Бизнес", "Финансы", "Образование"];

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px' }}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* Header */}
        <div>
          <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '28px' }}>
            Каталог каналов
          </Title>
          <Text type="secondary" style={{ fontSize: '15px' }}>
            Выберите каналы для размещения рекламы
          </Text>
        </div>

        {/* Coming Soon Banner */}
        <Card style={{ background: 'linear-gradient(135deg, rgba(22, 119, 255, 0.1) 0%, rgba(64, 150, 255, 0.05) 100%)', border: '1px solid #1677ff' }}>
          <Space direction="vertical" size={12} style={{ width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '48px' }}>🚀</div>
            <Title level={4} style={{ margin: 0, color: '#1677ff' }}>
              Скоро запуск!
            </Title>
            <Text type="secondary">
              Каталог каналов находится в разработке. Здесь вы сможете выбирать каналы для размещения рекламы, фильтровать по категориям и просматривать статистику.
            </Text>
          </Space>
        </Card>

        {/* Search (Disabled Preview) */}
        <Input
          size="large"
          placeholder="Поиск каналов..."
          prefix={<SearchOutlined />}
          disabled
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* Categories (Preview) */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', opacity: 0.5 }}>
          {categories.map((cat) => (
            <Tag key={cat} style={{ padding: '4px 12px', fontSize: '14px', cursor: 'not-allowed' }}>
              {cat}
            </Tag>
          ))}
        </div>

        {/* Preview Channels */}
        <div>
          <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '12px' }}>
            Предварительный просмотр функционала:
          </Text>
          <Space direction="vertical" size={12} style={{ width: '100%' }}>
            {channels.map((channel) => (
              <Card key={channel.id} hoverable style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Title level={5} style={{ margin: 0, fontWeight: 700, fontSize: '16px' }}>
                          {channel.name}
                        </Title>
                        {channel.verified && (
                          <CheckCircleOutlined style={{ color: '#1677ff', fontSize: '16px' }} />
                        )}
                      </div>
                      <Text type="secondary" style={{ fontSize: '14px' }}>{channel.username}</Text>
                    </div>
                    <Tag color="blue">{channel.category}</Tag>
                  </div>

                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    {channel.description}
                  </Text>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', paddingTop: '8px', borderTop: '1px solid #f0f0f0' }}>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                        <TeamOutlined style={{ marginRight: '4px' }} />
                        Подписчики
                      </Text>
                      <Text strong style={{ fontSize: '14px' }}>{channel.subscribers.toLocaleString()}</Text>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                        <EyeOutlined style={{ marginRight: '4px' }} />
                        CPM
                      </Text>
                      <Text strong style={{ fontSize: '14px', color: '#52c41a' }}>${channel.cpm}</Text>
                    </div>
                    <div>
                      <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                        <StarOutlined style={{ marginRight: '4px' }} />
                        ER
                      </Text>
                      <Text strong style={{ fontSize: '14px' }}>{channel.engagement}%</Text>
                    </div>
                  </div>

                  <Button type="primary" block disabled>
                    Добавить в кампанию
                  </Button>
                </Space>
              </Card>
            ))}
          </Space>
        </div>

        {/* Info Card */}
        <Card style={{ background: '#f5f5f5' }}>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Text strong>📋 Что будет доступно:</Text>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li><Text type="secondary">Поиск и фильтрация каналов по категориям</Text></li>
              <li><Text type="secondary">Детальная статистика каждого канала</Text></li>
              <li><Text type="secondary">Прямое добавление в рекламные кампании</Text></li>
              <li><Text type="secondary">Рейтинги и отзывы рекламодателей</Text></li>
              <li><Text type="secondary">Автоматический расчет стоимости размещения</Text></li>
            </ul>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
