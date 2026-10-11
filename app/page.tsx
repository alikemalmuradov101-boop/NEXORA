"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/lib/supabase";

type Listing = {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  price: number | null;
  currency: string | null;
  image_url: string | null;
  status: string;
  category: string;
  created_at: string;
};

type Tab = "catalog" | "sell" | "my" | "profile" | "purchases";

const categories = [
  "Все категории",
  "Программирование",
  "Дизайн",
  "Игры",
  "NFT",
  "Аккаунты",
  "Услуги",
  "Другое",
];

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState<Tab>("catalog");
  const [listings, setListings] = useState<Listing[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Все категории");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [newCategory, setNewCategory] = useState("Программирование");

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setUser(data.session?.user ?? null);
        setReady(true);
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setReady(true);
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (ready) loadListings();
  }, [ready, user?.id]);

  async function loadListings() {
    let query = supabase
      .from("listings")
      .select(
        "id,user_id,title,description,price,currency,image_url,status,category,created_at"
      )
      .order("created_at", { ascending: false });

    if (user) {
      query = query.or(
        `status.eq.approved,user_id.eq.${user.id}`
      );
    } else {
      query = query.eq("status", "approved");
    }

    const { data, error } = await query;

    if (error) {
      setMessage("Не удалось загрузить объявления: " + error.message);
      return;
    }

    setListings((data ?? []) as Listing[]);
  }

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      if (authMode === "register") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        if (data.session) {
          setMessage("Регистрация успешна!");
        } else {
          setMessage(
            "Проверь почту и подтверди регистрацию по ссылке из письма."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        setMessage("Вход выполнен!");
      }
    } catch (error: any) {
      setMessage(error.message || "Произошла ошибка.");
    } finally {
      setBusy(false);
    }
  }

  async function createListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!user) {
      setMessage("Сначала войди в аккаунт.");
      return;
    }

    if (!title.trim() || !price || Number(price) < 0) {
      setMessage("Укажи название и корректную цену.");
      return;
    }

    setBusy(true);

    try {
      const { error } = await supabase.from("listings").insert({
        user_id: user.id,
        title: title.trim(),
        description: description.trim(),
        price: Number(price),
        currency: "KZT",
        image_url: imageUrl.trim() || null,
        category: newCategory,
        status: "pending",
      });

      if (error) throw error;

      setTitle("");
      setDescription("");
      setPrice("");
      setImageUrl("");
      setMessage("Объявление отправлено на модерацию!");
      setTab("my");
      await loadListings();
    } catch (error: any) {
      setMessage("Не удалось создать объявление: " + error.message);
    } finally {
      setBusy(false);
    }
  }

  async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setMessage(error.message);
      return;
    }

    setTab("catalog");
    setMessage("Ты вышел из аккаунта.");
  }

  const visibleListings = useMemo(() => {
    return listings.filter((item) => {
      const matchesCategory =
        category === "Все категории" || item.category === category;

      const text = `${item.title} ${item.description ?? ""} ${item.category}`
        .toLowerCase();

      return matchesCategory && text.includes(search.toLowerCase());
    });
  }, [listings, search, category]);

  const myListings = listings.filter((item) => item.user_id === user?.id);

  if (!ready) {
    return (
      <main className="page">
        <div className="panel">Загрузка NEXORA...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="page auth-page">
        <header className="topbar">
          <a className="logo" href="/">NEXORA<span>.</span></a>
          <span className="muted">Маркетплейс цифровых товаров</span>
        </header>

        <section className="auth-card">
          <div className="eyebrow">ТВОЙ ЦИФРОВОЙ МИР</div>
          <h1>{authMode === "login" ? "С возвращением" : "Создай аккаунт"}</h1>
          <p className="muted">
            {authMode === "login"
              ? "Войди, чтобы размещать объявления и управлять профилем."
              : "Зарегистрируйся, чтобы пользоваться NEXORA."}
          </p>

          <form onSubmit={handleAuth} className="form">
            <label>
              Электронная почта
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </label>
            <label>
              Пароль
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Не менее 6 символов"
                minLength={6}
                required
              />
            </label>
            <button className="primary" disabled={busy}>
              {busy
                ? "Подожди..."
                : authMode === "login"
                  ? "Войти"
                  : "Зарегистрироваться"}
            </button>
          </form>

          <p className="switch-auth">
            {authMode === "login" ? "Нет аккаунта?" : "Уже есть аккаунт?"}{" "}
            <button
              className="text-button"
              onClick={() => {
                setAuthMode(authMode === "login" ? "register" : "login");
                setMessage("");
              }}
            >
              {authMode === "login" ? "Создать" : "Войти"}
            </button>
          </p>
          {message && <p className="notice">{message}</p>}
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <header className="topbar">
        <a className="logo" href="/">NEXORA<span>.</span></a>
        <div className="user-chip">{user.email}</div>
      </header>

      <section className="hero">
        <div className="eyebrow">ЦИФРОВОЙ МАРКЕТПЛЕЙС</div>
        <h1>Твой мир. <span>Твои правила.</span></h1>
        <p>Находи цифровые товары и размещай собственные объявления.</p>
      </section>

      <nav className="nav">
        {([
          ["catalog", "Каталог"],
          ["sell", "＋ Продать"],
          ["my", "Мои объявления"],
          ["profile", "Профиль"],
          ["purchases", "Мои покупки"],
        ] as [Tab, string][]).map(([key, label]) => (
          <button
            key={key}
            className={`nav-item ${tab === key ? "active" : ""}`}
            onClick={() => {
              setTab(key);
              setMessage("");
            }}
          >
            {label}
          </button>
        ))}
      </nav>

      {message && (
        <div className="notice">
          {message}
          <button className="close" onClick={() => setMessage("")}>×</button>
        </div>
      )}

      {tab === "catalog" && (
        <section>
          <div className="section-head">
            <div>
              <div className="eyebrow">ОТКРЫВАЙ НОВОЕ</div>
              <h2>Каталог объявлений</h2>
            </div>
            <button className="primary small" onClick={() => setTab("sell")}>
              ＋ Разместить
            </button>
          </div>

          <input
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию и описанию..."
          />

          <div className="filters">
            {categories.map((item) => (
              <button
                key={item}
                className={`filter ${category === item ? "selected" : ""}`}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          {visibleListings.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">◇</div>
              <h3>Пока нет объявлений</h3>
              <p>Попробуй другой поиск или размести первое объявление.</p>
              <button className="primary" onClick={() => setTab("sell")}>
                Создать объявление
              </button>
            </div>
          ) : (
            <div className="grid">
              {visibleListings
                .filter((item) => item.status === "approved")
                .map((item) => (
                  <article className="listing-card" key={item.id}>
                    {item.image_url ? (
                      <img
                        className="listing-image"
                        src={item.image_url}
                        alt={item.title}
                      />
                    ) : (
                      <div className="listing-placeholder">NEXORA</div>
                    )}
                    <div className="listing-content">
                      <span className="category-tag">{item.category}</span>
                      <h3>{item.title}</h3>
                      <p className="description">
                        {item.description || "Описание не добавлено."}
                      </p>
                      <div className="price">
                        {item.price ?? 0} {item.currency || "KZT"}
                      </div>
                    </div>
                  </article>
                ))}
            </div>
          )}
        </section>
      )}

      {tab === "sell" && (
        <section className="panel content-panel">
          <div className="eyebrow">НОВОЕ ОБЪЯВЛЕНИЕ</div>
          <h2>Что ты продаёшь?</h2>
          <p className="muted">
            Заполни информацию. Объявление появится в каталоге после модерации.
          </p>

          <form className="form" onSubmit={createListing}>
            <label>
              Название
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например, разработка Telegram-бота"
                maxLength={100}
                required
              />
            </label>

            <label>
              Категория
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              >
                {categories.filter((c) => c !== "Все категории").map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </label>

            <label>
              Описание
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Расскажи о товаре или услуге..."
                rows={5}
                maxLength={3000}
              />
            </label>

            <label>
              Цена в тенге (KZT)
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="5000"
                min="0"
                step="1"
                required
              />
            </label>

            <label>
              Ссылка на изображение (необязательно)
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </label>

            <button className="primary" disabled={busy}>
              {busy ? "Отправка..." : "Отправить на модерацию"}
            </button>
          </form>
        </section>
      )}

      {tab === "my" && (
        <section>
          <div className="eyebrow">ТВОИ ТОВАРЫ</div>
          <h2>Мои объявления</h2>
          {myListings.length === 0 ? (
            <div className="empty">
              <h3>У тебя пока нет объявлений</h3>
              <p>Создай первое и оно появится здесь.</p>
              <button className="primary" onClick={() => setTab("sell")}>
                ＋ Создать объявление
              </button>
            </div>
          ) : (
            <div className="grid">
              {myListings.map((item) => (
                <article className="listing-card" key={item.id}>
                  {item.image_url ? (
                    <img className="listing-image" src={item.image_url} alt={item.title} />
                  ) : (
                    <div className="listing-placeholder">NEXORA</div>
                  )}
                  <div className="listing-content">
                    <span className={`status ${item.status}`}>
                      {item.status === "approved"
                        ? "Одобрено"
                        : item.status === "rejected"
                          ? "Отклонено"
                          : "На модерации"}
                    </span>
                    <h3>{item.title}</h3>
                    <p className="description">{item.description}</p>
                    <div className="price">{item.price ?? 0} {item.currency || "KZT"}</div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "profile" && (
        <section className="panel content-panel">
          <div className="eyebrow">ЛИЧНЫЙ КАБИНЕТ</div>
          <h2>Твой профиль</h2>
          <div className="profile-row">
            <div className="avatar">
              {(user.email?.[0] || "N").toUpperCase()}
            </div>
            <div>
              <h3>{user.email?.split("@")[0] || "Пользователь"}</h3>
              <p className="muted">{user.email}</p>
            </div>
          </div>
          <div className="detail">
            <span>Email</span>
            <strong>{user.email}</strong>
          </div>
          <div className="detail">
            <span>ID аккаунта</span>
            <strong className="id-text">{user.id}</strong>
          </div>
          <div className="detail">
            <span>Мои объявления</span>
            <strong>{myListings.length}</strong>
          </div>
          <button className="danger" onClick={logout}>Выйти из аккаунта</button>
        </section>
      )}

      {tab === "purchases" && (
        <section className="empty">
          <div className="empty-icon">◇</div>
          <h2>Мои покупки</h2>
          <p>Раздел покупок подключим следующим этапом.</p>
          <button className="secondary" onClick={() => setTab("catalog")}>
            Вернуться в каталог
          </button>
        </section>
      )}

      <footer>
        <a className="logo" href="/">NEXORA<span>.</span></a>
        <p>Твой мир. Твои правила.</p>
      </footer>

      <style jsx global>{`
        * { box-sizing: border-box; }
        body {
          margin: 0;
          background: #080a12;
          color: #f5f6ff;
          font-family: Arial, Helvetica, sans-serif;
        }
        button, input, textarea, select { font: inherit; }
        button { cursor: pointer; }
        button:disabled { opacity: .6; cursor: wait; }
        .page {
          width: min(1120px, 100%);
          margin: 0 auto;
          padding: 24px;
          min-height: 100vh;
        }
        .topbar {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; padding: 8px 0 24px;
          border-bottom: 1px solid #222536;
        }
        .logo {
          color: #f7f7ff; font-size: 25px; font-weight: 900;
          letter-spacing: 2px; text-decoration: none;
        }
        .logo span, .hero h1 span { color: #9c78ff; }
        .muted { color: #9ba1b8; line-height: 1.6; }
        .user-chip {
          max-width: 60%; overflow: hidden; text-overflow: ellipsis;
          color: #c8c9d8; font-size: 13px;
        }
        .hero { padding: 44px 0 30px; }
        .eyebrow {
          color: #a88cff; font-size: 11px; font-weight: 800;
          letter-spacing: 2px; margin-bottom: 12px;
        }
        h1 { font-size: clamp(30px, 5vw, 48px); margin: 0 0 12px; }
        h2 { font-size: clamp(23px, 4vw, 32px); margin: 0 0 12px; }
        h3 { margin: 12px 0; font-size: 18px; }
        .hero p { color: #a8adc0; line-height: 1.6; }
        .nav {
          display: flex; gap: 8px; overflow-x: auto;
          padding: 12px 0 24px; margin-bottom: 18px;
          border-bottom: 1px solid #222536;
        }
        .nav-item, .filter, .secondary {
          color: #b9bed0; background: #111421;
          border: 1px solid #292d40; border-radius: 12px;
          padding: 11px 15px; white-space: nowrap;
        }
        .nav-item.active, .filter.selected {
          color: white; border-color: #8e6bff; background: #241b42;
        }
        .section-head {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; margin: 12px 0 22px;
        }
        .primary {
          color: white; background: linear-gradient(135deg, #7957ef, #a45cf2);
          border: 0; border-radius: 12px; padding: 14px 18px;
          font-weight: 700;
        }
        .primary.small { padding: 11px 14px; }
        .search, input, textarea, select {
          width: 100%; color: white; background: #101320;
          border: 1px solid #2b3045; border-radius: 12px;
          padding: 13px 14px; outline: none;
        }
        input:focus, textarea:focus, select:focus {
          border-color: #9878ff;
        }
        .search { margin-bottom: 14px; }
        .filters { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
        .filter { padding: 9px 12px; font-size: 13px; }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 16px; margin-top: 22px;
        }
        .listing-card, .panel, .auth-card {
          border: 1px solid #282c40; background: #101320;
          border-radius: 18px; overflow: hidden;
        }
        .listing-card { min-width: 0; }
        .listing-image, .listing-placeholder {
          width: 100%; height: 180px; object-fit: cover;
          
          background: linear-gradient(135deg, #211b40, #12182b);
        }
        .listing-placeholder {
          display: grid;
          place-items: center;
          color: #9274e8;
          font-size: 24px;
          font-weight: 900;
          letter-spacing: 4px;
        }
        .listing-content { padding: 17px; }
        .category-tag {
          display: inline-block;
          color: #c3adff;
          background: #241b42;
          border-radius: 8px;
          padding: 5px 8px;
          font-size: 11px;
        }
        .description {
          color: #a5abc0;
          line-height: 1.5;
          font-size: 14px;
          overflow-wrap: anywhere;
          white-space: pre-wrap;
        }
        .price {
          color: #c1a9ff;
          font-weight: 800;
          font-size: 19px;
          margin-top: 16px;
        }
        .empty {
          text-align: center;
          border: 1px dashed #343951;
          background: #0e111c;
          border-radius: 18px;
          padding: 42px 20px;
          margin: 18px 0;
        }
        .empty p {
          color: #9ba1b8;
          line-height: 1.6;
        }
        .empty-icon {
          color: #a88cff;
          font-size: 38px;
          margin-bottom: 12px;
        }
        .content-panel {
          padding: 24px;
          max-width: 700px;
          margin: 10px auto;
        }
        .form {
          display: grid;
          gap: 17px;
          margin-top: 22px;
        }
        .form label {
          display: grid;
          gap: 8px;
          color: #d9dbea;
          font-size: 14px;
        }
        textarea { resize: vertical; }
        select option { background: #101320; }
        .notice {
          position: relative;
          padding: 14px 42px 14px 15px;
          margin: 18px 0;
          color: #ded6ff;
          background: #211b3b;
          border: 1px solid #514079;
          border-radius: 12px;
          overflow-wrap: anywhere;
          line-height: 1.5;
        }
        .close {
          position: absolute;
          right: 12px;
          top: 8px;
          background: none;
          border: 0;
          color: white;
          font-size: 23px;
        }
        .status {
          display: inline-block;
          border-radius: 8px;
          padding: 6px 9px;
          font-size: 12px;
          background: #332b16;
          color: #ffd780;
        }
        .status.approved {
          background: #163528;
          color: #8ae4b2;
        }
        .status.rejected {
          background: #3b2028;
          color: #ff9ba9;
        }
        .profile-row {
          display: flex;
          gap: 14px;
          align-items: center;
          margin: 24px 0;
        }
        .avatar {
          display: grid;
          place-items: center;
          flex: 0 0 54px;
          height: 54px;
          border-radius: 16px;
          background: #30214f;
          color: #d5c5ff;
          font-size: 24px;
          font-weight: 800;
        }
        .detail {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          border-top: 1px solid #292d40;
          padding: 15px 0;
          color: #9ba1b8;
          font-size: 14px;
        }
        .detail strong {
          color: #f5f6ff;
          text-align: right;
          overflow-wrap: anywhere;
        }
        .id-text {
          font-size: 11px;
          max-width: 65%;
        }
        .danger {
          width: 100%;
          margin-top: 22px;
          padding: 13px;
          color: #ffb2bd;
          background: #351c27;
          border: 1px solid #633040;
          border-radius: 12px;
        }
        .auth-page {
          display: flex;
          flex-direction: column;
        }
        .auth-card {
          max-width: 460px;
          width: 100%;
          padding: 28px;
          margin: 55px auto;
        }
        .auth-card h1 { font-size: 30px; }
        .switch-auth {
          color: #aab0c2;
          text-align: center;
          margin-top: 22px;
        }
        .text-button {
          color: #c0a8ff;
          background: none;
          border: 0;
          font-weight: 700;
        }
        footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-top: 60px;
          padding: 24px 0;
          border-top: 1px solid #222536;
          color: #888fa6;
          font-size: 13px;
        }
        @media (max-width: 560px) {
          .page { padding: 16px; }
          .hero { padding-top: 32px; }
          .section-head { align-items: flex-start; }
          .content-panel, .auth-card { padding: 20px; }
          .detail {
            flex-direction: column;
            gap: 7px;
          }
          .detail strong {
            text-align: left;
            max-width: 100%;
          }
          footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}

