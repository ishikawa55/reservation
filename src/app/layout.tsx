// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layouts/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "歯科予約システム",
  description: "小規模クリニック向けの予約管理システム",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 全画面共通でセッション（ログイン情報）を取得
  const session = await getServerSession(authOptions);

  return (
    <html lang="ja">
      <body className={`${inter.className} bg-gray-50 text-gray-800 min-h-screen flex flex-col`}>
        {/* 画面の中央上に通知が出るように設定 */}
        <Toaster position="top-center" />

        {/* 作成したヘッダーを配置。ログインしていれば名前を渡す */}
        <Header userName={session?.user?.name || undefined} />
        
        {/* 各ページのコンテンツ（page.tsxの中身）がここに入ります */}
        <div className="flex-grow">
          {children}
        </div>
      </body>
    </html>
  );
}
