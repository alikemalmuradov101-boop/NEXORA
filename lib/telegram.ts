import { createHmac, timingSafeEqual } from "node:crypto";

export type TelegramWebAppUser = {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
};

export function validateTelegramInitData(
  initData: string,
  botToken: string,
): TelegramWebAppUser | null {
  if (!initData || !botToken) return null;

  const params = new URLSearchParams(initData);
  const suppliedHash = params.get("hash");
  const authDate = Number(params.get("auth_date"));

  if (!suppliedHash || !Number.isFinite(authDate)) return null;
  if (Math.abs(Date.now() / 1000 - authDate) > 86400) return null;

  params.delete("hash");
  params.delete("signature");

  const dataCheckString = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");

  const secretKey = createHmac("sha256", "WebAppData")
    .update(botToken)
    .digest();
  const calculatedHash = createHmac("sha256", secretKey)
    .update(dataCheckString)
    .digest("hex");

  try {
    const supplied = Buffer.from(suppliedHash, "hex");
    const calculated = Buffer.from(calculatedHash, "hex");
    if (supplied.length !== calculated.length || !timingSafeEqual(supplied, calculated)) {
      return null;
    }
  } catch {
    return null;
  }

  const rawUser = params.get("user");
  if (!rawUser) return null;

  try {
    const user = JSON.parse(rawUser) as TelegramWebAppUser;
    return typeof user.id === "number" ? user : null;
  } catch {
    return null;
  }
}

export async function callTelegramApi<T>(
  method: string,
  payload: Record<string, unknown>,
): Promise<T> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error("TELEGRAM_BOT_TOKEN is not configured");

  const response = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    cache: "no-store",
  });

  const result = (await response.json()) as { ok?: boolean; result?: T; description?: string };
  if (!response.ok || !result.ok) {
    throw new Error(result.description || `Telegram API request failed: ${method}`);
  }

  return result.result as T;
}
