export default function Home() {
return (
<main style={{
minHeight: "100vh",
background: "linear-gradient(135deg, #050816, #101b3d, #061c2c)",
color: "white",
fontFamily: "Arial, sans-serif",
padding: "40px 20px",
boxSizing: "border-box"
}}>
<header style={{
maxWidth: "1000px",
margin: "0 auto",
display: "flex",
justifyContent: "space-between",
alignItems: "center",
flexWrap: "wrap",
gap: "16px"
}}>
<h1 style={{ color: "#55d8ff", letterSpacing: "3px" }}>NEXORA</h1>
<nav>
<a href="#features" style={{ color: "white", marginRight: "18px" }}>Возможности</a>
<a href="#about" style={{ color: "white" }}>О проекте</a>
</nav>
</header>

  <section style={{
    maxWidth: "1000px",
    margin: "100px auto 70px",
    textAlign: "center"
  }}>
    <p style={{ color: "#55d8ff", letterSpacing: "4px" }}>
      НОВОЕ ПРОСТРАНСТВО ВОЗМОЖНОСТЕЙ
    </p>
    <h2 style={{ fontSize: "clamp(40px, 8vw, 76px)", margin: "20px 0" }}>
      Твой мир. Твои правила.
    </h2>
    <p style={{ color: "#b8c5df", fontSize: "18px", lineHeight: 1.8 }}>
      NEXORA — современная цифровая платформа для новых идей,
      проектов и возможностей.
    </p>
    <a href="#features" style={{
      display: "inline-block",
      marginTop: "24px",
      padding: "15px 30px",
      background: "#39cfff",
      color: "#06111f",
      borderRadius: "12px",
      fontWeight: "bold",
      textDecoration: "none"
    }}>
      Исследовать
    </a>
  </section>

  <section id="features" style={{
    maxWidth: "1000px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px"
  }}>
    {[
      ["🚀", "Новые возможности", "Открывай новые идеи и развивай свои проекты."],
      ["🌐", "Единая платформа", "Удобное пространство для цифровых решений."],
      ["🔒", "Безопасность", "Мы стремимся сделать работу простой и надёжной."]
    ].map(([icon, title, description]) => (
      <article key={title} style={{
        padding: "26px",
        border: "1px solid #263d65",
        borderRadius: "18px",
        background: "rgba(20, 37, 70, 0.65)"
      }}>
        <div style={{ fontSize: "32px" }}>{icon}</div>
        <h3>{title}</h3>
        <p style={{ color: "#b8c5df", lineHeight: 1.7 }}>{description}</p>
      </article>
    ))}
  </section>

  <footer id="about" style={{
    textAlign: "center",
    marginTop: "80px",
    color: "#8294b6"
  }}>
    © 2026 NEXORA. Все права защищены.
  </footer>
</main>

);
}
