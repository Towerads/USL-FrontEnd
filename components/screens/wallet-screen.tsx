"use client"

import { Card, Button, Typography, Space, Badge, Statistic } from 'antd';
import { BellOutlined, ArrowUpOutlined, ArrowDownOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export function WalletScreen() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px' }}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* Balance Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <Card>
            <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Доступно</Text>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#1677ff' }}>1,234.56</div>
            <Text type="secondary" style={{ fontSize: '14px' }}>USDT</Text>
          </Card>
          <Card>
            <Text type="secondary" style={{ fontSize: '13px', display: 'block', marginBottom: '8px' }}>Заморожено</Text>
            <div style={{ fontSize: '28px', fontWeight: 700, color: '#faad14' }}>156.80</div>
            <Text type="secondary" style={{ fontSize: '14px' }}>USDT</Text>
          </Card>
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

        {/* Recent Transactions */}
        <div>
          <Title level={4} style={{ marginBottom: '16px', fontWeight: 700, fontSize: '20px' }}>Последние операции</Title>
          <Space direction="vertical" size={10} style={{ width: '100%' }}>
            {[
              {
                id: 1,
                type: "out",
                amount: "50.00",
                status: "completed",
                title: "Размещение рекламы",
                date: "15 янв, 14:32",
              },
              {
                id: 2,
                type: "in",
                amount: "120.00",
                status: "completed",
                title: "Доход от рекламы",
                date: "15 янв, 09:15",
              },
              {
                id: 3,
                type: "in",
                amount: "75.50",
                status: "pending",
                title: "Пополнение баланса",
                date: "14 янв, 18:45",
              },
              {
                id: 4,
                type: "out",
                amount: "30.00",
                status: "completed",
                title: "Оплата кампании #1234",
                date: "14 янв, 12:20",
              },
              {
                id: 5,
                type: "in",
                amount: "95.00",
                status: "completed",
                title: "Доход от показов",
                date: "13 янв, 16:30",
              },
              {
                id: 6,
                type: "out",
                amount: "25.00",
                status: "completed",
                title: "Вывод средств",
                date: "13 янв, 10:15",
              },
              {
                id: 7,
                type: "in",
                amount: "200.00",
                status: "completed",
                title: "Пополнение баланса",
                date: "12 янв, 14:00",
              },
            ].map((tx) => (
              <Card key={tx.id} hoverable>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ 
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: tx.type === "in" ? 'rgba(82, 196, 26, 0.1)' : 'rgba(22, 119, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {tx.type === "in" ? (
                      <ArrowDownOutlined style={{ fontSize: '18px', color: '#52c41a' }} />
                    ) : (
                      <ArrowUpOutlined style={{ fontSize: '18px', color: '#1677ff' }} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ fontSize: '15px', display: 'block', fontWeight: 600 }}>{tx.title}</Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>{tx.date}</Text>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Text strong style={{ 
                      fontSize: '16px',
                      fontWeight: 700,
                      color: tx.type === "in" ? '#52c41a' : '#000'
                    }}>
                      {tx.type === "in" ? "+" : "-"}
                      {tx.amount}
                    </Text>
                    {tx.status === "pending" ? (
                      <ClockCircleOutlined style={{ fontSize: '18px', color: '#faad14' }} />
                    ) : (
                      <CheckCircleOutlined style={{ fontSize: '18px', color: '#52c41a' }} />
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </Space>
        </div>
      </Space>
    </div>
  )
}
