"use client";

import { useState } from "react";

const features = [
  { icon: "🌲", title: "Своё сообщество", text: "Находи игроков, знакомься и собирай команду для совместных игр." },
  { icon: "⚔️", title: "Игровые события", text: "Идеи для встреч, турниров и дружеских игровых вечеров." },
  { icon: "🛡️", title: "Порядок и безопасность", text: "Правила сообщества и возможность сообщить о проблеме." },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main className="site-shell">
      <header className="topbar">
        <a className="brand" href="#" aria-label="Древень — главная">
          <span className="brand-mark">✦</span>
          <span>ДРЕВЕНЬ<small>ИГРОВОЕ СООБЩЕСТВО</small></span>
        </a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Открыть меню">
          {menuOpen ? "Закрыть" : "Меню"}
        </button>
        <nav className={menuOpen ? "nav nav-open" : "nav"}>
          <a href="#about" onClick={() => setMenuOpen(false)}>О сообществе</a>
          <a href="#features" onClick={() => setMenuOpen(false)}>Возможности</a>
          <a href="#rules" onClick={() => setMenuOpen(false)}>Правила</a>
        </nav>
        <a className="top-cta" href="#community">Присоединиться <span>↗</span></a>
      </header>

      <section className="hero" id="about">
        <div className="hero-copy">
          <div className="eyebrow"><span className="live-dot" /> ТВОЙ ЛЕС. ТВОЯ КОМАНДА.</div>
          <h1>Играй вместе.<br /><em>Расти вместе.</em></h1>
          <p className="hero-text">Древень — место, где игроки становятся командой. Общайся, находи союзников и создавай свои игровые истории.</p>
          <div className="hero-actions">
            <a className="primary-btn" href="#community">Войти в сообщество <span>↗</span></a>
            <a className="secondary-btn" href="#features">Изучить возможности <span>↓</span></a>
          </div>
          <div className="hero-note"><span className="note-icon">✳</span><span><b>Сообщество начинается с тебя</b><small>Уважение, командная игра и новые знакомства</small></span></div>
        </div>
        <div className="forest-art" aria-label="Иллюстрация леса" role="img">
          <div className="moon" />
          <div className="orb orb-one" /><div className="orb orb-two" /><div className="orb orb-three" />
          <div className="tree tree-back tree-left"><i /><i /><i /><b /></div>
          <div className="tree tree-back tree-right"><i /><i /><i /><b /></div>
          <div className="tree tree-mid"><i /><i /><i /><i /><b /></div>
          <div className="tree tree-front tree-front-left"><i /><i /><i /><b /></div>
          <div className="tree tree-front tree-front-right"><i /><i /><i /><b /></div>
          <div className="forest-caption"><span>01 / 03</span><span>ТИШИНА ПЕРЕД ПРИКЛЮЧЕНИЕМ</span></div>
        </div>
      </section>

      <section className="ticker" aria-label="Принципы сообщества">
        <span>ИГРАЙ</span><b>✳</b><span>ОБЩАЙСЯ</span><b>✳</b><span>СОЗДАВАЙ</span><b>✳</b><span>БУДЬ ЧАСТЬЮ ЛЕСА</span><b>✳</b>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <div><div className="eyebrow">ЧТО ТЕБЯ ЖДЁТ</div><h2>Больше, чем <em>просто игра.</em></h2></div>
          <p>Здесь важны не только победы, но и люди, с которыми ты проходишь путь.</p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
              <span className="card-arrow">↗</span>
            </article>
          ))}
        </div>
      </section>

      <section className="community-panel" id="community">
        <div className="panel-symbol">♧</div>
        <div><div className="eyebrow">ТВОЁ ПРИКЛЮЧЕНИЕ НАЧИНАЕТСЯ ЗДЕСЬ</div><h2>Встретимся <em>у костра.</em></h2><p>Мы готовим площадку Древень. Скоро здесь появятся вход в сообщество, игровой чат и инструменты модерации.</p></div>
        <a className="primary-btn" href="#rules">Посмотреть правила <span>↗</span></a>
      </section>

      <section className="rules-strip" id="rules">
        <div className="eyebrow">КОДЕКС ДРЕВНЯ</div>
        <div className="rules-list"><span><b>01</b> Уважай игроков</span><span><b>02</b> Играй честно</span><span><b>03</b> Береги сообщество</span></div>
      </section>

      <footer className="footer">
        <a className="brand" href="#"><span className="brand-mark">✦</span><span>ДРЕВЕНЬ<small>ИГРОВОЕ СООБЩЕСТВО</small></span></a>
        <span>© {new Date().getFullYear()} Древень. Создаём сообщество вместе.</span>
        <a href="#about">Наверх ↑</a>
      </footer>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap');
        :root{--bg:#0a100d;--panel:#111a14;--green:#b8e986;--muted:#a0aea3;--line:#29352c;--white:#f0f4ed}
        *{box-sizing:border-box}html{scroll-behavior:smooth}body{background:var(--bg);color:var(--white);font-family:'DM Sans',sans-serif}
        a{color:inherit;text-decoration:none}.site-shell{max-width:1440px;margin:0 auto;padding:0 6.2%}.topbar{height:92px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);gap:24px}
        .brand{display:flex;align-items:center;gap:10px;font-family:Manrope,sans-serif;font-size:15px;font-weight:800;letter-spacing:2px}.brand-mark{display:grid;place-items:center;width:37px;height:37px;border:1px solid #526b4d;border-radius:12px;color:var(--green);font-size:22px}.brand small{display:block;font:9px 'DM Sans',sans-serif;color:var(--muted);letter-spacing:1.6px;margin-top:3px}
        .nav{display:flex;gap:32px;color:#c0cbc0;font-size:13px}.nav a:hover,.footer>a:last-child:hover{color:var(--green)}.top-cta{border:1px solid #5a6b58;padding:12px 16px;border-radius:7px;font-size:12px;font-weight:700}.top-cta span,.primary-btn span{margin-left:12px;color:var(--green)}.menu-toggle{display:none}
        .hero{display:grid;grid-template-columns:1fr 0.9fr;gap:4%;align-items:center;padding:78px 0 72px;min-height:600px}.eyebrow{font-size:10px;letter-spacing:2.1px;font-weight:700;color:var(--green);display:flex;align-items:center;gap:9px}.live-dot{width:6px;height:6px;border-radius:50%;background:var(--green);box-shadow:0 0 12px #b8e986}
        h1,h2,h3,p{margin-top:0}h1,h2{font-family:Manrope,sans-serif;letter-spacing:-2.7px}h1{font-size:clamp(48px,6.5vw,84px);line-height:1.04;margin:25px 0 22px;font-weight:700}h1 em,h2 em{font-style:normal;color:var(--green)}.hero-text{font-size:15px;line-height:1.85;color:var(--muted);max-width:475px;margin-bottom:30px}.hero-actions{display:flex;align-items:center;gap:13px;flex-wrap:wrap}.primary-btn,.secondary-btn{display:inline-flex;align-items:center;justify-content:center;padding:15px 18px;border-radius:7px;font-size:12px;font-weight:700}.primary-btn{background:var(--green);color:#172015}.primary-btn span{color:#172015}.secondary-btn{border:1px solid var(--line);color:#d7dfd6}.hero-note{display:flex;align-items:center;gap:12px;margin-top:42px}.note-icon{display:grid;place-items:center;width:38px;height:38px;border:1px solid var(--line);border-radius:50%;color:var(--green)}.hero-note b,.hero-note small{display:block}.hero-note b{font-size:11px}.hero-note small{font-size:10px;color:var(--muted);margin-top:5px}
        .forest-art{height:435px;position:relative;overflow:hidden;border:1px solid #27392b;border-radius:12px;background:radial-gradient(ellipse at 50% 36%,#294b31 0%,#172b20 37%,#101a14 75%)}.forest-art:after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,#0a100d 0%,transparent 40%,#0a100d12 100%);pointer-events:none}.moon{position:absolute;top:60px;left:48%;width:83px;height:83px;border-radius:50%;background:#d7edbd;box-shadow:0 0 65px #b8e98655}.orb{position:absolute;width:4px;height:4px;border-radius:50%;background:#d5edb8;box-shadow:0 0 10px #d5edb8}.orb-one{top:70px;left:23%}.orb-two{top:130px;right:20%}.orb-three{top:45%;left:65%}
        .tree{position:absolute;bottom:15px;width:0;height:0;border-left:72px solid transparent;border-right:72px solid transparent;border-bottom:240px solid #24432c;filter:drop-shadow(0 0 18px #0004)}.tree i{position:absolute;display:block;width:0;height:0;border-left:60px solid transparent;border-right:60px solid transparent;border-bottom:95px solid #2d5436;left:-60px;top:35px}.tree i:nth-child(2){top:75px;left:-52px;border-left-width:52px;border-right-width:52px;border-bottom-width:90px}.tree i:nth-child(3){top:116px;left:-42px;border-left-width:42px;border-right-width:42px;border-bottom-width:75px}.tree b{position:absolute;width:13px;height:52px;background:#4c3f2b;top:235px;left:-6px}.tree-back{transform:scale(.72);transform-origin:bottom;opacity:.8;border-bottom-color:#1b3422}.tree-left{left:4%;bottom:7px}.tree-right{right:1%;bottom:2px;transform:scale(.85)}.tree-mid{left:43%;bottom:8px;transform:scale(1.12);border-bottom-color:#345b38}.tree-front{border-bottom-color:#13271a;transform:scale(1.1)}.tree-front-left{left:21%;bottom:-10px}.tree-front-right{right:15%;bottom:-12px;transform:scale(1.2)}.forest-caption{position:absolute;z-index:2;bottom:20px;left:20px;right:20px;display:flex;justify-content:space-between;color:#c2d2bc;font-size:9px;letter-spacing:1.3px}
        .ticker{display:flex;align-items:center;justify-content:space-around;gap:14px;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:23px 0;color:#d6dfd3;font-size:10px;letter-spacing:2px;font-weight:700}.ticker b{color:var(--green);font-size:14px}
        .features-section{padding:100px 0 95px}.section-heading{display:flex;justify-content:space-between;align-items:end;gap:30px;margin-bottom:38px}.section-heading h2,.community-panel h2{font-size:clamp(30px,4vw,47px);line-height:1.12;margin:15px 0 0}.section-heading>p{max-width:330px;color:var(--muted);font-size:13px;line-height:1.8;margin:0}.feature-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}.feature-card{position:relative;background:linear-gradient(145deg,#141f17,#0e1611);border:1px solid var(--line);border-radius:10px;padding:27px;min-height:220px}.feature-icon{font-size:23px;margin-bottom:24px}.feature-card h3{font-family:Manrope,sans-serif;font-size:16px;margin-bottom:11px}.feature-card p{color:var(--muted);font-size:12px;line-height:1.8;max-width:290px;margin-bottom:20px}.card-arrow{position:absolute;right:24px;top:25px;color:#6e8667}
        .community-panel{display:grid;grid-template-columns:70px 1fr auto;gap:22px;align-items:center;background:#17251a;border:1px solid #304831;border-radius:12px;padding:35px 38px}.panel-symbol{display:grid;place-items:center;width:60px;height:60px;border-radius:18px;background:#233c28;color:var(--green);font-size:34px}.community-panel h2{font-size:34px;margin:12px 0}.community-panel p{font-size:12px;line-height:1.8;color:var(--muted);max-width:560px;margin:0}.community-panel .primary-btn{white-space:nowrap}
        .rules-strip{padding:70px 0;border-bottom:1px solid var(--line)}.rules-list{display:flex;gap:clamp(18px,6vw,85px);flex-wrap:wrap;margin-top:24px}.rules-list span{font-size:13px}.rules-list b{font-size:10px;color:var(--green);margin-right:10px}
        .footer{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:28px 0 32px;color:var(--muted);font-size:10px}.footer .brand{color:var(--white)}.footer>a:last-child{color:#d9e1d7}
        @media(max-width:850px){.site-shell{padding:0 5%}.topbar{height:78px}.nav{gap:16px}.top-cta{display:none}.hero{grid-template-columns:1fr;gap:38px;padding:58px 0}.forest-art{height:370px}.section-heading{align-items:start;flex-direction:column}.community-panel{grid-template-columns:55px 1fr}.community-panel .primary-btn{grid-column:2;justify-self:start}.panel-symbol{width:50px;height:50px}.footer{flex-wrap:wrap}}
        @media(max-width:600px){.topbar{position:relative}.menu-toggle{display:block;margin-left:auto;background:transparent;color:var(--white);border:1px solid var(--line);border-radius:6px;padding:9px 12px;font-size:12px}.nav{display:none;position:absolute;z-index:5;top:68px;left:0;right:0;padding:18px;background:#111a14;border:1px solid var(--line);border-radius:8px;flex-direction:column}.nav-open{display:flex}.brand{font-size:13px}.brand-mark{width:32px;height:32px}h1{font-size:53px}.hero{padding-top:45px}.forest-art{height:320px}.tree{transform:scale(.82);transform-origin:bottom}.tree-right{transform:scale(.7)}.tree-mid{transform:scale(.85)}.tree-front-left{transform:scale(.8)}.tree-front-right{transform:scale(.85)}.ticker{flex-wrap:wrap;justify-content:center;font-size:9px;padding:17px 0}.ticker span:last-of-type,.ticker b:last-child{display:none}.features-section{padding:70px 0}.feature-grid{grid-template-columns:1fr}.feature-card{min-height:180px}.feature-icon{margin-bottom:17px}.community-panel{padding:24px;grid-template-columns:1fr}.community-panel .primary-btn{grid-column:1}.community-panel h2{font-size:30px}.rules-strip{padding:50px 0}.rules-list{flex-direction:column;gap:16px}.footer{align-items:flex-start;flex-direction:column}.footer .brand{margin-bottom:4px}}
      `}</style>
    </main>
  );
}
