import type { Metadata, Viewport } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";

export const metadata: Metadata = {
  title: "明天见吗 · 百业门户",
  description: "《燕云十六声》百业「明天见吗」官方门户 —— 介绍、成员、活动与招募",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "明天见吗",
  },
  icons: {
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0d0d11",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="mx-auto flex min-h-screen w-full max-w-[480px] flex-col bg-ink-900 shadow-2xl">
          <main className="flex-1 pb-24">{children}</main>
        </div>
        <BottomNav />
        <SplashScreen />
      </body>
    </html>
  );
}
