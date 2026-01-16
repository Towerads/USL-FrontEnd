"use client"

import { Card, Input, Badge, Tabs, Space, Typography, Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined, SearchOutlined, DownloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export function HistoryScreen() {
  const transactions = [
    {
      id: "TXN-001",
      type: "deposit",
      amount: "500.00",
      status: "completed",
      title: "Пополнение USDT",
      date: "15 янв 2025, 14:32",
      fee: "0.00",
    },
    {
      id: "TXN-002",
      type: "withdrawal",
      amount: "250.00",
      status: "completed",
      title: "Вывод USDT",
      date: "15 янв 2025, 10:15",
      fee: "2.50",
    },
    {
      id: "TXN-003",
      type: "payment",
      amount: "75.00",
      status: "pending",
      title: "Оплата кампании #1234",
      date: "14 янв 2025, 18:45",
      fee: "0.00",
    },
    {
      id: "TXN-004",
      type: "income",
      amount: "120.00",
      status: "completed",
      title: "Доход от размещения",
      date: "14 янв 2025, 12:20",
      fee: "0.00",
    },
    {
      id: "TXN-005",
      type: "withdrawal",
      amount: "1000.00",
      status: "failed",
      title: "Вывод USDT",
      date: "13 янв 2025, 09:30",
      fee: "10.00",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge status="success" text="Завершено" />
      case "pending":
        return <Badge status="warning" text="В обработке" />
      case "failed":
        return <Badge status="error" text="Отклонено" />
      default:
        return null
    }
  }

  const getTypeIcon = (type: string) => {
    if (type === "deposit" || type === "income") {
      return <ArrowDownOutlined style={{ color: '#10B981' }} />
    }
    return <ArrowUpOutlined />
  }

  return (
    <div style={{ padding: '16px' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={2} style={{ margin: 0 }}>История операций</Title>
          <Button icon={<DownloadOutlined />}>
            Экспорт
          </Button>
        </div>

        <Input 
          placeholder="Поиск по ID или описанию" 
          prefix={<SearchOutlined />}
        />

        <Tabs
          defaultActiveKey="all"
          items={[
            {
              key: 'all',
              label: 'Все',
              children: (
                <Space direction="vertical" size="middle" style={{ width: '100%' }}>
                  {transactions.map((tx) => (
                    <Card key={tx.id}>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ 
                          padding: '8px', 
                          borderRadius: '50%', 
                          backgroundColor: tx.type === "deposit" || tx.type === "income" ? 'rgba(16, 185, 129, 0.1)' : 'var(--color-muted)',
                          marginTop: '4px',
                          height: 'fit-content'
                        }}>
                          {getTypeIcon(tx.type)}
                        </div>

                        <div style={{ flex: 1 }}>
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <div>
                                <Text strong style={{ display: 'block' }}>{tx.title}</Text>
                                <Text type="secondary" style={{ fontSize: '12px' }}>{tx.date}</Text>
                              </div>
                              <div style={{ textAlign: 'right' }}>
                                <Text strong style={{ 
                                  fontSize: '16px',
                                  color: tx.type === "deposit" || tx.type === "income" ? '#10B981' : 'inherit'
                                }}>
                                  {tx.type === "deposit" || tx.type === "income" ? "+" : "-"}
                                  {tx.amount} USDT
                                </Text>
                                {tx.fee !== "0.00" && (
                                  <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                                    Комиссия: {tx.fee}
                                  </Text>
                                )}
                              </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Text type="secondary" style={{ fontSize: '12px', fontFamily: 'monospace' }}>
                                {tx.id}
                              </Text>
                              {getStatusBadge(tx.status)}
                            </div>
                          </Space>
                        </div>
                      </div>
                    </Card>
                  ))}
                </Space>
              ),
            },
            {
              key: 'income',
              label: 'Доходы',
              children: (
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '32px 0' }}>
                  Отображение только входящих транзакций
                </Text>
              ),
            },
            {
              key: 'expenses',
              label: 'Расходы',
              children: (
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '32px 0' }}>
                  Отображение только исходящих транзакций
                </Text>
              ),
            },
            {
              key: 'pending',
              label: 'В ожидании',
              children: (
                <Text type="secondary" style={{ display: 'block', textAlign: 'center', padding: '32px 0' }}>
                  Отображение транзакций в обработке
                </Text>
              ),
            },
          ]}
        />
      </Space>
    </div>
  )
}
