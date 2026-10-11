"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (mode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: "https://nexora-olive-two.vercel.app/",
            data: { username },
          },
        });

        if (error) throw error;

        if (data.user) {
          setMessage(
            data.session
              ? "Аккаунт создан! Вы вошли в NEXORA."
              : "Аккаунт создан! Проверьте почту и подтвердите Email."
          );
        }
      } else {
        const { data, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (error) throw error;

        if (data.user) {
          setMessage("Вы успешно вошли в NEXORA!");
        }
      }
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Произошла ошибка."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #050816, #101b3d, #061c2c)",
        color: "white",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "420px",
          padding: "32px",
          border: "1px solid #263d65",
          borderRadius: "20px",
          background: "rgba(12, 25, 50, 0.92)",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#55d8ff",
            letterSpacing: "4px",
            fontSize: "34px",
          }}
        >
          NEXORA
        </h1>

        <p style={{ textAlign: "center", color: "#b8c5df" }}>
          Твой мир. Твои правила.
        </p>

        <div style={{ display: "flex", gap: "10px", margin: "28px 0" }}>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setMessage("");
            }}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #263d65",
              background:
                mode === "register" ? "#39cfff" : "#101b3d",
              color: mode === "register" ? "#06111f" : "white",
              fontWeight: "bold",
            }}
          >
            Регистрация
          </button>

          <button
            type="button"
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              border: "1px solid #263d65",
              background: mode === "login" ? "#39cfff" : "#101b3d",
              color: mode === "login" ? "#06111f" : "white",
              fontWeight: "bold",
            }}
          >
            Вход
          </button>
        </div>

        <form onSubmit={handleAuth}>
          {mode === "register" && (
            <label style={{ display: "block", marginBottom: "16px" }}>
              Имя пользователя
              <input
                required
                minLength={3}
                maxLength={24}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Придумайте имя"
                style={inputStyle}
              />
            </label>
          )}

          <label style={{ display: "block", marginBottom: "16px" }}>
            Email
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={inputStyle}
            />
          </label>

          <label style={{ display: "block", marginBottom: "20px" }}>
            Пароль
            <input
              required
              type="password"
              minLength={6}
              autoComplete={
                mode === "register"
                  ? "new-password"
                  : "current-password"
              }
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
              style={inputStyle}
            />
          </label>

          <button
            disabled={loading}
            type="submit"
            style={{
              width: "100%",
              padding: "15px",
              border: "none",
              borderRadius: "10px",
              background: "#39cfff",
              color: "#06111f",
              fontWeight: "bold",
              fontSize: "16px",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading
              ? "Подождите..."
              : mode === "register"
                ? "Создать аккаунт"
                : "Войти"}
          </button>
        </form>

        {message && (
          <p
            role="status"
            style={{
              marginTop: "20px",
              color:
                message.includes("ошиб") ||
                message.includes("Invalid")
                  ? "#ff9b9b"
                  : "#55d8ff",
              overflowWrap: "anywhere",
              lineHeight: 1.6,
            }}
          >
            {message}
          </p>
        )}

        <p
          style={{
            textAlign: "center",
            color: "#8294b6",
            fontSize: "12px",
            marginTop: "28px",
          }}
        >
          © 2026 NEXORA
        </p>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  display: "block",
  width: "100%",
  boxSizing: "border-box",
  marginTop: "8px",
  padding: "13px",
  borderRadius: "10px",
  border: "1px solid #263d65",
  background: "#050816",
  color: "white",
  outline: "none",
};
              
