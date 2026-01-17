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
        <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '28px' }}>
          Каталог каналов
        </Title>

        {/* Coming Soon Banner */}
        <Card style={{ 
          background: 'linear-gradient(135deg, rgba(22, 119, 255, 0.1) 0%, rgba(64, 150, 255, 0.05) 100%)', 
          border: '1px solid #1677ff',
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Space direction="vertical" size={16} style={{ width: '100%', textAlign: 'center' }}>
            <div style={{ fontSize: '64px' }}>🚀</div>
            <Title level={3} style={{ margin: 0, color: '#1677ff' }}>
              Скоро
            </Title>
            <Text type="secondary" style={{ fontSize: '15px' }}>
              Раздел находится в разработке
            </Text>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
