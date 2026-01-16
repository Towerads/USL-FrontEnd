"use client"

import { Card, Space, Typography, Statistic, Row, Col } from 'antd';
import { EyeOutlined, AimOutlined, RiseOutlined, DollarOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export function StatsScreen() {
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', paddingBottom: '100px' }}>
      <Space direction="vertical" size={20} style={{ width: '100%' }}>
        {/* Stats Grid */}
        <Row gutter={[12, 12]}>
          <Col span={12}>
            <Card>
              <Statistic
                title="Просмотры"
                value="12.4K"
                prefix={<EyeOutlined />}
                valueStyle={{ color: '#4169E1' }}
              />
              <Text type="success" style={{ fontSize: '12px' }}>
                <RiseOutlined /> +12.5%
              </Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="Клики"
                value={856}
                prefix={<AimOutlined />}
                valueStyle={{ color: '#4169E1' }}
              />
              <Text type="success" style={{ fontSize: '12px' }}>
                <RiseOutlined /> +8.3%
              </Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="Доход"
                value={284}
                prefix={<DollarOutlined />}
                valueStyle={{ color: '#10B981' }}
              />
              <Text type="success" style={{ fontSize: '12px' }}>
                <RiseOutlined /> +15.7%
              </Text>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <Statistic
                title="CTR"
                value="6.9%"
                prefix={<RiseOutlined />}
                valueStyle={{ color: '#4169E1' }}
              />
              <Text type="success" style={{ fontSize: '12px' }}>
                <RiseOutlined /> +2.1%
              </Text>
            </Card>
          </Col>
        </Row>

        {/* Chart Placeholder */}
        <Card>
          <Title level={5} style={{ marginBottom: '16px', fontWeight: 700 }}>Просмотры по дням</Title>
          <div style={{ height: '192px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '8px' }}>
            {[40, 65, 45, 80, 60, 75, 90].map((height, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{ 
                    width: '100%', 
                    backgroundColor: 'rgba(65, 105, 225, 0.2)', 
                    borderTopLeftRadius: '4px',
                    borderTopRightRadius: '4px',
                    height: `${height}%`,
                    transition: 'background-color 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(65, 105, 225, 0.3)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(65, 105, 225, 0.2)'}
                />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"][i]}
                </Text>
              </div>
            ))}
          </div>
        </Card>

        {/* Performance by Creative */}
        <div>
          <Title level={4} style={{ marginBottom: '16px', fontWeight: 700, fontSize: '20px' }}>Топ креативы</Title>
          <Space direction="vertical" size={10} style={{ width: '100%' }}>
            {[
              { id: 1, name: "Видео #1", views: 4521, ctr: "8.2%" },
              { id: 2, name: "Видео #2", views: 3245, ctr: "7.1%" },
              { id: 3, name: "Статика #1", views: 2856, ctr: "5.9%" },
              { id: 4, name: "Баннер #5", views: 2134, ctr: "5.2%" },
              { id: 5, name: "Видео #3", views: 1987, ctr: "4.8%" },
              { id: 6, name: "Статика #2", views: 1654, ctr: "4.3%" },
            ].map((creative, index) => (
              <Card key={creative.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    backgroundColor: 'var(--color-muted)',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text strong style={{ display: 'block' }}>{creative.name}</Text>
                    <Space size="middle" style={{ marginTop: '4px' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        {creative.views.toLocaleString()} просмотров
                      </Text>
                      <Text type="success" style={{ fontSize: '12px', fontWeight: 500 }}>
                        CTR {creative.ctr}
                      </Text>
                    </Space>
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
