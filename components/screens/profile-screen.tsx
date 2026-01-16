"use client"

import { Card, Button, Avatar, Switch, Space, Typography, Radio } from 'antd';
import { SettingOutlined, UserOutlined, RightOutlined, StarOutlined, FileTextOutlined, SafetyOutlined, QuestionCircleOutlined, BulbOutlined, RocketOutlined, TeamOutlined } from '@ant-design/icons';
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const { Title, Text } = Typography;

export function ProfileScreen() {
  const [isDark, setIsDark] = useState(false)
  const [userType, setUserType] = useState<'advertiser' | 'publisher'>('advertiser')
  const router = useRouter()

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark)
    setIsDark(shouldBeDark)
    document.documentElement.classList.toggle("dark", shouldBeDark)

    // Загружаем тип пользователя
    const savedUserType = localStorage.getItem('userType') as 'advertiser' | 'publisher'
    if (savedUserType) {
      setUserType(savedUserType)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.classList.toggle("dark", newTheme)
    localStorage.setItem("theme", newTheme ? "dark" : "light")
  }

  const handleUserTypeChange = (newType: 'advertiser' | 'publisher') => {
    setUserType(newType)
    localStorage.setItem('userType', newType)
    // Перенаправляем на соответствующий дашборд
    if (newType === 'advertiser') {
      router.push('/advertiser')
    } else {
      router.push('/publisher')
    }
  }

  const menuItems = [
    { icon: StarOutlined, label: "Мои креативы", href: "/creatives" },
    { icon: FileTextOutlined, label: "История операций", href: "/history" },
    { icon: SafetyOutlined, label: "Безопасность", href: "/security" },
    { icon: QuestionCircleOutlined, label: "Поддержка", href: "/support" },
  ]

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* Header */}
        <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '28px', marginBottom: '8px' }}>Профиль</Title>

        {/* User Card */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Avatar size={64} style={{ backgroundColor: '#1677ff', fontSize: '22px', fontWeight: 700, color: '#fff' }}>
              АИ
            </Avatar>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: '18px' }}>Александр Иванов</Title>
              <Text type="secondary" style={{ fontSize: '15px' }}>@alexander_ads</Text>
            </div>
            <Button type="default" icon={<SettingOutlined />} shape="circle" size="large" />
          </div>
        </Card>

        {/* User Type Switcher */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(82, 196, 26, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TeamOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <RocketOutlined style={{ color: '#1677ff' }} />
                      <span style={{ fontWeight: 500 }}>Рекламодатель</span>
                    </div>
                  </Radio>
                  <Radio value="publisher" style={{ width: '100%', padding: '8px', borderRadius: '8px', background: userType === 'publisher' ? 'rgba(22, 119, 255, 0.05)' : 'transparent' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <UserOutlined style={{ color: '#52c41a' }} />
                      <span style={{ fontWeight: 500 }}>Паблишер</span>
                    </div>
                  </Radio>
                </Space>
              </Radio.Group>
            </div>
          </div>
        </Card>

        {/* Theme Toggle */}
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(22, 119, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BulbOutlined style={{ fontSize: '20px', color: '#1677ff' }} />
              </div>
              <div>
                <Text strong style={{ fontWeight: 600, fontSize: '15px' }}>Темная тема</Text>
                <br />
                <Text type="secondary" style={{ fontSize: '14px' }}>Переключение темы оформления</Text>
              </div>
            </div>
            <Switch checked={isDark} onChange={toggleTheme} />
          </div>
        </Card>

        {/* Referral Card */}
        <Card hoverable style={{ background: 'linear-gradient(135deg, rgba(22, 119, 255, 0.1) 0%, rgba(64, 150, 255, 0.05) 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#1677ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserOutlined style={{ fontSize: '20px', color: '#fff' }} />
            </div>
            <div style={{ flex: 1 }}>
              <Text strong style={{ fontWeight: 600, fontSize: '15px' }}>Реферальная программа</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '14px' }}>Приглашено: 12 пользователей</Text>
            </div>
            <RightOutlined style={{ fontSize: '18px', color: 'var(--color-text-secondary)' }} />
          </div>
        </Card>

        {/* Menu Items */}
        <Space direction="vertical" size={10} style={{ width: '100%' }}>
          {menuItems.map((item, index) => {
            const Icon = item.icon
            return (
              <Link key={index} href={item.href} style={{ textDecoration: 'none' }}>
                <Card hoverable style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#F7F7F7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon style={{ fontSize: '20px' }} />
                    </div>
                    <Text strong style={{ flex: 1, fontWeight: 600, fontSize: '15px' }}>{item.label}</Text>
                    <RightOutlined style={{ fontSize: '18px', color: 'var(--color-text-secondary)' }} />
                  </div>
                </Card>
              </Link>
            )
          })}
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
