import { NextRequest, NextResponse } from "next/server";
import { callTelegramApi } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const setupSecret = process.env.TELEGRAM_SETUP_SECRET;
  if (!setupSecret || request.headers.get("authorization") !== `Bearer ${setupSecret}`) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (!webhookSecret || !/^[A-Za-z0-9_-]{1,256}$/.test(webhookSecret)) {
    return NextResponse.json(
      { error: "TELEGRAM_WEBHOOK_SECRET должен содержать 1–256 символов: латинские буквы, цифры, _ или -." },
      { status: 400 },
    );
  }

  const origin = new URL(request.url).origin;
  const webhookUrl = new URL("/api/telegram/webhook", origin).toString();
  try {
    const result = await callTelegramApi<{ url: string; pending_update_count: number }>("setWebhook", {
      url: webhookUrl,
      secret_token: webhookSecret,
      allowed_updates: ["message"],
      drop_pending_updates: false,
    });
    await callTelegramApi("setChatMenuButton", {
      menu_button: {
        type: "web_app",
        text: "Открыть Древень",
        web_app: { url: origin },
      },
    });
    return NextResponse.json({ ok: true, webhookUrl: result.url, pendingUpdates: result.pending_update_count, miniAppUrl: origin });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Не удалось установить webhook." },
      { status: 502 },
    );
  }
}
