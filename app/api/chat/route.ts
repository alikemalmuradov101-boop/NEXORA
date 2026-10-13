import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { callTelegramApi, validateTelegramInitData } from "@/lib/telegram";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type StoredMessage = {
  id: string;
  display_name: string;
  text: string;
  source: "site" | "telegram";
  created_at: string;
};

function formatMessage(row: StoredMessage) {
  return {
    id: row.id,
    from: "user" as const,
    displayName: row.display_name,
    text: row.text,
    time: new Date(row.created_at).toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    source: row.source,
  };
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Чат пока не настроен: добавьте ключ Supabase в переменные окружения Vercel." },
      { status: 503 },
    );
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, display_name, text, source, created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    return NextResponse.json({ error: "Не удалось загрузить сообщения." }, { status: 500 });
  }

  return NextResponse.json({
    messages: ((data ?? []) as StoredMessage[]).reverse().map(formatMessage),
  });
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Чат пока не настроен: добавьте ключ Supabase в Vercel." },
      { status: 503 },
    );
  }

  let body: { text?: unknown; displayName?: unknown; initData?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Некорректный запрос." }, { status: 400 });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  const displayName =
    typeof body.displayName === "string"
      ? body.displayName.replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, 80)
      : "";
  const initData = typeof body.initData === "string" ? body.initData : "";

  if (!text || text.length > 1000) {
    return NextResponse.json({ error: "Сообщение должно содержать от 1 до 1000 символов." }, { status: 400 });
  }
  if (!displayName) {
    return NextResponse.json({ error: "Укажи имя или Telegram-ник." }, { status: 400 });
  }

  let telegramUserId: number | null = null;
  if (initData) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const user = token ? validateTelegramInitData(initData, token) : null;
    if (!user) {
      return NextResponse.json({ error: "Не удалось подтвердить вход через Telegram. Перезапусти Mini App." }, { status: 401 });
    }
    telegramUserId = user.id;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("chat_messages")
    .insert({
      display_name: displayName,
      telegram_user_id: telegramUserId,
      text,
      source: "site",
    })
    .select("id, display_name, text, source, created_at")
    .single();

  if (insertError || !inserted) {
    return NextResponse.json({ error: "Не удалось сохранить сообщение." }, { status: 500 });
  }

  let telegramSynced = false;
  const { data: group } = await supabase
    .from("telegram_group_settings")
    .select("chat_id")
    .eq("id", true)
    .maybeSingle();

  if (group?.chat_id) {
    try {
      await callTelegramApi("sendMessage", {
        chat_id: group.chat_id,
        text: `🌿 ${displayName}:\n${text}`,
        disable_web_page_preview: true,
      });
      telegramSynced = true;
    } catch (error) {
      console.error("Telegram group send failed:", error);
    }
  }

  return NextResponse.json({
    message: formatMessage(inserted as StoredMessage),
    telegramSynced,
  });
}
