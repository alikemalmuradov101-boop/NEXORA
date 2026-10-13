"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type ChatMessage = { id: number; from: "bot" | "user"; text: string; time: string };

const features = [
  { icon: "♧", title: "Игровое сообщество", text: "Находи людей для совместной игры, общения и новых приключений." },
  { icon: "✧", title: "События и команды", text: "Обсуждай идеи, собирай команду и планируй игровые встречи." },
  { icon: "⌁", title: "Безопасная среда", text: "Понятные правила и возможность сообщить о проблеме модераторам." },
];

function answerBot(text: string) {
  const q = text.toLowerCase();
  if (/(привет|здравств|салам|hello|хай)/.test(q)) return "Привет! 🌿 Я Древень-бот. Могу рассказать о сообществе, правилах и помочь с обращением к модерации.";
  if (/(правил|бан|наруш|жалоб|модерац|репорт)/.test(q)) return "Если возникла проблема, опиши её и укажи ник участника. В этой демо-версии сообщение не отправляется модераторам автоматически — реальную отправку подключим после настройки серверной части.";
  if (/(игр|команд|игрок|тим|собир)/.test(q)) return "Древень создан для поиска команды и общения игроков. Общий чат сообщества и подбор игроков ещё в разработке.";
  if (/(телеграм|telegram|ник|username|имя)/.test(q)) return "Укажи свой Telegram-ник в поле над чатом, например @player. Сейчас это только подпись в интерфейсе — вход через Telegram ещё не подключён.";
  if (/(помощ|что уме|команд|функц)/.test(q)) return "Пока я могу подсказать про сообщество, игровые команды и правила. Напиши, что именно хочешь узнать.";
  return "Спасибо за сообщение! 🌱 Я пока работаю в ознакомительном режиме и отвечаю на частые вопросы. Настоящие ответы Telegram-бота подключим отдельно, чтобы чат работал без перехода из сайта.";
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [telegramName, setTelegramName] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 1, from: "bot", text: "Привет! Я Древень-бот 🌲\nЧем могу помочь? Напиши вопрос — общаться можно прямо здесь, не покидая сайт.", time: "сейчас" },
  ]);
  const [chatNote, setChatNote] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages, chatOpen]);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    setMessages((old) => [...old, { id: Date.now(), from: "user", text, time: now }]);
    setDraft("");
    setChatNote("");
    window.setTimeout(() => {
      setMessages((old) => [...old, { id: Date.now() + 1, from: "bot", text: answerBot(text), time: new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) }]);
    }, 450);
  }

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Древень — главная">
          <span className="brand-mark">✦</span>
          <span>ДРЕВЕНЬ<small>ИГРОВОЕ СООБЩЕСТВО</small></span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">{menuOpen ? "Закрыть" : "Меню"}</button>
        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          <a href="#about" onClick={() => setMenuOpen(false)}>О сообществе</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Возможности</a>
          <a href="#rules" onClick={() => setMenuOpen(false)}>Правила</a>
          <button className="nav-chat" onClick={() => { setChatOpen(true); setMenuOpen(false); }}>Чат с ботом ↗</button>
        </nav>
        <button className="top-cta" onClick={() => setChatOpen(true)}>Чат с Древень-ботом <span>↗</span></button>
      </header>

      <section className="hero" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> ТВОЙ ЛЕС. ТВОЯ КОМАНДА.</div>
          <h1>Играй вместе.<br /><em>Расти вместе.</em></h1>
          <p className="hero-text">Древень — место для игроков, общения и совместных приключений. Знакомься, находи союзников и создавай свои игровые истории.</p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setChatOpen(true)}>Написать боту <span>↗</span></button>
            <a className="secondary-btn" href="#features">Изучить возможности <span>↓</span></a>
          </div>
          <div className="hero-note"><span className="note-icon">✳</span><span><b>Сообщество начинается с тебя</b><small>Уважение, командная игра и новые знакомства</small></span></div>
        </div>
        <div className="forest-art" aria-label="Стилизованный ночной лес" role="img">
          <div className="moon" /><div className="orb orb-one" /><div className="orb orb-two" /><div className="orb orb-three" />
          <div className="tree tree-back tree-left"><i /><i /><i /><b /></div>
          <div className="tree tree-back tree-right"><i /><i /><i /><b /></div>
          <div className="tree tree-mid"><i /><i /><i /><i /><b /></div>
          <div className="tree tree-front tree-front-left"><i /><i /><i /><b /></div>
          <div className="tree tree-front tree-front-right"><i /><i /><i /><b /></div>
          <div className="forest-caption"><span>01 / 03</span><span>ТИШИНА ПЕРЕД ПРИКЛЮЧЕНИЕМ</span></div>
        </div>
      </section>

      <section className="ticker" aria-label="Принципы сообщества"><span>ИГРАЙ</span><b>✳</b><span>ОБЩАЙСЯ</span><b>✳</b><span>СОЗДАВАЙ</span><b>✳</b><span>БУДЬ ЧАСТЬЮ ЛЕСА</span></section>

      <section className="features-section" id="features">
        <div className="section-heading"><div><div className="eyebrow">ЧТО ТЕБЯ ЖДЁТ</div><h2>Больше, чем <em>просто игра.</em></h2></div><p>Здесь важны не только победы, но и люди, с которыми ты проходишь путь.</p></div>
        <div className="feature-grid">{features.map((feature) => <article className="feature-card" key={feature.title}><div className="feature-icon">{feature.icon}</div><h3>{feature.title}</h3><p>{feature.text}</p><span className="card-arrow">↗</span></article>)}</div>
      </section>

      <section className="community-panel" id="about">
        <div className="panel-symbol">♧</div>
        <div><div className="eyebrow">ТВОЁ ПРИКЛЮЧЕНИЕ НАЧИНАЕТСЯ ЗДЕСЬ</div><h2>Встретимся <em>у костра.</em></h2><p>Напиши Древень-боту прямо на сайте. Чат открывается здесь и не перекидывает тебя в Telegram. Общий чат игроков подключим следующим этапом.</p></div>
        <button className="primary-btn" onClick={() => setChatOpen(true)}>Открыть чат <span>↗</span></button>
      </section>

      <section className="rules-strip" id="rules">
        <div className="eyebrow">КОДЕКС ДРЕВНЯ</div>
        <h2 className="rules-title">Правила сообщества <em>и администрации</em></h2>
        <p className="rules-intro">Правила нужны для честной игры, прозрачной экономики и одинакового подхода ко всем участникам. Администрация обязана соблюдать их так же, как и игроки.</p>
        <div className="rules-cards">
          <article className="rule-card"><span className="rule-number">01</span><h3>Поведение в чате</h3><ul><li>Уважай участников и администрацию.</li><li>Запрещены травля, угрозы, спам и намеренное провоцирование конфликтов.</li><li>Решай спорные вопросы спокойно; при необходимости обратись к модератору.</li></ul></article>
          <article className="rule-card"><span className="rule-number">02</span><h3>Игровая экономика</h3><ul><li>Не используй баги, обходы и сторонние способы для получения валюты.</li><li>Администраторам запрещено передавать или продавать игровую валюту с использованием служебных полномочий.</li><li>Передачи валюты выполняются только в рамках утверждённых игровых лимитов и правил.</li><li>Подозрительные операции могут быть проверены старшим составом.</li></ul></article>
          <article className="rule-card"><span className="rule-number">03</span><h3>Обязанности администрации</h3><ul><li>Следи за чатом, обращениями и соблюдением правил.</li><li>Не используй должность для личной выгоды и не скрывай нарушения.</li><li>Решения принимай по фактам, сохраняй доказательства и передавай сложные случаи старшему составу.</li><li>Не разглашай приватные данные участников.</li></ul></article>
          <article className="rule-card"><span className="rule-number">04</span><h3>Иерархия и ответственность</h3><ul><li>Основатель отвечает за проект и окончательные решения.</li><li>Заместитель основателя помогает управлять проектом и действует в пределах выданных полномочий.</li><li>Главные и старшие следящие контролируют работу администрации и состояние экономики.</li><li>Скрытый публичный статус основателя не отменяет ответственности перед командой.</li></ul></article>
        </div>
        <div className="economy-panel">
          <div><div className="eyebrow">ЛИМИТЫ ЭКОНОМИКИ</div><h3>Диапазоны по рангам</h3><p>Значения ниже перенесены из предоставленных заметок. До утверждения правил это ориентиры, а не автоматические разрешения на передачу.</p></div>
          <div className="limit-group"><h4>Младшие ранги</h4><div className="limit-chips"><span>5–15 тыс.</span><span>15–30 тыс.</span><span>30–60 тыс.</span><span>60–120 тыс.</span><span>120–240 тыс.</span></div></div>
          <div className="limit-group"><h4>Главные следящие</h4><div className="limit-chips"><span>240–500 тыс.</span><span>500–700 тыс.</span><span>800 тыс. – 1 млн</span></div><p className="limit-note">Диапазон 700–800 тыс. в исходных заметках не указан — его нужно уточнить.</p></div>
          <div className="limit-group"><h4>Высшие ранги</h4><div className="limit-chips"><span>1–5 млн</span></div></div>
        </div>
        <div className="sanctions-panel"><div className="eyebrow">МЕРЫ ЗА НАРУШЕНИЯ</div><div className="sanctions-grid"><div><b>1</b><span>Предупреждение или выговор</span></div><div><b>2</b><span>Временный бан на срок по тяжести нарушения</span></div><div><b>3</b><span>Снятие с должности или временное отстранение</span></div><div><b>4</b><span>Обнуление валюты/прогресса при доказанном злоупотреблении</span></div></div><p className="rules-footnote">Тяжесть наказания определяется по доказательствам, повторности и последствиям. Снятие всего состава из-за одного нарушения не применяется автоматически: ответственность рассматривается индивидуально, а руководство проверяет, кто допустил нарушение и кто обязан был его предотвратить.</p></div>
      </section>

      <footer className="footer"><a className="brand" href="#home"><span className="brand-mark">✦</span><span>ДРЕВЕНЬ<small>ИГРОВОЕ СООБЩЕСТВО</small></span></a><span>© {new Date().getFullYear()} Древень. Создаём сообщество вместе.</span><button onClick={() => setChatOpen(true)}>Чат с ботом ↗</button></footer>

      <button className="chat-fab" onClick={() => setChatOpen(true)} aria-label="Открыть чат с Древень-ботом"><span className="fab-icon">✳</span><span>Древень-бот</span><i /></button>

      {chatOpen && <div className="chat-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) setChatOpen(false); }}>
        <section className="chat-window" role="dialog" aria-modal="true" aria-label="Чат с Древень-ботом">
          <header className="chat-header"><div className="bot-avatar">✳</div><div className="bot-title"><b>Древень-бот</b><small><span className="live-dot" /> Помощник сообщества · внутри сайта</small></div><button className="close-chat" onClick={() => setChatOpen(false)} aria-label="Закрыть чат">×</button></header>
          <div className="chat-profile"><label htmlFor="telegram-name">ТВОЁ ИМЯ В TELEGRAM</label><input id="telegram-name" value={telegramName} onChange={(e) => setTelegramName(e.target.value)} placeholder="@твой_ник" maxLength={40} /><small>Можно указать ник вручную. Вход и проверка Telegram пока не подключены.</small></div>
          <div className="chat-messages" aria-live="polite">
            <div className="chat-date">СЕГОДНЯ</div>
            {messages.map((message) => <div key={message.id} className={message.from === "user" ? "message-row user-row" : "message-row"}><div className={message.from === "bot" ? "message-avatar" : "message-avatar user-avatar"}>{message.from === "bot" ? "✳" : "☺"}</div><div className={message.from === "bot" ? "message-bubble" : "message-bubble user-bubble"}>{message.from === "user" && telegramName.trim() && <b className="message-name">{telegramName.trim().startsWith("@") ? telegramName.trim() : "@" + telegramName.trim()}</b>}<p>{message.text}</p><time>{message.time}</time></div></div>)}
            <div ref={endRef} />
          </div>
          {chatNote && <p className="chat-note">{chatNote}</p>}
          <form className="chat-compose" onSubmit={sendMessage}><input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Напиши сообщение..." aria-label="Сообщение" maxLength={1000} /><button type="submit" disabled={!draft.trim()} aria-label="Отправить сообщение">↑</button></form>
          <div className="chat-disclaimer">Ознакомительный режим: сообщения пока не передаются реальному Telegram-боту.</div>
        </section>
      </div>}

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        :root{--bg:#0a100d;--panel:#111a14;--green:#b8e986;--muted:#a0aea3;--line:#29352c;--white:#f0f4ed}
        *{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:24px}body{background:var(--bg);color:var(--white);font-family:'DM Sans',sans-serif}button,input{font:inherit}button{cursor:pointer}a{color:inherit;text-decoration:none}.site-shell{max-width:1440px;margin:0 auto;padding:0 6.2%}
        .topbar{min-height:86px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);gap:22px}.brand{display:flex;align-items:center;gap:10px;font-family:Manrope,sans-serif;font-size:15px;font-weight:800;letter-spacing:2px;flex-shrink:0}.brand-mark{display:grid;place-items:center;width:37px;height:37px;border:1px solid #526b4d;border-radius:12px;color:var(--green);font-size:22px}.brand small{display:block;font:9px 'DM Sans',sans-serif;color:var(--muted);letter-spacing:1.6px;margin-top:3px}.nav{display:flex;align-items:center;gap:clamp(12px,2.4vw,32px);color:#c0cbc0;font-size:13px}.nav a:hover,.footer button:hover{color:var(--green)}.top-cta,.nav-chat{border:1px solid #5a6b58;padding:12px 14px;border-radius:7px;font-size:12px;font-weight:700;color:var(--white);background:transparent;white-space:nowrap}.nav-chat{display:none}.top-cta span,.primary-btn span{margin-left:10px;color:var(--green)}.menu-toggle{display:none}
        .hero{display:grid;grid-template-columns:1fr .9fr;gap:4%;align-items:center;padding:70px 0 68px;min-height:570px}.eyebrow{font-size:10px;letter-spacing:2px;font-weight:700;color:var(--green);display:flex;align-items:center;gap:9px}.live-dot{display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 12px #b8e986}.hero h1,.section-heading h2,.community-panel h2{font-family:Manrope,sans-serif;letter-spacing:-2.7px}.hero h1{font-size:clamp(48px,6.4vw,84px);line-height:1.04;margin:25px 0 22px;font-weight:700}.hero h1 em,.section-heading h2 em,.community-panel h2 em{font-style:normal;color:var(--green)}.hero-text{font-size:15px;line-height:1.85;color:var(--muted);max-width:475px;margin-bottom:30px}.hero-actions{display:flex;align-items:center;gap:13px;flex-wrap:wrap}.primary-btn,.secondary-btn{display:inline-flex;align-items:center;justify-content:center;padding:15px 18px;border-radius:7px;font-size:12px;font-weight:700}.primary-btn{background:var(--green);color:#172015;border:0}.primary-btn span{color:#172015}.secondary-btn{border:1px solid var(--line);color:#d7dfd6;background:transparent}.hero-note{display:flex;align-items:center;gap:12px;margin-top:38px}.note-icon{display:grid;place-items:center;width:38px;height:38px;border:1px solid var(--line);border-radius:50%;color:var(--green)}.hero-note b,.hero-note small{display:block}.hero-note b{font-size:11px}.hero-note small{font-size:10px;color:var(--muted);margin-top:5px}
        .forest-art{height:420px;position:relative;overflow:hidden;border:1px solid #27392b;border-radius:12px;background:radial-gradient(ellipse at 50% 36%,#294b31 0%,#172b20 37%,#101a14 75%)}.forest-art:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,#0a100d 0%,transparent 40%,#0a100d12 100%);pointer-events:none}.moon{position:absolute;top:55px;left:48%;width:83px;height:83px;border-radius:50%;background:#d7edbd;box-shadow:0 0 65px #b8e98655}.orb{position:absolute;width:4px;height:4px;border-radius:50%;background:#d5edb8;box-shadow:0 0 10px #d5edb8}.orb-one{top:70px;left:23%}.orb-two{top:130px;right:20%}.orb-three{top:45%;left:65%}.tree{position:absolute;bottom:15px;width:0;height:0;border-left:72px solid transparent;border-right:72px solid transparent;border-bottom:240px solid #24432c;filter:drop-shadow(0 0 18px #0004)}.tree i{position:absolute;display:block;width:0;height:0;border-left:60px solid transparent;border-right:60px solid transparent;border-bottom:95px solid #2d5436;left:-60px;top:35px}.tree i:nth-child(2){top:75px;left:-52px;border-left-width:52px;border-right-width:52px;border-bottom-width:90px}.tree i:nth-child(3){top:116px;left:-42px;border-left-width:42px;border-right-width:42px;border-bottom-width:75px}.tree b{position:absolute;width:13px;height:52px;background:#4c3f2b;top:235px;left:-6px}.tree-back{transform:scale(.72);transform-origin:bottom;opacity:.8;border-bottom-color:#1b3422}.tree-left{left:4%;bottom:7px}.tree-right{right:1%;bottom:2px;transform:scale(.85)}.tree-mid{left:43%;bottom:8px;transform:scale(1.12);border-bottom-color:#345b38}.tree-front{border-bottom-color:#13271a;transform:scale(1.1)}.tree-front-left{left:21%;bottom:-10px}.tree-front-right{right:15%;bottom:-12px;transform:scale(1.2)}.forest-caption{position:absolute;z-index:2;bottom:20px;left:20px;right:20px;display:flex;justify-content:space-between;color:#c2d2bc;font-size:9px;letter-spacing:1.3px}
        .ticker{display:flex;align-items:center;justify-content:space-around;gap:14px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:21px 0;color:#d6dfd3;font-size:10px;letter-spacing:2px;font-weight:700}.ticker b{color:var(--green);font-size:14px}.features-section{padding:90px 0}.section-heading{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:34px}.section-heading h2,.community-panel h2{font-size:clamp(30px,4vw,47px);line-height:1.12;margin:15px 0 0}.section-heading>p{max-width:330px;color:var(--muted);font-size:13px;line-height:1.8;margin:0}.feature-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:15px}.feature-card{position:relative;background:linear-gradient(145deg,#141f17,#0e1611);border:1px solid var(--line);border-radius:10px;padding:26px;min-height:210px}.feature-icon{font-size:25px;color:var(--green);margin-bottom:24px}.feature-card h3{font-family:Manrope,sans-serif;font-size:16px;margin-bottom:11px}.feature-card p{color:var(--muted);font-size:12px;line-height:1.8;margin-bottom:20px}.card-arrow{position:absolute;right:24px;top:25px;color:#6e8667}
        .community-panel{display:grid;grid-template-columns:62px minmax(0,1fr) auto;gap:22px;align-items:center;background:#17251a;border:1px solid #304831;border-radius:12px;padding:32px}.panel-symbol{display:grid;place-items:center;width:58px;height:58px;border-radius:18px;background:#233c28;color:var(--green);font-size:34px}.community-panel h2{font-size:clamp(28px,3.5vw,36px);margin:12px 0}.community-panel p{font-size:12px;line-height:1.8;color:var(--muted);max-width:560px;margin:0}.community-panel .primary-btn{white-space:nowrap}.rules-strip{padding:65px 0;border-bottom:1px solid var(--line)}.rules-title{font-family:Manrope,sans-serif;font-size:clamp(30px,4vw,46px);letter-spacing:-1.8px;line-height:1.12;margin:16px 0}.rules-title em{font-style:normal;color:var(--green)}.rules-intro{max-width:760px;color:var(--muted);font-size:13px;line-height:1.8;margin:0 0 26px}.rules-cards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:13px}.rule-card{position:relative;background:linear-gradient(145deg,#141f17,#0e1611);border:1px solid var(--line);border-radius:10px;padding:23px}.rule-number{display:inline-grid;place-items:center;width:30px;height:30px;border-radius:9px;background:#243b27;color:var(--green);font-size:10px;font-weight:800}.rule-card h3{font-family:Manrope,sans-serif;font-size:16px;margin:14px 0 10px}.rule-card ul{padding-left:18px;margin:0;color:var(--muted);font-size:12px;line-height:1.8}.rule-card li{padding:2px 0}.economy-panel,.sanctions-panel{margin-top:15px;padding:24px;border:1px solid #304831;border-radius:11px;background:#121d15}.economy-panel h3{font-family:Manrope,sans-serif;font-size:22px;margin:9px 0}.economy-panel>div:first-child>p{max-width:700px;color:var(--muted);font-size:12px;line-height:1.7;margin:0 0 20px}.limit-group{padding:15px 0;border-top:1px solid var(--line)}.limit-group h4{font-size:12px;margin:0 0 11px}.limit-chips{display:flex;gap:8px;flex-wrap:wrap}.limit-chips span{padding:9px 12px;border:1px solid #3b573c;border-radius:7px;background:#1b2b1e;color:#d8e8d0;font-size:12px;font-weight:700}.limit-note{font-size:11px;color:#e2cc8a;line-height:1.6;margin:10px 0 0}.sanctions-panel>.eyebrow{margin-bottom:18px}.sanctions-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}.sanctions-grid>div{display:flex;flex-direction:column;gap:10px;padding:14px;background:#0e1710;border:1px solid var(--line);border-radius:8px}.sanctions-grid b{color:var(--green);font-size:18px}.sanctions-grid span{font-size:11px;color:#c0ccc0;line-height:1.6}.rules-footnote{font-size:11px;line-height:1.75;color:var(--muted);margin:17px 0 0}.footer{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:26px 0 30px;color:var(--muted);font-size:10px}.footer .brand{color:var(--white)}.footer button{background:none;border:0;color:var(--white);font-size:11px}
        .chat-fab{position:fixed;z-index:20;right:22px;bottom:22px;display:flex;align-items:center;gap:10px;border:1px solid #5c754f;background:var(--green);color:#152016;padding:13px 17px;border-radius:999px;box-shadow:0 12px 35px #0007;font-weight:800;font-size:12px}.fab-icon{font-size:19px}.chat-fab i{position:absolute;right:10px;top:8px;width:7px;height:7px;border-radius:50%;background:#2e7d32;border:1px solid var(--green)}
        .chat-overlay{position:fixed;z-index:100;inset:0;background:#020603b8;backdrop-filter:blur(5px);display:flex;align-items:flex-end;justify-content:flex-end;padding:24px}.chat-window{display:flex;flex-direction:column;width:min(410px,100%);height:min(690px,calc(100dvh - 48px));min-height:390px;background:#0f1711;border:1px solid #354a36;border-radius:17px;box-shadow:0 24px 90px #0009;overflow:hidden}.chat-header{display:flex;align-items:center;gap:12px;padding:16px 17px;background:#18251a;border-bottom:1px solid #2b3a2d;flex-shrink:0}.bot-avatar{display:grid;place-items:center;width:42px;height:42px;border-radius:14px;background:#2b472e;color:var(--green);font-size:23px}.bot-title{flex:1;min-width:0}.bot-title b{display:block;font-size:14px}.bot-title small{display:flex;align-items:center;gap:7px;font-size:10px;color:var(--muted);margin-top:5px}.bot-title .live-dot{width:5px;height:5px}.close-chat{border:0;background:transparent;color:#dce5d9;font-size:28px;width:36px;height:36px;border-radius:9px}.close-chat:hover{background:#ffffff12}.chat-profile{padding:13px 16px 12px;border-bottom:1px solid #253228;flex-shrink:0}.chat-profile label{display:block;font-size:9px;letter-spacing:1.4px;color:var(--green);font-weight:700;margin-bottom:8px}.chat-profile input{width:100%;border:1px solid #334638;border-radius:8px;background:#0a100d;color:var(--white);padding:11px 12px;outline:none;font-size:13px}.chat-profile input:focus,.chat-compose input:focus{border-color:#9fc87d}.chat-profile small{display:block;color:#829184;font-size:10px;line-height:1.45;margin-top:7px}.chat-messages{flex:1;overflow-y:auto;overscroll-behavior:contain;padding:17px 13px;display:flex;flex-direction:column;gap:13px}.chat-date{text-align:center;color:#778679;font-size:9px;letter-spacing:1.5px;margin-bottom:4px}.message-row{display:flex;align-items:flex-end;gap:8px;max-width:94%;align-self:flex-start}.user-row{align-self:flex-end;flex-direction:row-reverse}.message-avatar{width:27px;height:27px;flex-shrink:0;display:grid;place-items:center;background:#263c29;border-radius:9px;color:var(--green);font-size:13px}.user-avatar{background:#32443a;color:#edf6e8}.message-bubble{background:#1a281d;border:1px solid #2b3c2e;border-radius:12px 12px 12px 3px;padding:10px 12px;min-width:0;max-width:100%}.user-bubble{background:#29442c;border-color:#3b5a3d;border-radius:12px 12px 3px 12px}.message-bubble p{white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px;line-height:1.65;margin:0;color:#e3ebe0}.message-bubble time{display:block;text-align:right;font-size:9px;color:#8d9b8e;margin-top:6px}.message-name{display:block;font-size:10px;color:var(--green);margin-bottom:5px}.chat-compose{display:flex;gap:9px;padding:12px;border-top:1px solid #29382c;flex-shrink:0}.chat-compose input{flex:1;min-width:0;border:1px solid #334638;border-radius:9px;background:#0a100d;color:var(--white);padding:12px;font-size:12px;outline:none}.chat-compose button{width:43px;height:43px;border:0;border-radius:10px;background:var(--green);color:#172015;font-weight:800;font-size:23px}.chat-compose button:disabled{opacity:.4;cursor:not-allowed}.chat-disclaimer{padding:0 14px 12px;text-align:center;color:#7f8e80;font-size:9px;line-height:1.4;flex-shrink:0}.chat-note{margin:0;padding:6px 14px;color:#e6ce8a;font-size:10px}
        @media(max-width:900px){.site-shell{padding:0 5%}.topbar{gap:12px}.nav{gap:14px}.top-cta{font-size:11px;padding:11px}.hero{gap:3%;grid-template-columns:1fr .88fr}.hero h1{font-size:clamp(43px,6vw,65px)}.forest-art{height:380px}.community-panel{grid-template-columns:52px minmax(0,1fr)}.community-panel>.primary-btn{grid-column:2;justify-self:start}.panel-symbol{width:49px;height:49px}}
        @media(max-width:680px){.site-shell{padding:0 18px}.topbar{height:74px;position:relative;justify-content:space-between}.brand{font-size:13px;letter-spacing:1.5px;gap:8px}.brand-mark{width:33px;height:33px;border-radius:10px}.brand small{font-size:8px;letter-spacing:1px}.menu-toggle{display:block;margin-left:auto;background:transparent;color:var(--white);border:1px solid var(--line);border-radius:7px;padding:10px 12px;font-size:12px}.top-cta{display:none}.nav{display:none;position:absolute;z-index:30;top:65px;left:0;right:0;padding:17px;background:#111a14;border:1px solid var(--line);border-radius:10px;flex-direction:column;align-items:stretch;gap:0;box-shadow:0 20px 40px #0008}.nav-open{display:flex}.nav a,.nav-chat{display:block;padding:13px 8px;text-align:left;border:0;background:none;font-size:13px}.nav-chat{color:var(--green)}.hero{grid-template-columns:1fr;gap:30px;padding:46px 0 43px;min-height:unset}.hero h1{font-size:clamp(45px,12vw,60px);letter-spacing:-2px;margin:21px 0 17px}.hero-text{font-size:14px;line-height:1.75;margin-bottom:23px}.hero-actions{display:grid;grid-template-columns:1fr;gap:10px}.primary-btn,.secondary-btn{width:100%;min-height:47px;padding:13px 15px}.hero-note{margin-top:27px}.hero-note small{font-size:10px;line-height:1.5}.forest-art{height:clamp(270px,76vw,340px);width:100%}.moon{width:65px;height:65px;top:43px}.tree{transform:scale(.78);transform-origin:bottom}.tree-right{transform:scale(.65)}.tree-mid{transform:scale(.78)}.tree-front-left{transform:scale(.72)}.tree-front-right{transform:scale(.75)}.forest-caption{left:12px;right:12px;bottom:13px;font-size:8px;letter-spacing:.7px}.ticker{justify-content:center;flex-wrap:wrap;gap:11px;padding:16px 0;font-size:9px;letter-spacing:1.4px}.ticker span:last-of-type{display:none}.features-section{padding:65px 0}.section-heading{align-items:start;flex-direction:column;gap:14px;margin-bottom:25px}.section-heading h2,.community-panel h2{letter-spacing:-1.5px}.section-heading>p{font-size:12px}.feature-grid{grid-template-columns:1fr;gap:11px}.feature-card{min-height:unset;padding:22px}.feature-icon{margin-bottom:14px}.feature-card h3{font-size:15px}.feature-card p{font-size:12px;margin-bottom:4px}.community-panel{grid-template-columns:1fr;gap:17px;padding:23px 20px}.community-panel>.primary-btn{grid-column:1}.community-panel h2{font-size:30px}.community-panel p{font-size:12px}.rules-strip{padding:48px 0}.rules-cards{grid-template-columns:1fr}.rule-card{padding:20px}.economy-panel,.sanctions-panel{padding:18px}.sanctions-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.rules-title{font-size:31px}.rules-list{flex-direction:column;gap:17px}.footer{align-items:flex-start;flex-direction:column;gap:17px;padding-bottom:95px}.footer .brand{margin-bottom:0}.chat-fab{right:14px;bottom:14px;padding:12px 15px;gap:8px}.chat-overlay{padding:0;align-items:stretch;justify-content:stretch;background:#020603d9}.chat-window{width:100%;height:100dvh;min-height:0;max-height:100dvh;border-radius:0;border:0;padding-bottom:env(safe-area-inset-bottom)}.chat-header{padding:calc(12px + env(safe-area-inset-top)) 15px 12px}.chat-profile{padding:11px 14px}.chat-messages{padding:15px 12px}.chat-compose{padding:10px 12px}.chat-disclaimer{padding-bottom:10px}.chat-fab{z-index:19}}
        @media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*{animation-duration:.01ms!important;transition-duration:.01ms!important}}
      `}</style>
    </main>
  );
}
