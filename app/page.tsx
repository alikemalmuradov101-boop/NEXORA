
"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginTop: "8px",
  borderRadius: "10px",
  border: "1px solid #263d65",
  background: "#050816",
  color: "white",
};

const buttonStyle: React.CSSProperties = {
  padding: "13px",
  border: "1px solid #263d65",
  borderRadius: "10px",
  background: "#39cfff",
  color: "#06111f",
  fontWeight: "bold",
  cursor: "pointer",
};

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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

        setMessage(
          data.session
            ? "Аккаунт создан! Добро пожаловать в NEXORA."
            : "Аккаунт создан. Проверь почту и подтверди Email."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage("Вход выполнен!");
      }
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Произошла ошибка."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    setLoading(true);
    const { error } = await supabase.auth.signOut();
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Ты вышел из аккаунта.");
  }

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    padding: "24px",
    boxSizing: "border-box",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #050816, #101b3d, #061c2c)",
    color: "white",
    fontFamily: "Arial, sans-serif",
  };

  const panelStyle: React.CSSProperties = {
    width: "100%",
    maxWidth: "480px",
    padding: "28px",
    boxSizing: "border-box",
    border: "1px solid #263d65",
    borderRadius: "20px",
    background: "rgba(12, 25, 50, 0.96)",
  };

  if (loading) {
    return (
      <main style={pageStyle}>
        <section style={panelStyle}>
          <h1 style={{ color: "#55d8ff" }}>NEXORA</h1>
          Проверяем аккаунт...
        </section>
      </main>
    );
  }

  if (user) {
    const displayName =
      user.user_metadata?.username ||
      user.user_metadata?.full_name ||
      user.email?.split("@")[0] ||
      "Пользователь";

    return (
      <main style={pageStyle}>
        <section style={panelStyle}>
          <h1
            style={{
              textAlign: "center",
              color: "#55d8ff",
              letterSpacing: "4px",
            }}
          >
            NEXORA
          </h1>

          <p style={{ color: "#b8c5df", textAlign: "center" }}>
            Твой мир. Твои правила.
          </p>

          <div
            style={{
              marginTop: "28px",
              padding: "20px",
              borderRadius: "14px",
              background: "#081329",
              border: "1px solid #263d65",
            }}
          >
            <p style={{ color: "#55d8ff", fontSize: "13px" }}>
              ЛИЧНЫЙ КАБИНЕТ
            </p>

            <h2 style={{ overflowWrap: "anywhere" }}>
              Привет, {displayName}!
            </h2>

            <p style={{ color: "#b8c5df", overflowWrap: "anywhere" }}>
              Email: {user.email}
            </p>

            <p style={{ color: "#8294b6", fontSize: "12px" }}>
              ID аккаунта: {user.id}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gap: "12px",
              marginTop: "20px",
            }}
          >
            <button
              style={buttonStyle}
              onClick={() =>
                setMessage("Раздел объявлений добавим следующим этапом.")
              }
            >
              Мои объявления
            </button>

            <button
              style={{
                ...buttonStyle,
                background: "#101b3d",
                color: "white",
              }}
              onClick={() =>
                setMessage("Раздел покупок добавим следующим этапом.")
              }
            >
              Мои покупки
            </button>

            <button
              style={{
                ...buttonStyle,
                background: "#25162a",
                borderColor: "#67334f",
                color: "#ffb5cb",
              }}
              onClick={handleLogout}
              disabled={loading}
            >
              Выйти из аккаунта
            </button>
          </div>

          {message && (
            <p role="status" style={{ color: "#55d8ff", lineHeight: 1.6 }}>
              {message}
            </p>
          )}
        </section>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <section style={panelStyle}>
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

        <div
          style={{
            display: "flex",
            gap: "10px",
            margin: "28px 0",
          }}
        >
          <button
            type="button"
            style={{
              ...buttonStyle,
              flex: 1,
              background: mode === "login" ? "#39cfff" : "#101b3d",
              color: mode === "login" ? "#06111f" : "white",
            }}
            onClick={() => {
              setMode("login");
              setMessage("");
            }}
          >
            Вход
          </button>

          <button
            type="button"
            style={{
              ...buttonStyle,
              flex: 1,
              background: mode === "register" ? "#39cfff" : "#101b3d",
              color: mode === "register" ? "#06111f" : "white",
            }}
            onClick={() => {
              setMode("register");
              setMessage("");
            }}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleAuth}>
          {mode === "register" && (
            <label style={{ display: "block", marginBottom: "16px" }}>
              Имя пользователя
              <input
                style={inputStyle}
                required
                minLength={3}
                maxLength={24}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Придумай имя"
              />
            </label>
          )}

          <label style={{ display: "block", marginBottom: "16px" }}>
            Email
            <input
              style={inputStyle}
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label style={{ display: "block", marginBottom: "20px" }}>
            Пароль
            <input
              style={inputStyle}
              type="password"
              autoComplete={
                mode === "register" ? "new-password" : "current-password"
              }
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Минимум 6 символов"
            />
          </label>

          <button
            disabled={loading}
            type="submit"
            style={{ ...buttonStyle, width: "100%", opacity: loading ? 0.6 : 1 }}
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
              color: "#55d8ff",
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
