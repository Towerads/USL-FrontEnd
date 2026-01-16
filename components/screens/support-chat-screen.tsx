"use client"

import { Card, Button, Typography, Space, Select, Input, Badge } from 'antd';
import { SendOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;
const { TextArea } = Input;

export function SupportChatScreen() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: number, text: string, from: 'user' | 'support', time: string}>>([]);

  const topics = [
    { value: 'balance', label: 'Вопросы по балансу' },
    { value: 'campaign', label: 'Рекламные кампании' },
    { value: 'moderation', label: 'Модерация креативов' },
    { value: 'payment', label: 'Пополнение и вывод' },
    { value: 'technical', label: 'Технические проблемы' },
    { value: 'other', label: 'Другое' },
  ];

  const handleTopicSelect = (value: string) => {
    setSelectedTopic(value);
    const newTicketId = `#TKT-${Math.floor(Math.random() * 10000)}`;
    setTicketId(newTicketId);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: messages.length + 1,
      text: message,
      from: 'user' as const,
      time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
  };

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
          <div style={{ flex: 1 }}>
            <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '24px' }}>Поддержка</Title>
            {ticketId && (
              <Text type="secondary" style={{ fontSize: '14px' }}>Тикет: {ticketId}</Text>
            )}
          </div>
        </div>

        {/* Topic Selection */}
        {!selectedTopic ? (
          <Card>
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              <div>
                <Title level={4} style={{ margin: 0, fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>
                  Выберите тему обращения
                </Title>
                <Text type="secondary" style={{ fontSize: '14px' }}>
                  Это поможет нам быстрее решить ваш вопрос
                </Text>
              </div>
              
              <Select
                size="large"
                placeholder="Выберите тему"
                style={{ width: '100%' }}
                onChange={handleTopicSelect}
                options={topics}
              />
            </Space>
          </Card>
        ) : (
          <>
            {/* Topic Info */}
            <Card style={{ background: 'rgba(22, 119, 255, 0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Text strong style={{ fontSize: '15px', display: 'block' }}>
                    {topics.find(t => t.value === selectedTopic)?.label}
                  </Text>
                  <Text type="secondary" style={{ fontSize: '13px' }}>
                    ID: {ticketId}
                  </Text>
                </div>
                <Badge status="processing" text="Активен" />
              </div>
            </Card>

            {/* Chat Messages */}
            <Card>
              <Space direction="vertical" size={16} style={{ width: '100%', minHeight: '300px' }}>
                {messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      Напишите ваш вопрос, и мы ответим в ближайшее время
                    </Text>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div 
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          maxWidth: '75%',
                          padding: '12px 16px',
                          borderRadius: '12px',
                          background: msg.from === 'user' ? '#1677ff' : '#f5f5f5',
                          color: msg.from === 'user' ? '#fff' : '#000'
                        }}
                      >
                        <Text style={{ color: msg.from === 'user' ? '#fff' : '#000', fontSize: '15px' }}>
                          {msg.text}
                        </Text>
                        <div style={{ marginTop: '4px' }}>
                          <Text 
                            style={{ 
                              fontSize: '12px', 
                              color: msg.from === 'user' ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.45)' 
                            }}
                          >
                            {msg.time}
                          </Text>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </Space>
            </Card>

            {/* Message Input */}
            <Card>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                <TextArea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Напишите ваше сообщение..."
                  autoSize={{ minRows: 3, maxRows: 6 }}
                  style={{ fontSize: '15px' }}
                />
                <Button
                  type="primary"
                  size="large"
                  block
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  style={{ fontWeight: 600, height: '48px' }}
                >
                  Отправить
                </Button>
              </Space>
            </Card>

            {/* Info */}
            <Card style={{ background: '#f5f5f5' }}>
              <Text type="secondary" style={{ fontSize: '13px' }}>
                💡 Среднее время ответа: 15-30 минут. Вы получите уведомление, когда поддержка ответит на ваше сообщение.
              </Text>
            </Card>
          </>
        )}
      </Space>
    </div>
  );
}
