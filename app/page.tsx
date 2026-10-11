
"use client";

import { useMemo, useState } from "react";

type Listing = {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  seller: string;
  emoji: string;
  color: string;
  date: string;
};

const initialListings: Listing[] = [
  {
    id: 1,
    title: "Создание сайтов под ключ",
    description: "Современный сайт для бизнеса, проекта или личного бренда. Адаптация под телефон и компьютер.",
    category: "Программирование",
    price: 15000,
    seller: "Web Studio",
    emoji: "💻",
    color: "#172b52",
    date: "Сегодня",
  },
  {
    id: 2,
    title: "Разработка Telegram-бота",
    description: "Боты для групп, каналов, магазинов и автоматизации задач. Обсудим ваши идеи.",
    category: "Программирование",
    price: 8000,
    seller: "Bot Maker",
    emoji: "🤖",
    color: "#26305b",
    date: "Сегодня",
  },
  {
    id: 3,
    title: "Дизайн аватарок и баннеров",
    description: "Оформление профиля, обложки, баннеры и графика для социальных сетей.",
    category: "Дизайн",
    price: 2500,
    seller: "Pixel Art",
    emoji: "🎨",
    color: "#42265e",
    date: "Вчера",
  },
  {
    id: 4,
    title: "Монтаж видео",
    description: "Монтаж коротких роликов для TikTok, Reels и YouTube Shorts.",
    category: "Видео",
    price: 4000,
    seller: "Video Lab",
    emoji: "🎬",
    color: "#493044",
    date: "Сегодня",
  },
  {
    id: 5,
    title: "Настройка Discord-сервера",
    description: "Каналы, роли, оформление и настройка ботов для вашего сообщества.",
    category: "Интернет",
    price: 5000,
    seller: "Community Pro",
    emoji: "🌐",
    color: "#1b4054",
    date: "Вчера",
  },
  {
    id: 6,
    title: "Тексты и описания",
    description: "Помощь с описаниями проектов, постами, объявлениями и презентациями.",
    category: "Тексты",
    price: 1500,
    seller: "Text Lab",
    emoji: "✍️",
    color: "#4b3a25",
    date: "Сегодня",
  },
];

const categories = [
  "Все объявления",
  "Программирование",
  "Дизайн",
  "Видео",
  "Интернет",
  "Тексты",
  "Другое",
];

const money = (price: number) =>
  new Intl.NumberFormat("ru-RU").format(price) + " ₸";

export default function Home() {
  const [listings, setListings] = useState(initialListings);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Все объявления");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [notice, setNotice] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Программирование",
    price: "",
    seller: "",
  });

  const filtered = useMemo(
    () =>
      listings.filter((item) => {
        const matchesCategory =
          category === "Все объявления" || item.category === category;
        const text = `${item.title} ${item.description} ${item.seller}`.toLowerCase();
        return matchesCategory && text.includes(query.toLowerCase().trim());
      }),
    [listings, category, query]
  );

  function publishListing(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const price = Number(form.price);
    if (!Number.isFinite(price) || price < 0) {
      setNotice("Укажи корректную цену.");
      return;
    }

    const newListing: Listing = {
      id: Date.now(),
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      price,
      seller: form.seller.trim(),
      emoji: "✨",
      color: "#21334e",
      date: "Только что",
    };

    setListings((current) => [newListing, ...current]);
    setCategory("Все объявления");
    setQuery("");
    setShowForm(false);
    setForm({
      title: "",
      description: "",
      category: "Программирование",
      price: "",
      seller: "",
    });
    setNotice("Объявление добавлено в демонстрационный каталог.");
  }

  return (
    <main className="nx">
      <header className="topbar">
        <a className="brand" href="#">
          <span className="brand-icon">N</span>
          <span>NEXORA<span className="brand-dot">.</span></span>
        </a>

        <nav className="nav">
          <a href="#catalog">Каталог</a>
          <a href="#about">О проекте</a>
        </nav>

        <button className="publish top-publish" onClick={() => setShowForm(true)}>
          <span>＋</span> Разместить объявление
        </button>
      </header>

      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <div className="eyebrow">
            <span className="live-dot" /> МАРКЕТПЛЕЙС УСЛУГ И ОБЪЯВЛЕНИЙ
          </div>
          <h1>
            Находи своё.
            <br />
            <span>Предлагай своё.</span>
          </h1>
          <p>
            Услуги, цифровые проекты и полезные предложения
            в одном месте. Найди исполнителя или покажи миру,
            что умеешь ты.
          </p>

          <div className="hero-actions">
            <a className="primary-btn" href="#catalog">
              Смотреть объявления <span>↗</span>
            </a>
            <button className="secondary-btn" onClick={() => setShowForm(true)}>
              ＋ Опубликовать услугу
            </button>
          </div>

          <div className="hero-stats">
            <div><strong>01</strong><span>Найди услугу</span></div>
            <div><strong>02</strong><span>Свяжись с автором</span></div>
            <div><strong>03</strong><span>Договорись о работе</span></div>
          </div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="floating-card float-one">
            <span className="float-icon blue">⌘</span>
            <span><b>Цифровые услуги</b><small>Новые возможности</small></span>
          </div>
          <div className="floating-card float-two">
            <span className="float-icon purple">✦</span>
            <span><b>Твои идеи</b><small>Твоя площадка</small></span>
          </div>
          <div className="nx-symbol">N<span>.</span></div>
          <div className="art-caption">ТВОЙ ПРОЕКТ. ТВОИ ПРАВИЛА.</div>
        </div>
      </section>

      <section className="search-panel" id="catalog">
        <div className="search-title">
          <div>
            <span className="section-label">ПОИСК В NEXORA</span>
            <h2>Что будем искать?</h2>
          </div>
          <span className="search-spark">✳</span>
        </div>
        <div className="search-input-wrap">
          <span>⌕</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Например, создание сайта или дизайн..."
            aria-label="Поиск объявлений"
          />
          {query && (
            <button onClick={() => setQuery("")} aria-label="Очистить поиск">×</button>
          )}
        </div>
        <div className="category-row">
          {categories.map((item) => (
            <button
              key={item}
              className={`category-chip ${category === item ? "selected" : ""}`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <div>
            <span className="section-label">ВЫБИРАЙ И ДЕЙСТВУЙ</span>
            <h2>Объявления <span className="heading-dot">.</span></h2>
            <p>Интересные предложения от авторов сообщества.</p>
          </div>
          <span className="results-count">{filtered.length} объявлений</span>
        </div>

        {filtered.length > 0 ? (
          <div className="listing-grid">
            {filtered.map((item) => (
              <article className="listing-card" key={item.id}>
                <div className="listing-visual" style={{ background: item.color }}>
                  <span className="visual-orb orb-a" />
                  <span className="visual-orb orb-b" />
                  <span className="listing-emoji">{item.emoji}</span>
                  <span className="listing-category">{item.category}</span>
                  <button
                    className={`favorite ${favorites.includes(item.id) ? "is-fav" : ""}`}
                    onClick={() =>
                      setFavorites((old) =>
                        old.includes(item.id)
                          ? old.filter((id) => id !== item.id)
                          : [...old, item.id]
                      )
                    }
                    aria-label="Добавить в избранное"
                    title="Избранное"
                  >
                    {favorites.includes(item.id) ? "♥" : "♡"}
                  </button>
                </div>

                <div className="listing-body">
                  <div className="listing-meta">
                    <span><span className="seller-dot" /> {item.seller}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <p className="listing-description">{item.description}</p>
                  <div className="listing-bottom">
                    <div>
                      <span className="price-label">СТОИМОСТЬ</span>
                      <strong className="listing-price">
                        {item.price === 0 ? "Договорная" : money(item.price)}
                      </strong>
                    </div>
                    <button
                      className="details-btn"
                      onClick={() => setNotice(`Объявление «${item.title}». Для связи с автором скоро добавим профили и контакты.`)}
                      aria-label={`Подробнее: ${item.title}`}
                    >
                      ↗
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span>⌕</span>
            <h3>Ничего не найдено</h3>
            <p>Попробуй изменить запрос или выбрать другую категорию.</p>
            <button className="secondary-btn" onClick={() => { setQuery(""); setCategory("Все объявления"); }}>
              Сбросить фильтры
            </button>
          </div>
        )}

        <div className="catalog-cta">
          <div className="cta-icon">✦</div>
          <div>
            <h3>Есть что предложить?</h3>
            <p>Создай объявление и расскажи о своей услуге.</p>
          </div>
          <button className="publish" onClick={() => setShowForm(true)}>
            ＋ Создать объявление
          </button>
        </div>
      </section>

      <section className="how-section" id="about">
        <span className="section-label">ВСЁ ПРОСТО</span>
        <h2>Твоя идея — <span>твой старт.</span></h2>
        <div className="how-grid">
          <div><span className="how-number">01</span><h3>Найди</h3><p>Ищи подходящие услуги по категориям и описаниям.</p></div>
          <div><span className="how-number">02</span><h3>Опубликуй</h3><p>Добавь описание и цену. Фото не обязательны.</p></div>
          <div><span className="how-number">03</span><h3>Договорись</h3><p>Обсуди детали с автором перед заказом.</p></div>
        </div>
      </section>

      <footer className="footer">
        <a className="brand" href="#"><span className="brand-icon">N</span><span>NEXORA<span className="brand-dot">.</span></span></a>
        <p>Цифровые услуги. Новые возможности.</p>
        <span>© 2026 NEXORA</span>
        <div className="footer-contact">
          <a href="https://wa.me/77478149935" target="_blank" rel="noreferrer">WhatsApp</a>
          <a href="https://t.me/abyoffsabr" target="_blank" rel="noreferrer">Telegram · ABYOFF</a>
        </div>
      </footer>

      {notice && (
        <div className="notice" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice("")} aria-label="Закрыть">×</button>
        </div>
      )}

      {showForm && (
        <div className="modal-backdrop" onClick={() => setShowForm(false)}>
          <section className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            <span className="section-label">ТВОЁ ПРЕДЛОЖЕНИЕ</span>
            <h2>Новое объявление</h2>
            <p className="modal-intro">Расскажи о своей услуге. Фотографии добавим позже — сейчас они не нужны.</p>
            <form onSubmit={publishListing}>
              <label>Название услуги
                <input required maxLength={80} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Например, разработка сайта" />
              </label>
              <label>Описание
                <textarea required maxLength={1000} rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Расскажи подробнее о предложении..." />
              </label>
              <label>Категория
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {categories.filter((c) => c !== "Все объявления").map((c) => <option key={c}>{c}</option>)}
                </select>
              </label>
              <label>Цена в тенге (0 — договорная)
                <input required type="number" min="0" step="1" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Например, 5000" />
              </label>
              <label>Имя автора или магазина
                <input required maxLength={50} value={form.seller} onChange={(e) => setForm({ ...form, seller: e.target.value })} placeholder="Как тебя показывать в объявлении" />
              </label>
              <button className="primary-btn form-submit" type="submit">Добавить объявление ↗</button>
            </form>
            <p className="demo-warning">Демонстрация: объявление пока хранится только в этой открытой странице. Для постоянной публикации и модерации подключим базу данных и аккаунты.</p>
          </section>
        </div>
      )}

      <style jsx global>{`
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #080b13; color: #f3f5ff; font-family: Arial, Helvetica, sans-serif; }
        button, input, textarea, select { font: inherit; }
        button { cursor: pointer; }
        a { color: inherit; text-decoration: none; }
        .nx { --muted: #929bb2; --line: #222a3b; --cyan: #66e2fa; --purple: #a78bfa; max-width: 1440px; margin: 0 auto; padding: 0 5.5%; overflow: hidden; background: #080b13; }
        .topbar { min-height: 84px; display: flex; align-items: center; justify-content: space-between; gap: 22px; border-bottom: 1px solid #202638; }
        .brand { display: inline-flex; align-items: center; gap: 10px; font-size: 21px; font-weight: 900; letter-spacing: 2px; white-space: nowrap; }
        .brand-icon { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 12px; color: #071019; background: linear-gradient(135deg, #69e6ff, #a78bfa); font-size: 23px; }
        .brand-dot, .heading-dot { color: var(--cyan); }
        .nav { display: flex; gap: 28px; color: #b0b8cc; font-size: 14px; }
        .nav a:hover, .footer-contact a:hover { color: var(--cyan); }
        .publish { display: inline-flex; justify-content: center; align-items: center; gap: 8px; border: 1px solid #66e2fa; border-radius: 11px; padding: 13px 17px; background: #66e2fa; color: #061018; font-size: 13px; font-weight: 800; transition: .2s; }
        .publish:hover, .primary-btn:hover { transform: translateY(-2px); filter: brightness(1.08); }
        .top-publish { white-space: nowrap; }
        .hero { min-height: 510px; position: relative; display: grid; grid-template-columns: 1.1fr .9fr; align-items: center; gap: 25px; padding: 66px 0 56px; }
        .hero-glow { position: absolute; width: 380px; height: 380px; left: 35%; top: 0; background: #214b7b; filter: blur(150px); opacity: .15; pointer-events: none; }
        .hero-content { position: relative; z-index: 1; }
        .eyebrow, .section-label { color: var(--cyan); font-size: 10px; font-weight: 800; letter-spacing: 2px; }
        .eyebrow { display: flex; align-items: center; gap: 10px; }
        .live-dot, .seller-dot { width: 7px; height: 7px; display: inline-block; border-radius: 50%; background: #66e2fa; box-shadow: 0 0 12px #66e2fa; }
        .hero h1 { margin: 23px 0 20px; font-size: clamp(44px, 5.3vw, 76px); line-height: 1.08; letter-spacing: -3px; }
        .hero h1 span, .how-section h2 span { background: linear-gradient(90deg, #66e2fa, #a78bfa); color: transparent; background-clip: text; -webkit-background-clip: text; }
        .hero-content > p { max-width: 550px; color: #a3aec4; font-size: 15px; line-height: 1.9; }
        .hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
        .primary-btn, .secondary-btn { min-height: 46px; display: inline-flex; align-items: center; justify-content: center; gap: 12px; padding: 13px 18px; border-radius: 10px; font-weight: 800; font-size: 12px; transition: .2s; }
        .primary-btn { border: 0; color: #071019; background: linear-gradient(100deg, #66e2fa, #8cbfff); }
        .secondary-btn { color: #e5e9f5; background: #141a29; border: 1px solid #30394d; }
        .secondary-btn:hover { border-color: #66e2fa; }
        .hero-stats { display: flex; gap: 30px; margin-top: 37px; }
        .hero-stats div { display: flex; flex-direction: column; gap: 5px; }
        .hero-stats strong { color: #dbe5fa; font-size: 15px; }
        .hero-stats span { color: #77839c; font-size: 10px; }
        .hero-art { height: 360px; position: relative; display: grid; place-items: center; }
        .orbit { position: absolute; border: 1px solid #293d60; border-radius: 50%; transform: rotate(-25deg); }
        .orbit-one { width: 310px; height: 235px; }
        .orbit-two { width: 250px; height: 320px; border-color: #26314c; }
        .nx-symbol { position: relative; font-size: 180px; font-weight: 900; letter-spacing: -18px; padding-right: 18px; color: transparent; background: linear-gradient(140deg, #d9faff 5%, #66e2fa 42%, #9577ef 85%); background-clip: text; -webkit-background-clip: text; filter: drop-shadow(0 0 40px #4e7fc944); }
        .nx-symbol span { color: #66e2fa; }
        .floating-card { position: absolute; z-index: 2; display: flex; align-items: center; gap: 11px; padding: 13px 15px; background: #151d2c; border: 1px solid #344158; border-radius: 13px; box-shadow: 0 20px 50px #0005; }
        .float-one { top: 52px; left: -4px; }
        .float-two { right: -2px; bottom: 57px; }
        .float-icon { width: 35px; height: 35px; display: grid; place-items: center; border-radius: 10px; font-size: 20px; }
        .float-icon.blue { color: #66e2fa; background: #16354a; }
        .float-icon.purple { color: #c4a7ff; background: #35274f; }
        .floating-card b, .floating-card small { display: block; }
        .floating-card b { font-size: 11px; }
        .floating-card small { margin-top: 5px; color: #8d9ab0; font-size: 9px; }
        .art-caption { position: absolute; bottom: 12px; color: #6c7b96; font-size: 9px; letter-spacing: 3px; }
        .search-panel { padding: 28px; background: #101522; border: 1px solid #242d40; border-radius: 18px; }
        .search-title { display: flex; justify-content: space-between; align-items: center; }
        .search-title h2, .section-heading h2 { margin: 9px 0 0; font-size: 27px; letter-spacing: -.7px; }
        .search-spark { color: var(--purple); font-size: 29px; }
        .search-input-wrap { display: flex; align-items: center; gap: 12px; 
