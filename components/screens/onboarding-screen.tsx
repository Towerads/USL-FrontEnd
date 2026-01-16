"use client"

import { Card, Button, Typography, Space } from 'antd';
import { UserOutlined, RocketOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

export function OnboardingScreen() {
  const router = useRouter();

  const handleSelectUserType = (type: 'advertiser' | 'publisher') => {
    // Сохраняем выбор пользователя в localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('userType', type);
      // Перенаправляем на соответствующую страницу
      if (type === 'advertiser') {
        router.push('/advertiser');
      } else {
        router.push('/publisher');
      }
    }
  };

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '600px', 
      margin: '0 auto',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Space direction="vertical" size={32} style={{ width: '100%' }}>
        {/* Logo and Welcome */}
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, #1677ff 0%, #4096ff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(22, 119, 255, 0.3)'
          }}>
            <RocketOutlined style={{ fontSize: '40px', color: '#fff' }} />
          </div>
          <Title level={1} style={{ margin: 0, fontWeight: 800, fontSize: '32px', marginBottom: '12px' }}>
            Добро пожаловать в USL
          </Title>
          <Text type="secondary" style={{ fontSize: '16px', display: 'block' }}>
            Выберите, как вы хотите использовать платформу
          </Text>
        </div>

        {/* User Type Selection */}
        <Space direction="vertical" size={16} style={{ width: '100%' }}>
          {/* Advertiser Card */}
          <Card 
            hoverable
            onClick={() => handleSelectUserType('advertiser')}
            style={{ 
              cursor: 'pointer',
              border: '2px solid #E6E6E6',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1677ff';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(22, 119, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E6E6E6';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'rgba(22, 119, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <RocketOutlined style={{ fontSize: '28px', color: '#1677ff' }} />
              </div>
              <div style={{ flex: 1 }}>
                <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: '20px', marginBottom: '4px' }}>
                  Рекламодатель
                </Title>
                <Text type="secondary" style={{ fontSize: '15px' }}>
                  Создавайте и управляйте рекламными кампаниями
                </Text>
              </div>
            </div>
          </Card>

          {/* Publisher Card */}
          <Card 
            hoverable
            onClick={() => handleSelectUserType('publisher')}
            style={{ 
              cursor: 'pointer',
              border: '2px solid #E6E6E6',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1677ff';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(22, 119, 255, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E6E6E6';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '14px',
                background: 'rgba(82, 196, 26, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <UserOutlined style={{ fontSize: '28px', color: '#52c41a' }} />
              </div>
              <div style={{ flex: 1 }}>
                <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: '20px', marginBottom: '4px' }}>
                  Паблишер
                </Title>
                <Text type="secondary" style={{ fontSize: '15px' }}>
                  Размещайте рекламу и зарабатывайте на показах
                </Text>
              </div>
            </div>
          </Card>
        </Space>

        {/* Info Text */}
        <div style={{ textAlign: 'center', paddingTop: '16px' }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            Вы сможете изменить тип аккаунта позже в настройках
          </Text>
        </div>
      </Space>
    </div>
  );
}
