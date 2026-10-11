import type { Metadata } from "next";

export const metadata: Metadata = {
title: "NEXORA — Твой мир. Твои правила.",
description: "NEXORA — современная цифровая платформа.",
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
