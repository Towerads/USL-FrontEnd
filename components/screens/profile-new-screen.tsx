"use client"

import { Card, Button, Avatar, Space, Typography, Radio, Divider } from 'antd';
import { UserOutlined, ArrowUpOutlined, ArrowDownOutlined, CustomerServiceOutlined, GiftOutlined, SettingOutlined, RightOutlined, RocketOutlined, TeamOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

const { Title, Text } = Typography;

export function ProfileNewScreen() {
  const [userType, setUserType] = useState<'advertiser' | 'publisher' | null>(null)
  const router = useRouter()

  useEffect(() => {
    const savedUserType = localStorage.getItem('userType') as 'advertiser' | 'publisher' | null
    setUserType(savedUserType)
  }, [])

  const handleUserTypeChange = (value: 'advertiser' | 'publisher') => {
    setUserType(value)
    localStorage.setItem('userType', value)
    // Reload to update bottom nav
    window.location.reload()
  }

  // If no user type selected, show selection screen
  if (!userType) {
    return (
      <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingTop: '60px' }}>
        <Space direction="vertical" size={24} style={{ width: '100%', textAlign: 'center' }}>
          <div>
            <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '28px', marginBottom: '8px' }}>
              Добро пожаловать!
            </Title>
            <Text type="secondary" style={{ fontSize: '15px' }}>
              Выберите тип аккаунта для продолжения
            </Text>
          </div>

          <Card>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <Button
                size="large"
                block
                onClick={() => handleUserTypeChange('advertiser')}
                style={{
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '0 20px',
                  textAlign: 'left',
                }}
              >
                <Space size={16}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    background: 'rgba(22, 119, 255, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <RocketOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <Text strong style={{ fontSize: '16px', display: 'block' }}>Рекламодатель</Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>Размещайте рекламу в каналах</Text>
                  </div>
                </Space>
              </Button>

              <Button
                size="large"
                block
                onClick={() => handleUserTypeChange('publisher')}
                style={{
                  height: '80px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  padding: '0 20px',
                  textAlign: 'left',
                }}
              >
                <Space size={16}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '12px', 
                    background: 'rgba(82, 196, 26, 0.1)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <TeamOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                  </div>
                  <div style={{ textAlign: 'left' }}>
                    <Text strong style={{ fontSize: '16px', display: 'block' }}>Паблишер</Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>Монетизируйте свои каналы</Text>
                  </div>
                </Space>
              </Button>
            </Space>
          </Card>
        </Space>
      </div>
    )
  }

  // Main profile screen
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px' }}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', paddingTop: '20px' }}>
          <Avatar size={80} icon={<UserOutlined />} style={{ marginBottom: '12px' }} />
          <Title level={3} style={{ margin: 0, fontWeight: 700, fontSize: '22px' }}>Иван Иванов</Title>
          <Text type="secondary" style={{ fontSize: '14px' }}>@ivan_ivanov</Text>
        </div>

        {/* Account Type Switcher */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ 
              width: '44px', 
              height: '44px', 
              borderRadius: '12px', 
              background: 'rgba(22, 119, 255, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}>
              {userType === 'advertiser' ? (
                <RocketOutlined style={{ fontSize: '20px', color: '#1677ff' }} />
              ) : (
                <TeamOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
              )}
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ fontWeight: 600, fontSize: '15px', display: 'block', marginBottom: '8px' }}>Тип аккаунта</Text>
              <Radio.Group 
                value={userType} 
                onChange={(e) => handleUserTypeChange(e.target.value)}
                style={{ width: '100%' }}
              >
                <Space direction="vertical" style={{ width: '100%' }} size={8}>
                  <Radio value="advertiser" style={{ width: '100%', padding: '8px', borderRadius: '8px', background: userType === 'advertiser' ? 'rgba(22, 119, 255, 0.05)' : 'transparent' }}>
                    <span style={{ fontWeight: 500 }}>Рекламодатель</span>
                  </Radio>
                  <Radio value="publisher" style={{ width: '100%', padding: '8px', borderRadius: '8px', background: userType === 'publisher' ? 'rgba(22, 119, 255, 0.05)' : 'transparent' }}>
                    <span style={{ fontWeight: 500 }}>Паблишер</span>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>
        </Card>

        {/* Balance Cards */}
        <div>
          <Text strong style={{ fontSize: '16px', display: 'block', marginBottom: '12px' }}>Баланс</Text>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Card>
              <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Доступно</Text>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#1677ff' }}>1,234.56</div>
              <Text type="secondary" style={{ fontSize: '14px' }}>USDT</Text>
            </Card>
            <Card>
              <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Заморожено</Text>
              <div style={{ fontSize: '24px', fontWeight: 700, color: '#faad14' }}>156.80</div>
              <Text type="secondary" style={{ fontSize: '14px' }}>USDT</Text>
            </Card>
          </div>
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

        <Divider style={{ margin: '8px 0' }} />

        {/* Menu Items */}
        <Space direction="vertical" size={12} style={{ width: '100%' }}>
          <Button
            type="text"
            block
            href="/support-chat"
            style={{
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              textAlign: 'left',
            }}
          >
            <Space>
              <CustomerServiceOutlined style={{ fontSize: '20px' }} />
              <Text strong style={{ fontSize: '15px' }}>Поддержка</Text>
            </Space>
            <RightOutlined style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }} />
          </Button>

          <Button
            type="text"
            block
            style={{
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              textAlign: 'left',
            }}
          >
            <Space>
              <GiftOutlined style={{ fontSize: '20px' }} />
              <Text strong style={{ fontSize: '15px' }}>Реферальная программа</Text>
            </Space>
            <RightOutlined style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }} />
          </Button>

          <Button
            type="text"
            block
            href="/settings"
            style={{
              height: '56px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 16px',
              textAlign: 'left',
            }}
          >
            <Space>
              <SettingOutlined style={{ fontSize: '20px' }} />
              <Text strong style={{ fontSize: '15px' }}>Настройки</Text>
            </Space>
            <RightOutlined style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }} />
          </Button>
        </Space>

        {/* App Info */}
        <div style={{ textAlign: 'center', paddingTop: '20px', paddingBottom: '8px' }}>
          <Text type="secondary" style={{ fontSize: '13px', display: 'block' }}>USL версия 1.0.0</Text>
          <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginTop: '4px' }}>© 2025 UP Stream Lab</Text>
        </div>
      </Space>
    </div>
  )
}
