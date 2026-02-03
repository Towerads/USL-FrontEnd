"use client";

import { Card, Button, Typography, Space, Row, Col, message } from "antd";
import {
  EyeOutlined,
  DollarOutlined,
  RiseOutlined,
  CopyOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const { Title, Text, Paragraph } = Typography;

const API_BASE = "https://towerads-backend.onrender.com";

export function PublisherDashboardNew() {
  const router = useRouter();

  const [stats, setStats] = useState({
    impressions: 0,
    revenue: 0,
    cpm: 0,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPublisherStats();
  }, []);

  const loadPublisherStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/publishers`, {
        credentials: "include",
      });
      const data = await res.json();

      let impressions = 0;
      let revenue = 0;

      data.publishers?.forEach((p: any) => {
        impressions += Number(p.impressions || 0);
        revenue += Number(p.revenue || 0);
      });

      const cpm = impressions > 0 ? (revenue / impressions) * 1000 : 0;

      setStats({
        impressions,
        revenue,
        cpm,
      });
    } catch (e) {
      console.error("publisher dashboard error", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySDK = () => {
    const sdkScript = `<!-- TOWER Ads SDK v3.0 - Secure -->
<script src="https://cdn.usl.app/sdk/v3/tower-ads.js"></script>
<script>
  const ads = new TowerAds({
    appId: 'YOUR_APP_ID',
    onRewardEarned: (reward) => {
      console.log('Награда:', reward);
    }
  });
  
  ads.show('main_banner');
</script>`;
    navigator.clipboard.writeText(sdkScript);
    message.success("SDK скрипт скопирован в буфер обмена");
  };

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
        paddingBottom: "100px",
      }}
    >
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        <Title level={2} style={{ margin: 0, fontWeight: 700, fontSize: "28px" }}>
          Дашборд
        </Title>

        {/* Stats Panel */}
        <Card loading={loading}>
          <Title level={5} style={{ marginBottom: 16, fontWeight: 700 }}>
            Статистика за сегодня
          </Title>
          <Row gutter={16}>
            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Space size="small">
                  <EyeOutlined />
                  <Text type="secondary">Показы</Text>
                </Space>
                <Text strong style={{ fontSize: 18 }}>
                  {stats.impressions.toLocaleString()}
                </Text>
              </Space>
            </Col>

            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Space size="small">
                  <DollarOutlined />
                  <Text type="secondary">Доход</Text>
                </Space>
                <Text strong style={{ fontSize: 18, color: "#52c41a" }}>
                  +{stats.revenue.toFixed(2)} USDT
                </Text>
              </Space>
            </Col>

            <Col span={8}>
              <Space direction="vertical" size={0}>
                <Space size="small">
                  <RiseOutlined />
                  <Text type="secondary">CPM</Text>
                </Space>
                <Text strong style={{ fontSize: 18, color: "#1677ff" }}>
                  ${stats.cpm.toFixed(2)}
                </Text>
              </Space>
            </Col>
          </Row>
        </Card>

        {/* SDK Integration Info */}
        <Card>
          <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <div>
              <Title level={5} style={{ marginBottom: 8 }}>
                Монетизация Telegram Mini App
              </Title>
              <Paragraph type="secondary" style={{ margin: 0 }}>
                Вы можете монетизировать своё приложение в Телеграм установив наш
                рекламный SDK.
              </Paragraph>
            </div>

            <div>
              <Text strong style={{ display: "block", marginBottom: 8 }}>
                Отправьте скрипт своему разработчику:
              </Text>
              <Card
                size="small"
                style={{
                  background: "#f5f5f5",
                  fontFamily: "monospace",
                  fontSize: "11px",
                }}
              >
                <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
{`<!-- TOWER Ads SDK v3.0 - Secure -->
<script src="https://cdn.usl.app/sdk/v3/tower-ads.js"></script>
<script>
  const ads = new TowerAds({
    appId: 'YOUR_APP_ID',
    onRewardEarned: (reward) => {
      console.log('Награда:', reward);
    }
  });
  
  ads.show('main_banner');
</script>`}
                </pre>
              </Card>

              <Button
                type="primary"
                icon={<CopyOutlined />}
                onClick={handleCopySDK}
                block
                style={{ marginTop: 12 }}
              >
                Скопировать скрипт
              </Button>
            </div>
          </Space>
        </Card>

        {/* Current CPM Info */}
        <Card style={{ background: "rgba(22, 119, 255, 0.05)" }}>
          <Space direction="vertical" size={8}>
            <Text strong>Текущий средний CPM показов</Text>
            <Title level={2} style={{ margin: 0, color: "#1677ff" }}>
              ${stats.cpm.toFixed(2)}
            </Title>
            <Text type="secondary">
              Средняя стоимость за 1000 показов в вашем приложении
            </Text>
            <Button type="link" size="small" style={{ padding: 0 }}>
              Документация по интеграции →
            </Button>
          </Space>
        </Card>

        {/* Support Button */}
        <Button
          size="large"
          block
          icon={<CustomerServiceOutlined />}
          onClick={() => router.push("/support-chat")}
          style={{ height: 48, fontWeight: 600 }}
        >
          Связаться с поддержкой
        </Button>
      </Space>
    </div>
  );
}
