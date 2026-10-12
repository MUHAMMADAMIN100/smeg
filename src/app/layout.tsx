import type { Metadata, Viewport } from "next";
import { Prata, Onest } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { site } from "@/data/site";

const prata = Prata({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  variable: "--font-prata",
  display: "swap",
});

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "SMEG Tajikistan — итальянская техника в стиле 50-х",
    template: "%s — SMEG Tajikistan",
  },
  description:
    "Официальный партнёр SMEG в Таджикистане. Холодильники, плиты, печи, кофемашины, тостеры и чайники в фирменных пастельных цветах. Заказ в WhatsApp и Telegram.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "SMEG Tajikistan",
    title: "SMEG Tajikistan — итальянская техника в стиле 50-х",
    description:
      "Официальный партнёр SMEG в Таджикистане. Итальянская премиальная техника в фирменных пастельных цветах.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#121110" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${prata.variable} ${onest.variable}`}
    >
      <body className="grain min-h-dvh flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          storageKey="smeg-theme"
        >
          <Header />
          <main className="flex-1 pt-[72px]">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
