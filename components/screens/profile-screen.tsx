"use client";

import { useEffect, useState } from "react";
import { Card, Avatar, Spin, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { api } from "@/lib/api";

const { Title, Text } = Typography;

type TgUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
};

type Advertiser = {
  id: string;
  email: string | null;
  status: string;
};

export function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [advertiser, setAdvertiser] = useState<Advertiser | null>(null);

  const tgUser: TgUser | null =
    typeof window !== "undefined" ? window.__TG_USER__ ?? null : null;

  useEffect(() => {
    if (!tgUser?.id) {
      console.error("TG user not found");
      setLoading(false);
      return;
    }

    api<{ advertiser: Advertiser }>("/advertiser/me")
      .then((r) => setAdvertiser(r.advertiser))
      .catch((e) => {
        console.error("Profile load error", e);
      })
      .finally(() => setLoading(false));
  }, [tgUser?.id]);

  if (loading) {
    return <Spin fullscreen />;
  }

  if (!tgUser || !advertiser) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={4}>Профиль недоступен</Title>
        <Text type="secondary">
          Откройте приложение через Telegram Mini App
        </Text>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 24 }}>
      <Card>
        <div style={{ textAlign: "center" }}>
          <Avatar
            size={80}
            src={tgUser.photo_url || undefined}
            icon={<UserOutlined />}
          />

          <Title level={3} style={{ marginTop: 12 }}>
            {tgUser.first_name} {tgUser.last_name}
          </Title>

          {tgUser.username && (
            <Text type="secondary">@{tgUser.username}</Text>
          )}
        </div>

        <div style={{ marginTop: 24 }}>
          <Text type="secondary">Advertiser ID</Text>
          <div>{advertiser.id}</div>

          <Text type="secondary">Email</Text>
          <div>{advertiser.email || "—"}</div>

          <Text type="secondary">Status</Text>
          <div>{advertiser.status}</div>
        </div>
      </Card>
    </div>
  );
}
