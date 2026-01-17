"use client"

import { Card, Typography, Space, Tabs, Row, Col, Empty } from 'antd';
import { EyeOutlined, DollarOutlined, RiseOutlined, AimOutlined } from '@ant-design/icons';
import { useState } from 'react';

const { Title, Text } = Typography;

export function StatsNewScreen() {
  const [activeTab, setActiveTab] = useState('advertiser');

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px' }}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* Header */}
        <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: '28px' }}>
          Статистика
        </Title>

        {/* Tabs */}
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'advertiser', label: 'Рекламодатель' },
            { key: 'publisher', label: 'Паблишер' },
            { key: 'channel_owner', label: 'Владелец канала', disabled: true },
            { key: 'channel_buyer', label: 'Покупатель размещений', disabled: true },
          ]}
        />

        {/* Advertiser Stats */}
        {activeTab === 'advertiser' && (
          <>
            <Card>
              <Title level={5} style={{ marginBottom: '16px', fontWeight: 700, fontSize: '16px' }}>
                Общая статистика за месяц
              </Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Space direction="vertical" size={0} style={{ marginBottom: '16px' }}>
                    <Space size="small">
                      <EyeOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>Показы</Text>
                    </Space>
                    <Text strong style={{ fontSize: '20px' }}>134.7K</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={0} style={{ marginBottom: '16px' }}>
                    <Space size="small">
                      <AimOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>Клики</Text>
                    </Space>
                    <Text strong style={{ fontSize: '20px' }}>4.1K</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={0}>
                    <Space size="small">
                      <RiseOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>CTR</Text>
                    </Space>
                    <Text strong style={{ fontSize: '20px', color: '#1677ff' }}>3.04%</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={0}>
                    <Space size="small">
                      <DollarOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>Потрачено</Text>
                    </Space>
                    <Text strong style={{ fontSize: '20px', color: '#faad14' }}>1,234 USDT</Text>
                  </Space>
                </Col>
              </Row>
            </Card>

            <Card>
              <Title level={5} style={{ marginBottom: '12px', fontWeight: 700, fontSize: '16px' }}>
                Активные кампании
              </Title>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {[
                  { name: 'Новогодняя распродажа', impressions: 45230, clicks: 1234, ctr: '2.73%' },
                  { name: 'Промо акция зима', impressions: 32100, clicks: 890, ctr: '2.77%' },
                ].map((campaign, idx) => (
                  <div key={idx} style={{ padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                      {campaign.name}
                    </Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        Показы: {campaign.impressions.toLocaleString()}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        Клики: {campaign.clicks}
                      </Text>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        CTR: {campaign.ctr}
                      </Text>
                    </div>
                  </div>
                ))}
              </Space>
            </Card>
          </>
        )}

        {/* Publisher Stats */}
        {activeTab === 'publisher' && (
          <>
            <Card>
              <Title level={5} style={{ marginBottom: '16px', fontWeight: 700, fontSize: '16px' }}>
                Общая статистика за месяц
              </Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Space direction="vertical" size={0} style={{ marginBottom: '16px' }}>
                    <Space size="small">
                      <EyeOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>Показы</Text>
                    </Space>
                    <Text strong style={{ fontSize: '20px' }}>145.7K</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={0} style={{ marginBottom: '16px' }}>
                    <Space size="small">
                      <DollarOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>Доход</Text>
                    </Space>
                    <Text strong style={{ fontSize: '20px', color: '#52c41a' }}>+391.30 USDT</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={0}>
                    <Space size="small">
                      <RiseOutlined style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }} />
                      <Text type="secondary" style={{ fontSize: '12px' }}>CPM</Text>
                    </Space>
                    <Text strong style={{ fontSize: '20px', color: '#1677ff' }}>$2.68</Text>
                  </Space>
                </Col>
                <Col span={12}>
                  <Space direction="vertical" size={0}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Просмотры</Text>
                    <Text strong style={{ fontSize: '20px' }}>89.2K</Text>
                  </Space>
                </Col>
              </Row>
            </Card>

            <Card>
              <Title level={5} style={{ marginBottom: '12px', fontWeight: 700, fontSize: '16px' }}>
                Активные каналы
              </Title>
              <Space direction="vertical" size={12} style={{ width: '100%' }}>
                {[
                  { name: 'Технологии будущего', impressions: 89450, revenue: '234.50' },
                  { name: 'Бизнес идеи', impressions: 56230, revenue: '156.80' },
                ].map((channel, idx) => (
                  <div key={idx} style={{ padding: '12px', background: '#f5f5f5', borderRadius: '8px' }}>
                    <Text strong style={{ fontSize: '14px', display: 'block', marginBottom: '8px' }}>
                      {channel.name}
                    </Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Text type="secondary" style={{ fontSize: '13px' }}>
                        Показы: {channel.impressions.toLocaleString()}
                      </Text>
                      <Text style={{ fontSize: '13px', color: '#52c41a', fontWeight: 600 }}>
                        +{channel.revenue} USDT
                      </Text>
                    </div>
                  </div>
                ))}
              </Space>
            </Card>
          </>
        )}

        {/* Coming Soon for other tabs */}
        {(activeTab === 'channel_owner' || activeTab === 'channel_buyer') && (
          <Card>
            <Empty
              description={
                <Space direction="vertical" size={12}>
                  <Text strong style={{ fontSize: '16px' }}>Скоро</Text>
                  <Text type="secondary">Этот раздел находится в разработке</Text>
                </Space>
              }
            />
          </Card>
        )}
      </Space>
    </div>
  );
}
