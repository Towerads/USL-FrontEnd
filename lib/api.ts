export const API_URL = "https://towerads-backend.onrender.com";

function getTelegramUserId(): string | null {
  if (typeof window === "undefined") return null;

  // @ts-ignore
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;

  return user?.id ? String(user.id) : null;
}

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
    console.error("API ERROR", path, data);
    throw new Error(data?.error || "API error");
  }

  return data;
}


