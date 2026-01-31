/* =========================
   CONFIG
========================= */
export const API_URL = "https://towerads-backend.onrender.com";

/* =========================
   TELEGRAM
========================= */
function getTelegramUserId(): string | null {
  if (typeof window === "undefined") return null;

  // @ts-ignore
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;

  return user?.id ? String(user.id) : null;
}

/* =========================
   BASE API
========================= */
export async function api<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const tgUserId = getTelegramUserId();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(tgUserId ? { "X-TG-USER-ID": tgUserId } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("API ERROR:", path, data);
    throw new Error(data?.error || "API error");
  }

  return data;
}

/* =========================
   TYPES
========================= */
export type Advertiser = {
  id: string;
  telegram_user_id?: string;
  email: string | null;
  status: string;
  created_at?: string;
};

export type Creative = {
  id: string;
  type: string;
  media_url: string;
  click_url: string;
  duration?: number;
  status: "draft" | "pending" | "approved" | "rejected" | "frozen";
  created_at: string;
};

/* =========================
   TG MINI APP
========================= */

// ENTRY POINT
export function fetchMe() {
  return api<{
    role: "advertiser";
    onboarded: boolean;
    advertiser: Advertiser;
  }>("/me");
}

// PROFILE
export function fetchAdvertiserMe() {
  return api<{ advertiser: Advertiser }>("/advertiser/me");
}

/* =========================
   CREATIVES
========================= */

// LIST
export function fetchCreatives() {
  return api<{ creatives: Creative[] }>("/advertiser/creatives");
}

// CREATE (DRAFT)
export function createCreative(payload: {
  title: string;
  type: string;
  media_url: string;
  click_url: string;
  duration?: number;
}) {
  return api<{
    success: true;
    creative: { id: string; status: "draft" };
  }>("/advertiser/creatives", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// SUBMIT TO MODERATION
export function submitCreative(creativeId: string) {
  return api<{ success: true }>(
    `/advertiser/creatives/${creativeId}/submit`,
    { method: "POST" }
  );
}

/* =========================
   TOWER ADS (SDK)
========================= */

// REQUEST AD
export function requestAd(payload: {
  api_key: string;
  placement_id: string;
  user_data?: {
    ip?: string;
    device?: string;
    os?: string;
  };
}) {
  return api<{
    provider: "tower" | string;
    impression_id: string;
    ad?: {
      ad_id: string;
      ad_type: string;
      media_url: string;
      click_url: string;
      duration?: number;
    };
  }>("/api/tower-ads/request", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// IMPRESSION
export function sendImpression(impression_id: string) {
  return api<{ success: true }>("/api/tower-ads/impression", {
    method: "POST",
    body: JSON.stringify({ impression_id }),
  });
}

// COMPLETE
export function completeAd(impression_id: string) {
  return api<{ reward_granted: boolean }>(
    "/api/tower-ads/complete",
    {
      method: "POST",
      body: JSON.stringify({ impression_id }),
    }
  );
}

// CLICK
export function trackClick(impression_id: string) {
  return api<{ click_tracked: true }>(
    "/api/tower-ads/click",
    {
      method: "POST",
      body: JSON.stringify({ impression_id }),
    }
  );
}

// STATS
export function fetchStats(placement_id: string) {
  return api<{
    requests: number;
    impressions: number;
    clicks: number;
    revenue: number;
    cost: number;
    ecpm: number;
  }>(`/api/tower-ads/stats?placement_id=${placement_id}`);
}

/* =========================
   SERVICE
========================= */

export function healthCheck() {
  return api<{ ok: true }>("/healthz");
}
