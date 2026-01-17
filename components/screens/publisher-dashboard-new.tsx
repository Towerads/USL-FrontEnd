"use client"

import { Card, Button, Typography, Space, Row, Col, message } from 'antd';
import { EyeOutlined, DollarOutlined, RiseOutlined, CopyOutlined, CustomerServiceOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

export function PublisherDashboardNew() {
  const router = useRouter();

  const handleCopySDK = () => {
    const sdkScript = `<!-- TOWER Ads SDK v3.0 - Secure -->
<script src="https://cdn.usl.app/sdk/v3/tower-ads.js"></script>
<script>
  const ads = new TowerAds({
    appId: 'YOUR_APP_ID',  // Получите в личном кабинете
    
    // Callbacks
    onAdLoaded: (network) => {
      console.log('Реклама загружена из:', network);
    },
    onRewardEarned: (reward) => {
      // Начислите награду пользователю
      console.log('Награда:', reward);
    }
  });
  
  // Показать рекламу
  document.getElementById('show-ad-btn').onclick = () => {
    ads.show('main_banner');
  };
</script>`;
    navigator.clipboard.writeText(sdkScript);
    message.success('SDK скрипт скопирован в буфер обмена');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px' }}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* Header */}
        <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '28px' }}>
          Дашборд
        </Title>

        {/* Stats Panel */}
        <Card>
          <Title level={5} style={{ marginBottom: '16px', fontWeight: 700, fontSize: '16px' }}>Статистика за сегодня</Title>
          <Row gutter={16}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Space size="small">
                  <EyeOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>Показы</Text>
                </Space>
                <Text strong style={{ fontSize: '18px' }}>12.4K</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Space size="small">
                  <DollarOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>Доход</Text>
                </Space>
                <Text strong style={{ fontSize: '18px', color: '#52c41a' }}>+$13.02</Text>
              </Space>
            </Col>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Space size="small">
                  <RiseOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                  <Text type="secondary" style={{ fontSize: '12px' }}>CPM</Text>
                </Space>
                <Text strong style={{ fontSize: '18px', color: '#1677ff' }}>$1.05</Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* SDK Integration Info */}
        <Card>
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <div>
              <Title level={5} style={{ margin: 0, marginBottom: '8px', fontWeight: 700, fontSize: '16px' }}>
                Монетизация Telegram Mini App
              </Title>
              <Paragraph type="secondary" style={{ margin: 0, fontSize: '14px' }}>
                Вы можете монетизировать своё приложение в Телеграм установив наш рекламный SDK.
              </Paragraph>
            </div>

            <div>
              <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                Отправьте скрипт своему разработчику:
              </Text>
              <Card 
                size="small" 
                style={{ 
                  background: '#f5f5f5', 
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  overflow: 'auto'
                }}
              >
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
{`<!-- TOWER Ads SDK v3.0 - Secure -->
<script src="https://cdn.usl.app/sdk/v3/tower-ads.js"></script>
<script>
  const ads = new TowerAds({
    appId: 'YOUR_APP_ID',
    onRewardEarned: (reward) => {
      // Начислите награду пользователю
      console.log('Награда:', reward);
    }
  });
  
  // Показать рекламу
  ads.show('main_banner');
</script>`}
                </pre>
              </Card>
              <Button 
                type="primary" 
                icon={<CopyOutlined />} 
                onClick={handleCopySDK}
                block
                style={{ marginTop: '12px' }}
              >
                Скопировать скрипт
              </Button>
            </div>
          </Space>
        </Card>

        {/* Current CPM Info */}
        <Card style={{ background: 'rgba(22, 119, 255, 0.05)' }}>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Text strong style={{ fontSize: '15px' }}>Текущий средний CPM показов</Text>
            <Title level={2} style={{ margin: 0, color: '#1677ff' }}>$1.05</Title>
            <Text type="secondary" style={{ fontSize: '13px' }}>
              Средняя стоимость за 1000 показов в вашем приложении
            </Text>
            <Button type="link" size="small" style={{ padding: 0, height: 'auto' }}>
              Документация по интеграции →
            </Button>
          </Space>
        </Card>

        {/* Support Button */}
        <Button
          size="large"
          block
          icon={<CustomerServiceOutlined />}
          onClick={() => router.push('/support-chat')}
          style={{ height: '48px', fontWeight: 600 }}
        >
          Связаться с поддержкой
        </Button>
      </Space>
    </div>
  );
}
