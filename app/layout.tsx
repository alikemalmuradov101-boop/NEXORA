import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Древень — игровое сообщество",
  description: "Древень — место для игроков, общения и совместных приключений.",
  applicationName: "Древень",
  keywords: ["Древень", "игры", "сообщество", "геймеры", "чат"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
