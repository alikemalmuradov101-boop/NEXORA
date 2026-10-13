import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TelegramMessage = {
  message_id: number;
  text?: string;
  from?: {
    id: number;
    is_bot?: boolean;
    first_name?: string;
    last_name?: string;
    username?: string;
  };
  chat: {
    id: number;
    type: string;
    username?: string;
    title?: string;
  };
};

export async function POST(request: NextRequest) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const suppliedSecret = request.headers.get("x-telegram-bot-api-secret-token");

  if (!expectedSecret || suppliedSecret !== expectedSecret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) return NextResponse.json({ error: "Database is not configured" }, { status: 503 });

  let update: { message?: TelegramMessage };
  try {
    update = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad update" }, { status: 400 });
  }

  const message = update.message;
  if (!message) return NextResponse.json({ ok: true });

  const expectedGroup = (process.env.TELEGRAM_GROUP_USERNAME || "LesogradBotchat").replace(/^@/, "");
  const isTargetGroup =
    (message.chat.type === "group" || message.chat.type === "supergroup") &&
    message.chat.username === expectedGroup;

  if (!isTargetGroup) return NextResponse.json({ ok: true });

  await supabase.from("telegram_group_settings").upsert(
    {
      id: true,
      chat_id: message.chat.id,
      chat_username: expectedGroup,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (!message.text || message.from?.is_bot || message.text.startsWith("/")) {
    return NextResponse.json({ ok: true });
  }

  const displayName = message.from?.username
    ? `@${message.from.username}`
    : [message.from?.first_name, message.from?.last_name].filter(Boolean).join(" ") || "Участник Telegram";

  const { error } = await supabase.from("chat_messages").insert({
    display_name: displayName,
    telegram_user_id: message.from?.id ?? null,
    text: message.text.slice(0, 1000),
    source: "telegram",
    telegram_chat_id: message.chat.id,
    telegram_message_id: message.message_id,
  });

  // Duplicate webhook deliveries are safe to ignore.
  if (error && error.code !== "23505") {
    console.error("Could not store Telegram group message:", error);
  }

  return NextResponse.json({ ok: true });
}
