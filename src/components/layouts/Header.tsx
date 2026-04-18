// src/components/layouts/Header.tsx

"use client";

import { signOut } from "next-auth/react";

type HeaderProps = {
  userName?: string;
};

export default function Header({ userName }: HeaderProps) {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="text-xl font-bold tracking-wider">
          🦷 歯科予約システム
        </div>
        
        {userName && (
          <div className="flex items-center gap-4">
            <span className="text-sm opacity-90">{userName} さん</span>
            <button
              onClick={() => signOut()}
              className="bg-white text-blue-600 px-3 py-1 text-sm rounded-md font-semibold hover:bg-blue-50 transition-colors"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
