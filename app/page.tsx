
"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "../lib/supabase";

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

type Tab = "catalog" | "sell" | "my" | "profile" | "purchases" | "admin";

const OWNER_ID = "74cdb23e-f5b0-4b41-a18a-55f222d39810";

const categories = [
  "Программирование",
  "Дизайн",
  "Игры",
  "NFT",
  "Аккаунты",
  "Услуги",
  "Другое",
];

const money = (price: number | null) =>
  new Intl.NumberFormat("ru-RU").format(price ?? 0) + " KZT";

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [ready, setReady] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
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
  const [price, setPrice] = useState("5000");
  const [imageUrl, setImageUrl] = useState("");
  const [newCategory, setNewCategory] = useState("Программирование");

  const [adminListings, setAdminListings] = useState<Listing[]>([]);
  const [adminLoading, setAdminLoading] = useState(false);

  const loadListings = useCallback(async () => {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Не удалось загрузить объявления: " + error.message);
      return;
    }

    setListings((data ?? []) as Listing[]);
  }, []);

  const checkOwner = useCallback(async (currentUser: any) => {
    if (!currentUser) {
      setIsOwner(false);
      return;
    }

    // Проверяем роль в защищённой таблице, а не только ID в интерфейсе.
    const { data, error } = await supabase.rpc("is_nexora_owner");

    setIsOwner(
      !error &&
      data === true &&
      currentUser.id === OWNER_ID
    );
  }, []);

  const loadAdminListings = useCallback(async () => {
    setAdminLoading(true);

    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage("Не удалось загрузить очередь модерации. Проверь политики RLS.");
    } else {
      setAdminListings((data ?? []) as Listing[]);
    }

    setAdminLoading(false);
  }, []);

  useEffect(() => {
    let active = true;

    async function initialize() {
      const { data } = await supabase.auth.getSession();
      if (!active) return;

      const currentUser = data.session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const { data: ownerResult, error } =
          await supabase.rpc("is_nexora_owner");

        if (active) {
          setIsOwner(
            !error &&
            ownerResult === true &&
            currentUser.id === OWNER_ID
          );
        }
      } else {
        setIsOwner(false);
      }

      if (active) {
        await loadListings();
        setReady(true);
      }
    }

    void initialize();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (!currentUser) {
          setIsOwner(false);
          setAdminListings([]);
          setTab("catalog");
        }

        // Проверку роли выполняем после изменения состояния сессии.
        if (currentUser) {
          setTimeout(() => {
            void checkOwner(currentUser);
          }, 0);
        }

        void loadListings();
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, [loadListings, checkOwner]);

  useEffect(() => {
    if (tab === "admin" && isOwner) {
      void loadAdminListings();
    }
  }, [tab, isOwner, loadAdminListings]);

  const visibleListings = useMemo(() => {
    return listings.filter((item) => {
      if (item.status !== "approved" && item.user_id !== user?.id) {
        return false;
      }

      const query = search.toLowerCase().trim();
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        (item.description ?? "").toLowerCase().includes(query);

      const matchesCategory =
        category === "Все категории" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [listings, search, category, user]);

  const myListings = useMemo(
    () => listings.filter((item) => item.user_id === user?.id),
    [listings, user]
  );

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const result =
        authMode === "register"
          ? await supabase.auth.signUp({ email, password })
          : await supabase.auth.signInWithPassword({ email, password });

      if (result.error) throw result.error;

      if (authMode === "register" && !result.data.session) {
        setMessage("Регистрация создана. Проверь почту, если требуется подтверждение.");
      } else {
        setMessage("Вход выполнен.");
        setUser(result.data.user);
        await checkOwner(result.data.user);
        await loadListings();
      }
    } catch (error: any) {
      setMessage(error.message ?? "Не удалось выполнить вход.");
    } finally {
      setBusy(false);
    }
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setMessage(error.message);
      return;
    }

    setUser(null);
    setIsOwner(false);
    setTab("catalog");
    setMessage("Ты вышел из аккаунта.");
  }

  async function createListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!user) {
      setMessage("Сначала войди в аккаунт.");
      setTab("profile");
      return;
    }

    if (!title.trim() || !description.trim() || Number(price) < 0) {
      setMessage("Заполни название, описание и корректную цену.");
      return;
    }

    setBusy(true);
    setMessage("");

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

    setBusy(false);

    if (error) {
      setMessage("Не удалось отправить объявление: " + error.message);
      return;
    }

    setTitle("");
    setDescription("");
    setPrice("5000");
    setImageUrl("");
    setMessage("Объявление отправлено на модерацию!");
    await loadListings();
    setTab("my");
  }

  async function moderateListing(id: string, status: "approved" | "rejected") {
    if (!isOwner || user?.id !== OWNER_ID) {
      setMessage("Нет прав основателя.");
      return;
    }

    setBusy(true);
    setMessage("");

    const { error } = await supabase
      .from("listings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("status", "pending");

    setBusy(false);

    if (error) {
      setMessage("Не удалось изменить статус. Проверь RLS: " + error.message);
      return;
    }

    setMessage(
      status === "approved"
        ? "Объявление опубликовано."
        : "Объявление отклонено."
    );

    await Promise.all([loadListings(), loadAdminListings()]);
  }

  function navigate(next: Tab) {
    if (next === "admin" && !isOwner) {
      setMessage("Раздел доступен только основателю.");
      return;
    }

    setMessage("");
    setTab(next);
  }

  if (!ready) {
    return (
      <main className="loading">
        <div className="logo-mark">N</div>
        <h1>NEXORA</h1>
        <p>Загружаем твой цифровой мир...</p>
        <style jsx>{`
          .loading { min-height:100vh; display:grid; place-content:center;
            justify-items:center; background:#0b0b12; color:white; }
          .logo-mark { display:grid; place-items:center; width:64px;height:64px;
            border-radius:20px;background:linear-gradient(135deg,#8b5cf6,#ec4899);
            font-size:32px;font-weight:900; }
          h1 { letter-spacing:7px; }
          p { color:#9996ad; }
        `}</style>
      </main>
    );
  }

  return (
    <main className="site">
      <header className="topbar">
        <button className="brand" onClick={() => navigate("catalog")}>
          <span className="brand-icon">N</span>
          <span>NEXORA<span className="brand-dot">.</span></span>
        </button>

        <nav className="desktop-nav">
          <button className={tab === "catalog" ? "active" : ""} onClick={() => navigate("catalog")}>Каталог</button>
          <button className={tab === "sell" ? "active" : ""} onClick={() => navigate("sell")}>＋ Продать</button>
          <button className={tab === "my" ? "active" : ""} onClick={() => navigate("my")}>Мои объявления</button>
          <button className={tab === "purchases" ? "active" : ""} onClick={() => navigate("purchases")}>Покупки</button>
          {isOwner && (
            <button className="owner-nav" onClick={() => navigate("admin")}>
              ◈ OWNER
            </button>
          )}
        </nav>

        <button className="profile-button" onClick={() => navigate("profile")}>
          {user ? "Мой профиль" : "Войти"}
        </button>
      </header>

      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="eyebrow"><span className="pulse" /> ЦИФРОВОЙ МАРКЕТПЛЕЙС</div>
          <h1>Твой мир.<br /><span>Твои правила.</span></h1>
          <p>Находи цифровые товары, открывай возможности<br className="desktop-only" /> и размещай собственные объявления.</p>
          <div className="hero-actions">
            <button className="primary" onClick={() => navigate("catalog")}>Открыть каталог ↗</button>
            <button className="secondary" onClick={() => navigate("sell")}>＋ Разместить объявление</button>
          </div>
          <div className="hero-stats">
            <div><strong>{listings.filter(x => x.status === "approved").length}</strong><span>Товаров в каталоге</span></div>
            <div><strong>{categories.length}</strong><span>Категорий</span></div>
            <div><strong>24/7</strong><span>Цифровой мир</span></div>
          </div>
        </div>
        <div className="hero-art" aria-hidden="true">
          <div className="orb orb-one" />
          <div className="orb orb-two" />
          <div className="orb-core">N</div>
          <div className="floating-card card-one">✦ <span>Digital goods</span></div>
          <div className="floating-card card-two">⌘ <span>Build something</span></div>
        </div>
      </section>

      {message && (
        <div className="notice">
          <span>{message}</span>
          <button onClick={() => setMessage("")}>×</button>
        </div>
      )}

      <section className="content">
        {tab === "catalog" && (
          <>
            <div className="section-heading">
              <div><div className="eyebrow">ОТКРЫВАЙ НОВОЕ</div><h2>Каталог объявлений</h2><p>Найди то, что ищешь.</p></div>
              <button className="primary" onClick={() => navigate("sell")}>＋ Разместить</button>
            </div>

            <div className="filters">
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="⌕  Поиск по названию и описанию..." />
              <select value={category} onChange={e => setCategory(e.target.value)}>
                <option>Все категории</option>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            {visibleListings.filter(x => x.status === "approved").length === 0 ? (
              <div className="empty">
                <div className="empty-icon">◇</div>
                <h3>Пока нет объявлений</h3>
                <p>Попробуй другой поиск или размести первое объявление.</p>
                <button className="secondary" onClick={() => navigate("sell")}>＋ Создать объявление</button>
              </div>
            ) : (
              <div className="listing-grid">
                {visibleListings.filter(x => x.status === "approved").map(item => (
                  <article className="listing-card" key={item.id}>
                    {item.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="listing-image" src={item.image_url} alt={item.title} />
                    ) : <div className="listing-placeholder">NEXORA<span>✦</span></div>}
                    <div className="listing-body">
                      <span className="tag">{item.category}</span>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                      <div className="listing-footer"><strong>{money(item.price)}</strong><span>Цифровой товар</span></div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}

        {tab === "sell" && (
          <div className="form-panel">
            <div className="eyebrow">ТВОЯ ВОЗМОЖНОСТЬ</div>
            <h2>Новое объявление</h2>
            <p>Заполни информацию. Объявление появится в каталоге после модерации.</p>
            {!user ? (
              <div className="empty"><h3>Нужно войти</h3><button className="primary" onClick={() => navigate("profile")}>Войти в аккаунт</button></div>
            ) : (
              <form onSubmit={createListing}>
                <label>Название<input required maxLength={120} value={title} onChange={e => setTitle(e.target.value)} placeholder="Например, разработка Telegram-бота" /></label>
                <label>Категория<select value={newCategory} onChange={e => setNewCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
                <label>Описание<textarea required maxLength={5000} rows={5} value={description} onChange={e => setDescription(e.target.value)} placeholder="Расскажи о товаре или услуге..." /></label>
                <label>Цена в тенге (KZT)<input required type="number" min="0" step="1" value={price} onChange={e => setPrice(e.target.value)} /></label>
                <label>Ссылка на изображение (необязательно)<input type="url" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://example.com/image.jpg" /></label>
                <button className="primary full" disabled={busy}>{busy ? "Отправка..." : "Отправить на модерацию →"}</button>
              </form>
            )}
          </div>
        )}

        {tab === "my" && (
          <>
            <div className="section-heading"><div><div className="eyebrow">ТВОИ ТОВАРЫ</div><h2>Мои объявления</h2></div><button className="primary" onClick={() => navigate("sell")}>＋ Создать</button></div>
            {!user ? <div className="empty"><h3>Войди в аккаунт</h3><button className="primary" onClick={() => navigate("profile")}>Войти</button></div> :
              myListings.length === 0 ? <div className="empty"><div className="empty-icon">◇</div><h3>У тебя пока нет объявлений</h3><button className="secondary" onClick={() => navigate("sell")}>Создать первое</button></div> :
              <div className="listing-grid">{myListings.map(item => <article className="listing-card" key={item.id}><div className="listing-placeholder">{item.category}<span>✦</span></div><div className="listing-body"><span className={"status " + item.status}>{item.status === "pending" ? "На модерации" : item.status === "approved" ? "Опубликовано" : "Отклонено"}</span><h3>{item.title}</h3><p>{item.description}</p><div className="listing-footer"><strong>{money(item.price)}</strong><span>{item.category}</span></div></div></article>)}</div>}
          </>
        )}

        {tab === "profile" && (
          <div className="form-panel">
            <div className="eyebrow">ТВОЙ АККАУНТ</div>
            <h2>{user ? "Профиль" : authMode === "login" ? "С возвращением" : "Создай аккаунт"}</h2>
            {!user ? (
              <>
                <p>{authMode === "login" ? "Войди в свой цифровой мир." : "Присоединяйся к NEXORA."}</p>
                <form onSubmit={handleAuth}>
                  <label>Email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
                  <label>Пароль<input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Не менее 6 символов" autoComplete={authMode === "login" ? "current-password" : "new-password"} /></label>
                  <button className="primary full" disabled={busy}>{busy ? "Подожди..." : authMode === "login" ? "Войти →" : "Зарегистрироваться →"}</button>
                </form>
                <button className="text-button" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>{authMode === "login" ? "Нет аккаунта? Регистрация" : "Уже есть аккаунт? Войти"}</button>
              </>
            ) : (
              <div className="account-card">
                <div className="avatar">{isOwner ? "N" : (user.email?.[0] ?? "U").toUpperCase()}</div>
                <h3>{isOwner ? "Основатель NEXORA" : "Пользователь NEXORA"}</h3>
                <p>{user.email}</p>
                {isOwner && <span className="owner-badge">✦ OWNER</span>}
                <button className="secondary full" onClick={() => navigate("my")}>Мои объявления</button>
                {isOwner && <button className="primary full" onClick={() => navigate("admin")}>Открыть панель OWNER ↗</button>}
                <button className="text-button" onClick={handleLogout}>Выйти из аккаунта</button>
              </div>
            )}
          </div>
        )}

        {tab === "purchases" && (
          <div className="empty"><div className="empty-icon">◇</div><h3>Мои покупки</h3><p>Покупки появятся здесь после подключения безопасной системы заказов и оплаты.</p></div>
        )}

        {tab === "admin" && (
          !isOwner || user?.id !== OWNER_ID ? (
            <div className="empty"><h3>Доступ запрещён</h3><p>Эта страница предназначена только для основателя.</p><button className="secondary" onClick={() => navigate("catalog")}>В каталог</button></div>
          ) : (
            <>
              <div className="owner-header">
                <div className="eyebrow">NEXORA CONTROL CENTER</div>
                <h2>Панель основателя <span className="owner-badge">✦ OWNER</span></h2>
                <p>Управление маркетплейсом и модерация объявлений.</p>
              </div>
              <div className="admin-stats">
                <div><span>Всего объявлений</span><strong>{listings.length}</strong></div>
                <div><span>На модерации</span><strong>{adminListings.length}</strong></div>
                <div><span>Опубликовано</span><strong>{listings.filter(x => x.status === "approved").length}</strong></div>
              </div>
              <div className="section-heading"><div><h2>Очередь модерации</h2><p>Проверь объявление перед публикацией.</p></div><button className="secondary" onClick={() => void loadAdminListings()}>↻ Обновить</button></div>

          {adminLoading ? (
            <div className="empty">Загружаем объявления...</div>
          ) : adminListings.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">✓</div>
              <h3>Очередь пуста</h3>
              <p>Новых объявлений на модерацию пока нет.</p>
            </div>
          ) : (
            <div className="listing-grid">
              {adminListings.map((item) => (
                <article className="listing-card" key={item.id}>
                  {item.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      className="listing-image"
                      src={item.image_url}
                      alt={item.title}
                    />
                  ) : (
                    <div className="listing-placeholder">
                      NEXORA<span>✦</span>
                    </div>
                  )}

                  <div className="listing-body">
                    <span className="status pending">На модерации</span>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <div className="listing-footer">
                      <strong>{money(item.price)}</strong>
                      <span>{item.category}</span>
                    </div>

                    <div className="admin-actions">
                      <button
                        className="primary"
                        disabled={busy}
                        onClick={() => void moderateListing(item.id, "approved")}
                      >
                        ✓ Опубликовать
                      </button>
                      <button
                        className="danger"
                        disabled={busy}
                        onClick={() => void moderateListing(item.id, "rejected")}
                      >
                        ✕ Отклонить
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )
    )}
  </section>

  <footer className="footer">
    <div className="brand"><span className="brand-icon">N</span> NEXORA.</div>
    <p>Твой мир. Твои правила.</p>
    <span>© {new Date().getFullYear()} NEXORA</span>
  </footer>

  <nav className="mobile-nav">
    <button onClick={() => navigate("catalog")}>⌂<span>Каталог</span></button>
    <button onClick={() => navigate("sell")}>＋<span>Продать</span></button>
    <button onClick={() => navigate("my")}>▤<span>Мои товары</span></button>
    <button onClick={() => navigate("profile")}>◎<span>Профиль</span></button>
    {isOwner && <button onClick={() => navigate("admin")}>◈<span>OWNER</span></button>}
  </nav>

  <style jsx>{`
    * { box-sizing: border-box; }
    .site { min-height: 100vh; background: #0b0b12; color: #f7f5ff; }
    .topbar { height: 76px; display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 0 5%; border-bottom: 1px solid #242236; background: rgba(11,11,18,.95); position: sticky; top: 0; z-index: 10; }
    button, input, textarea, select { font: inherit; }
    button { cursor: pointer; }
    button:disabled { opacity: .6; cursor: not-allowed; }
    .brand { display: flex; align-items: center; gap: 10px; border: 0; background: transparent; color: white; font-weight: 900; letter-spacing: 2px; }
    .brand-icon, .logo-mark { display: grid; place-items: center; width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg,#8b5cf6,#ec4899); color: white; font-weight: 900; }
    .brand-dot { color: #c4a7ff; }
    .desktop-nav { display: flex; align-items: center; gap: 8px; }
    .desktop-nav button, .profile-button { border: 1px solid transparent; background: transparent; color: #aaa6bd; padding: 10px 13px; border-radius: 12px; }
    .desktop-nav button:hover, .desktop-nav button.active { background: #1b1829; color: white; }
    .desktop-nav .owner-nav, .owner-badge { color: #d9c5ff; border: 1px solid #6c4bb5; background: #25183d; border-radius: 10px; padding: 8px 12px; }
    .profile-button { background: #211b35; color: white; border-color: #44345f; }
    .hero { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 40px; min-height: 510px; padding: 70px 8%; overflow: hidden; background: radial-gradient(ellipse at 15% 20%,#251545 0,transparent 45%), radial-gradient(ellipse at 90% 70%,#172647 0,transparent 42%),#0b0b12; }
    .hero-content { position: relative; z-index: 1; max-width: 650px; }
    .eyebrow { color: #b99aff; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; }
    .pulse { display: inline-block; width: 7px; height: 7px; margin-right: 8px; border-radius: 50%; background: #a78bfa; box-shadow: 0 0 12px #a78bfa; }
    .hero h1 { margin: 22px 0; font-size: clamp(40px,6vw,70px); line-height: 1.05; letter-spacing: -2px; }
    .hero h1 span { color: #b69aff; }
    .hero p, .section-heading p, .form-panel > p, .owner-header p { color: #aaa6bd; line-height: 1.7; }
    .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
    .primary, .secondary, .danger { border: 0; border-radius: 12px; padding: 12px 17px; font-weight: 750; transition: transform .2s, opacity .2s; }
    .primary:hover, .secondary:hover, .danger:hover { transform: translateY(-1px); }
    .primary { background: linear-gradient(135deg,#8b5cf6,#6d4aff); color: white; }
    .secondary { border: 1px solid #39334f; background: #171522; color: #eee9ff; }
    .danger { background: #4b1e30; border: 1px solid #8d3453; color: #ffc3d5; }
    .hero-stats { display: flex; flex-wrap: wrap; gap: 36px; margin-top: 42px; }
    .hero-stats div, .admin-stats div { display: grid; gap: 5px; }
    .hero-stats strong { font-size: 22px; }
    .hero-stats span, .admin-stats span { color: #9994ad; font-size: 12px; }
    .hero-art { position: relative; width: 320px; height: 320px; flex-shrink: 0; }
    .orb { position: absolute; border: 1px solid #7d5bd8; border-radius: 50%; inset: 15px; box-shadow: 0 0 50px #6239a533; }
    .orb-two { inset: 48px; border-color: #4373c8; transform: rotate(45deg) scaleX(.7); }
    .orb-core { position: absolute; inset: 95px; display: grid; place-items: center; border-radius: 32px; background: linear-gradient(135deg,#8b5cf6,#ec4899); font-size: 70px; font-weight: 950; box-shadow: 0 0 70px #8b5cf655; }
    .floating-card { position: absolute; padding: 12px 16px; border: 1px solid #3a3155; border-radius: 13px; background: #171522; color: #b99aff; box-shadow: 0 10px 35px #0005; }
    .floating-card span { color: white; font-size: 12px; }
    .card-one { top: 30px; right: -20px; }
    .card-two { bottom: 35px; left: -30px; }
    .notice { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin: 20px auto 0; padding: 13px 18px; max-width: 1100px; border: 1px solid #51416d; border-radius: 12px; background: #1b1729; color: #e8ddff; }
    .notice button { border: 0; background: transparent; color: white; font-size: 22px; }
    .content { max-width: 1200px; min-height: 300px; margin: auto; padding: 60px 5% 90px; }
    .section-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; margin-bottom: 25px; }
    h2 { margin: 10px 0; font-size: clamp(25px,3vw,34px); }
    .filters { display: flex; gap: 12px; margin: 25px 0; }
    input, textarea, select { width: 100%; padding: 13px 14px; border: 1px solid #302b43; border-radius: 11px; outline: none; background: #12111b; color: white; }
    input:focus, textarea:focus, select:focus { border-color: #8b5cf6; }
    .filters input { flex: 1; }
    .filters select { max-width: 230px; }
    .empty { display: grid; justify-items: center; gap: 12px; padding: 60px 20px; border: 1px dashed #302b43; border-radius: 18px; text-align: center; }
    .empty h3, .empty p { margin: 0; }
    .empty p { color: #9994ad; }
    .empty-icon { color: #a78bfa; font-size: 40px; }
    .listing-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 20px; }
    .listing-card { overflow: hidden; border: 1px solid #2d2840; border-radius: 18px; background: #12111b; }
    .listing-card:hover { border-color: #6750a4; }
    .listing-image, .listing-placeholder { display: grid; width: 100%; height: 180px; object-fit: cover; place-items: center; background: linear-gradient(135deg,#211b40,#12182b); }
    .listing-placeholder { color: #b99aff; font-size: 24px; font-weight: 900; letter-spacing: 4px; }
    .listing-placeholder span { margin-left: 5px; color: #ec4899; }
    .listing-body { padding: 18px; }
    .tag, .status { display: inline-block; padding: 5px 9px; border-radius: 7px; background: #211b35; color: #c7b3ff; font-size: 11px; }
    .status.approved { background: #153526; color: #91e9b6; }
    .status.rejected { background: #431c2b; color: #ffb1c4; }
    .status.pending { background: #332817; color: #ffd89a; }
    .listing-body h3 { margin: 12px 0 8px; overflow-wrap: anywhere; }
    .listing-body p { min-height: 42px; color: #aaa6bd; font-size: 13px; line-height: 1.6; overflow-wrap: anywhere; }
    .listing-footer { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 18px; padding-top: 14px; border-top: 1px solid #292538; }
    .listing-footer strong { color: #c9b6ff; }
    .listing-footer span { color: #89849f; font-size: 11px; }
    .form-panel { max-width: 650px; margin: 0 auto; padding: 30px; border: 1px solid #302b43; border-radius: 20px; background: #12111b; }
    .form-panel form { display: grid; gap: 18px; margin-top: 25px; }
    label { display: grid; gap: 8px; color: #d7d2e8; font-size: 13px; font-weight: 700; }
    .full { width: 100%; }
    .text-button { display: block; margin: 18px auto 0; border: 0; background: transparent; color: #b99aff; }
    .account-card { display: grid; justify-items: center; gap: 12px; padding: 25px 0 0; text-align: center; }
    .account-card p { color: #aaa6bd; overflow-wrap: anywhere; }
    .avatar { display: grid; place-items: center; width: 70px; height: 70px; border-radius: 24px; background: linear-gradient(135deg,#8b5cf6,#ec4899); font-size: 28px; font-weight: 900; }
    .account-card .full { margin-top: 8px; }
    .owner-header { margin-bottom: 25px; }
    .owner-header h2 { display: flex; flex-wrap: wrap; align-items: center; gap: 12px; }
    .admin-stats { display: grid; grid-template-columns: repeat(3,1fr); gap: 15px; margin: 25px 0 45px; }
    .admin-stats div { padding: 22px; border: 1px solid #302b43; border-radius: 14px; background: #12111b; }
    .admin-stats strong { font-size: 28px; }
    .admin-actions { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 16px; }
    .footer { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 28px 5% 90px; border-top: 1px solid #242236; color: #aaa6bd; }
    .footer p { margin: 0; }
    .mobile-nav { display: none; }
    @media (max-width: 900px) {
      .desktop-nav { gap: 0; }
      .desktop-nav button { padding: 9px 7px; font-size: 12px; }
      .hero { padding: 55px 6%; }
      .hero-art { width: 230px; height: 230px; }
      .orb-core { inset: 68px; font-size: 48px; border-radius: 24px; }
      .floating-card { padding: 8px; font-size: 11px; }
      .listing-grid { grid-template-columns: repeat(2,minmax(0,1fr)); }
    }
    @media (max-width: 650px) {
      .topbar { height: 64px; padding: 0 4%; }
      .desktop-nav { display: none; }
      .hero { min-height: auto; padding: 55px 6% 40px; }
      .hero-art { display: none; }
      .hero h1 { font-size: 44px; }
      .hero-stats { gap: 22px; }
      .content { padding: 40px 4% 100px; }
      .section-heading { align-items: flex-start; }
      .section-heading > .primary { padding: 10px; font-size: 12px; }
      .filters { flex-direction: column; }
      .filters select { max-width: none; }
      .listing-grid { grid-template-columns: 1fr; }
      .form-panel { padding: 22px 17px; }
      .admin-stats { grid-template-columns: 1fr; }
      .footer { flex-direction: column; align-items: flex-start; padding-bottom: 100px; }
      .mobile-nav { position: fixed; z-index: 20; right: 10px; bottom: 10px; left: 10px; display: flex; justify-content: space-around; gap: 4px; padding: 10px 5px; border: 1px solid #38304e; border-radius: 17px; background: rgba(18,17,27,.96); backdrop-filter: blur(16px); }
      .mobile-nav button { display: grid; justify-items: center; gap: 4px; border: 0; background: transparent; color: #c7b3ff; font-size: 19px; }
      .mobile-nav span { color: #aaa6bd; font-size: 9px; }
      .desktop-only { display: none; }
    }
  `}</style>
</main>

);
    }
