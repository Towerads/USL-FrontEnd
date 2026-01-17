"use client"

import { Card, Button, Typography, Space, Switch, Divider } from 'antd';
import { BulbOutlined, SafetyOutlined, BellOutlined, RightOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export function SettingsScreen() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px' }}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Button 
            type="text" 
            shape="circle" 
            icon={<ArrowLeftOutlined />} 
            onClick={() => router.back()}
          />
          <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '24px' }}>
            Настройки
          </Title>
        </div>

        {/* Theme Toggle */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                background: 'rgba(22, 119, 255, 0.1)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                <BulbOutlined style={{ fontSize: '20px', color: '#1677ff' }} />
              </div>
              <div>
                <Text strong style={{ fontWeight: 600, fontSize: '15px' }}>Темная тема</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '14px' }}>Переключение темы оформления</Text>
              </div>
            </div>
            <Switch 
              checked={isDark} 
              onChange={setIsDark}
            />
          </div>
        </Card>

        <Divider style={{ margin: '8px 0' }} />

        {/* Security */}
        <Button
          type="text"
          block
          href="/security"
          style={{
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            textAlign: 'left',
          }}
        >
          <Space>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              background: 'rgba(82, 196, 26, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <SafetyOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
            </div>
            <div>
              <Text strong style={{ fontSize: '15px', display: 'block' }}>Безопасность</Text>
              <Text type="secondary" style={{ fontSize: '13px' }}>Пароль, 2FA, активные сессии</Text>
            </div>
          </Space>
          <RightOutlined style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }} />
        </Button>

        {/* Notifications */}
        <Button
          type="text"
          block
          href="/telegram-integration"
          style={{
            height: '72px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            textAlign: 'left',
          }}
        >
          <Space>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              background: 'rgba(250, 173, 20, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              <BellOutlined style={{ fontSize: '20px', color: '#faad14' }} />
            </div>
            <div>
              <Text strong style={{ fontSize: '15px', display: 'block' }}>Уведомления в бот</Text>
              <Text type="secondary" style={{ fontSize: '13px' }}>Настройка Telegram уведомлений</Text>
            </div>
          </Space>
          <RightOutlined style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }} />
        </Button>

        <Divider style={{ margin: '8px 0' }} />

        {/* Info */}
        <Card style={{ background: '#f5f5f5' }}>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Text strong>О приложении</Text>
            <Text type="secondary" style={{ fontSize: '13px' }}>Версия: 1.0.0</Text>
            <Text type="secondary" style={{ fontSize: '13px' }}>© 2025 UP Stream Lab</Text>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
