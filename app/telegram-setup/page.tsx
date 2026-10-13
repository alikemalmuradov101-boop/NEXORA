 "use client";

import { useState } from "react";

export default function TelegramSetupPage() {
  const [secret, setSecret] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function configure() {
    if (!secret.trim()) {
      setStatus("Введи TELEGRAM_SETUP_SECRET из переменных Vercel.");
      return;
    }
    setBusy(true);
    setStatus("Настраиваем Telegram…");
    try {
      const response = await fetch("/api/telegram/setup", {
        method: "POST",
        headers: { authorization: `Bearer ${secret.trim()}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Настройка не удалась.");
      setStatus(`Готово! Webhook: ${data.webhookUrl}. Mini App: ${data.miniAppUrl}. Теперь добавь бота в группу и отправь туда сообщение.`);
      setSecret("");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Не удалось настроить Telegram.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ minHeight: "100dvh", background: "#0a100d", color: "#f0f4ed", fontFamily: "Arial, sans-serif", padding: "32px 18px", boxSizing: "border-box" }}>
      <section style={{ maxWidth: 520, margin: "40px auto", padding: 24, border: "1px solid #304831", borderRadius: 16, background: "#111a14" }}>
        <p style={{ color: "#b8e986", letterSpacing: 2, fontSize: 11, fontWeight: 700 }}>ДРЕВЕНЬ · НАСТРОЙКА</p>
        <h1 style={{ fontSize: 28, margin: "12px 0" }}>Подключение Telegram</h1>
        <p style={{ color: "#a0aea3", lineHeight: 1.7, fontSize: 14 }}>Эта страница установит webhook бота и кнопку Mini App. Сначала добавь в Vercel переменные TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET и TELEGRAM_SETUP_SECRET.</p>
        <label htmlFor="setup-secret" style={{ display: "block", fontSize: 12, margin: "20px 0 8px" }}>TELEGRAM_SETUP_SECRET</label>
        <input id="setup-secret" type="password" autoComplete="off" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Вставь секрет настройки" style={{ width: "100%", boxSizing: "border-box", padding: 13, borderRadius: 8, border: "1px solid #405741", background: "#0a100d", color: "#f0f4ed" }} />
        <button onClick={configure} disabled={busy} style={{ width: "100%", marginTop: 12, padding: 14, border: 0, borderRadius: 8, background: "#b8e986", color: "#172015", fontWeight: 700, opacity: busy ? 0.7 : 1 }}>{busy ? "Настраиваем…" : "Подключить бота"}</button>
        {status && <p role="status" style={{ whiteSpace: "pre-wrap", overflowWrap: "anywhere", color: "#d8e8d0", fontSize: 13, lineHeight: 1.6, marginTop: 18 }}>{status}</p>}
        <p style={{ color: "#7f8e80", fontSize: 11, lineHeight: 1.6, marginTop: 20 }}>Не вставляй сюда токен бота. Нужен только отдельный TELEGRAM_SETUP_SECRET. После настройки можно сменить его в Vercel.</p>
      </section>
    </main>
  );
}
