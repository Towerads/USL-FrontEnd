"use client"

import { Card, Button, Typography, Space, Switch, List, Tag, Input } from 'antd';
import { ArrowLeftOutlined, CheckCircleOutlined, BellOutlined, SendOutlined, LinkOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const { Title, Text, Paragraph } = Typography;

export function TelegramIntegrationScreen() {
  const router = useRouter();
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState({
    campaignApproved: true,
    campaignRejected: true,
    balanceChange: true,
    newMessage: true,
    dailyReport: false,
  });

  const handleConnect = () => {
    // Mock connection
    setIsConnected(true);
  };

  const notificationTypes = [
    {
      key: 'campaignApproved',
      title: 'Одобрение кампании',
      description: 'Когда ваша кампания прошла модерацию',
    },
    {
      key: 'campaignRejected',
      title: 'Отклонение кампании',
      description: 'Когда кампания отклонена модератором',
    },
    {
      key: 'balanceChange',
      title: 'Изменение баланса',
      description: 'Пополнения, выводы и списания',
    },
    {
      key: 'newMessage',
      title: 'Новые сообщения',
      description: 'Ответы от поддержки и уведомления',
    },
    {
      key: 'dailyReport',
      title: 'Ежедневный отчет',
      description: 'Статистика за день в 20:00',
    },
  ];

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
            Telegram уведомления
          </Title>
        </div>

        {/* Connection Status */}
        {!isConnected ? (
          <Card style={{ background: 'linear-gradient(135deg, rgba(22, 119, 255, 0.1) 0%, rgba(64, 150, 255, 0.05) 100%)' }}>
            <Space direction="vertical" size={16} style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ fontSize: '64px' }}>📱</div>
              <div>
                <Title level={4} style={{ margin: 0, marginBottom: '8px' }}>
                  Подключите Telegram
                </Title>
                <Paragraph type="secondary" style={{ marginBottom: 0 }}>
                  Получайте мгновенные уведомления о важных событиях прямо в Telegram
                </Paragraph>
              </div>
              <Button 
                type="primary" 
                size="large" 
                icon={<SendOutlined />}
                onClick={handleConnect}
                block
              >
                Подключить Telegram Bot
              </Button>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                Нажмите кнопку и следуйте инструкциям в Telegram
              </Text>
            </Space>
          </Card>
        ) : (
          <Card style={{ background: 'rgba(82, 196, 26, 0.05)', borderColor: '#52c41a' }}>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <CheckCircleOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                <div style={{ flex: 1 }}>
                  <Text strong style={{ fontSize: '16px', display: 'block' }}>
                    Telegram подключен
                  </Text>
                  <Text type="secondary" style={{ fontSize: '14px' }}>
                    @username
                  </Text>
                </div>
                <Tag color="success">Активно</Tag>
              </div>
              <Button 
                type="text" 
                danger 
                size="small"
                onClick={() => setIsConnected(false)}
              >
                Отключить
              </Button>
            </Space>
          </Card>
        )}

        {/* Instructions */}
        {!isConnected && (
          <Card>
            <Space direction="vertical" size={12} style={{ width: '100%' }}>
              <Text strong style={{ fontSize: '16px' }}>Как подключить:</Text>
              <ol style={{ margin: 0, paddingLeft: '20px' }}>
                <li><Text type="secondary">Нажмите кнопку "Подключить Telegram Bot"</Text></li>
                <li><Text type="secondary">Откроется Telegram с нашим ботом @USL_Notify_Bot</Text></li>
                <li><Text type="secondary">Нажмите "Start" в боте</Text></li>
                <li><Text type="secondary">Введите код подтверждения из бота здесь</Text></li>
              </ol>
              <Input 
                size="large"
                placeholder="Введите код из Telegram"
                disabled
                style={{ marginTop: '12px' }}
              />
            </Space>
          </Card>
        )}

        {/* Notification Settings */}
        {isConnected && (
          <>
            <div>
              <Title level={4} style={{ margin: 0, marginBottom: '16px', fontWeight: 700, fontSize: '18px' }}>
                Настройки уведомлений
              </Title>
              <Card>
                <List
                  dataSource={notificationTypes}
                  renderItem={(item) => (
                    <List.Item
                      extra={
                        <Switch
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(checked) => 
                            setNotifications({ ...notifications, [item.key]: checked })
                          }
                        />
                      }
                    >
                      <List.Item.Meta
                        title={<Text strong>{item.title}</Text>}
                        description={<Text type="secondary" style={{ fontSize: '13px' }}>{item.description}</Text>}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </div>

            {/* Test Notification */}
            <Card>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BellOutlined style={{ fontSize: '18px', color: '#1677ff' }} />
                  <Text strong>Тестовое уведомление</Text>
                </div>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  Отправьте тестовое сообщение, чтобы проверить работу уведомлений
                </Text>
                <Button type="default" icon={<SendOutlined />} block>
                  Отправить тест
                </Button>
              </Space>
            </Card>

            {/* Example Notifications */}
            <Card style={{ background: '#f5f5f5' }}>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <Text strong>Примеры уведомлений:</Text>
                <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #52c41a' }}>
                  <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                    ✅ Кампания одобрена
                  </Text>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Ваша кампания "Новогодняя распродажа" прошла модерацию и запущена!
                  </Text>
                </div>
                <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #1677ff' }}>
                  <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                    💰 Пополнение баланса
                  </Text>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    На ваш баланс зачислено +500 USDT
                  </Text>
                </div>
                <div style={{ background: '#fff', padding: '12px', borderRadius: '8px', borderLeft: '3px solid #faad14' }}>
                  <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                    💬 Новое сообщение
                  </Text>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    Поддержка ответила на ваш запрос #TKT-1234
                  </Text>
                </div>
              </Space>
            </Card>
          </>
        )}

        {/* Info */}
        <Card style={{ background: '#f5f5f5' }}>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            <Text strong>💡 Преимущества:</Text>
            <ul style={{ margin: 0, paddingLeft: '20px' }}>
              <li><Text type="secondary">Мгновенные уведомления о важных событиях</Text></li>
              <li><Text type="secondary">Не пропустите одобрение или отклонение кампании</Text></li>
              <li><Text type="secondary">Контроль баланса в реальном времени</Text></li>
              <li><Text type="secondary">Быстрые ответы от поддержки</Text></li>
            </ul>
          </Space>
        </Card>
      </Space>
    </div>
  );
}
