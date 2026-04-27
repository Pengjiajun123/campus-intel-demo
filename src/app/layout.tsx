import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const stickerPreloads = [
  "/stickers/missed-blue-sad.png",
  "/stickers/overload-red-angry.png",
  "/stickers/busy-orange-nervous.png",
  "/stickers/urgent-yellow-uncomfortable.png",
  "/stickers/easy-pink-happy.png",
  "/stickers/clear-green-happy.png",
];

export const metadata: Metadata = {
  title: "校园情报局 Campus Intel",
  description: "面向大学生的 AI 校园信息整理助手 Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        {stickerPreloads.map((src) => (
          <link key={src} rel="preload" as="image" href={`${basePath}${src}`} type="image/png" />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
