"use client";

import { Card, Typography, Space, Tabs, Row, Col, Empty } from "antd";
import {
  EyeOutlined,
  DollarOutlined,
  RiseOutlined,
  AimOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";

const { Title, Text } = Typography;

const API_BASE = "https://towerads-backend.onrender.com";

export function StatsNewScreen() {
  const [activeTab, setActiveTab] = useState("advertiser");

  const [advertiserStats, setAdvertiserStats] = useState<any>(null);
  const [publisherStats, setPublisherStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 🔹 рекламодатель
  const loadAdvertiserStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, {
        credentials: "include",
      });
      const data = await res.json();
      setAdvertiserStats(data);
    } catch (e) {
      console.error("advertiser stats error", e);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 паблишер (агрегат по placements)
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

      const cpm =
        impressions > 0 ? (revenue / impressions) * 1000 : 0;

      setPublisherStats({
        impressions,
        revenue,
        cpm,
      });
    } catch (e) {
      console.error("publisher stats error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "advertiser") loadAdvertiserStats();
    if (activeTab === "publisher") loadPublisherStats();
  }, [activeTab]);

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
          Статистика
        </Title>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: "advertiser", label: "Рекламодатель" },
            { key: "publisher", label: "Паблишер" },
            { key: "channel_owner", label: "Владелец канала", disabled: true },
            { key: "channel_buyer", label: "Покупатель размещений", disabled: true },
          ]}
        />

        {/* ================= ADVERTISER ================= */}
        {activeTab === "advertiser" && (
          <>
            <Card loading={loading}>
              <Title level={5} style={{ marginBottom: 16 }}>
                Общая статистика за месяц
              </Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Space direction="vertical">
                    <Space size="small">
                      <EyeOutlined />
                      <Text type="secondary">Показы</Text>
                    </Space>
                    <Text strong style={{ fontSize: 20 }}>
                      {advertiserStats?.impressions ?? 0}
                    </Text>
                  </Space>
                </Col>

                <Col span={12}>
                  <Space direction="vertical">
                    <Space size="small">
                      <AimOutlined />
                      <Text type="secondary">Клики</Text>
                    </Space>
                    <Text strong style={{ fontSize: 20 }}>
                      {advertiserStats?.clicks ?? 0}
                    </Text>
                  </Space>
                </Col>

                <Col span={12}>
                  <Space direction="vertical">
                    <Space size="small">
                      <RiseOutlined />
                      <Text type="secondary">CTR</Text>
                    </Space>
                    <Text strong style={{ fontSize: 20, color: "#1677ff" }}>
                      {advertiserStats?.impressions
                        ? (
                            (advertiserStats.clicks /
                              advertiserStats.impressions) *
                            100
                          ).toFixed(2)
                        : "0.00"}
                      %
                    </Text>
                  </Space>
                </Col>

                <Col span={12}>
                  <Space direction="vertical">
                    <Space size="small">
                      <DollarOutlined />
                      <Text type="secondary">Потрачено</Text>
                    </Space>
                    <Text strong style={{ fontSize: 20, color: "#faad14" }}>
                      {Number(advertiserStats?.revenue || 0).toFixed(2)} USDT
                    </Text>
                  </Space>
                </Col>
              </Row>
            </Card>
          </>
        )}

        {/* ================= PUBLISHER ================= */}
        {activeTab === "publisher" && (
          <>
            <Card loading={loading}>
              <Title level={5} style={{ marginBottom: 16 }}>
                Общая статистика за месяц
              </Title>
              <Row gutter={16}>
                <Col span={12}>
                  <Space direction="vertical">
                    <Space size="small">
                      <EyeOutlined />
                      <Text type="secondary">Показы</Text>
                    </Space>
                    <Text strong style={{ fontSize: 20 }}>
                      {publisherStats?.impressions ?? 0}
                    </Text>
                  </Space>
                </Col>

                <Col span={12}>
                  <Space direction="vertical">
                    <Space size="small">
                      <DollarOutlined />
                      <Text type="secondary">Доход</Text>
                    </Space>
                    <Text strong style={{ fontSize: 20, color: "#52c41a" }}>
                      {Number(publisherStats?.revenue || 0).toFixed(2)} USDT
                    </Text>
                  </Space>
                </Col>

                <Col span={12}>
                  <Space direction="vertical">
                    <Space size="small">
                      <RiseOutlined />
                      <Text type="secondary">CPM</Text>
                    </Space>
                    <Text strong style={{ fontSize: 20, color: "#1677ff" }}>
                      {Number(publisherStats?.cpm || 0).toFixed(2)}
                    </Text>
                  </Space>
                </Col>
              </Row>
            </Card>
          </>
        )}

        {(activeTab === "channel_owner" ||
          activeTab === "channel_buyer") && (
          <Card>
            <Empty description="Раздел в разработке" />
          </Card>
        )}
      </Space>
    </div>
  );
}
