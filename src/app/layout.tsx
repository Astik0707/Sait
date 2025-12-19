import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sansFont = Inter({
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pach Group — Недвижимость в Нальчике | Продажа и Аренда",
  description:
    "Pach Group — ваш надёжный партнёр по недвижимости в Нальчике. Продажа и аренда квартир, домов и коммерческой недвижимости. Полное сопровождение сделок.",
  keywords: [
    "недвижимость Нальчик",
    "купить квартиру Нальчик",
    "аренда Нальчик",
    "Pach Group",
    "агентство недвижимости",
  ],
  authors: [{ name: "Pach Group" }],
  openGraph: {
    title: "Pach Group — Недвижимость в Нальчике",
    description:
      "Продажа и аренда недвижимости в Нальчике. Полное сопровождение сделок от заявки до ключей.",
    type: "website",
    locale: "ru_RU",
    siteName: "Pach Group",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pach Group — Недвижимость в Нальчике",
    description: "Продажа и аренда недвижимости в Нальчике",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

