// src/app/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  // サーバー側でログイン状態を取得
  const session = await getServerSession(authOptions);

  // ログインしていなければ、NextAuthのログイン画面へ強制リダイレクト
  if (!session) {
    redirect("/api/auth/signin");
  }

  // session.user.role には "DOCTOR" か "PATIENT" が入っています
  const isDoctor = session.user.role === "DOCTOR";

  return (
    <main className="min-h-screen p-8 bg-gray-50 text-gray-800">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 border-b pb-2">歯科予約システム</h1>
        
        <div className="mb-8">
          <p className="text-lg">ようこそ、<span className="font-bold">{session.user.name}</span> さん</p>
          <p className="text-sm text-gray-500 mt-1">
            権限: {isDoctor ? "院長（管理者）" : "患者"}
          </p>
        </div>

        {/* ロールによる表示の切り替え */}
        {isDoctor ? (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-md">
            <h2 className="text-xl font-bold text-blue-800 mb-4">🏥 院長用ダッシュボード</h2>
            <p className="mb-4">ここに以下の機能を実装していきます：</p>
            <ul className="list-disc ml-6 space-y-2 text-blue-900">
              <li>本日の予約一覧とスケジュール管理</li>
              <li>
                <Link href="/doctor/treatments" className="underline font-bold">
                治療メニュー（所要時間）の登録・編集
                </Link>
              </li>
              <li>
                <Link href="/doctor/business-hours" className="underline font-bold hover:text-blue-700">
                休診日や営業時間の枠設定
                </Link>
              </li>
            </ul>
          </div>
        ) : (
          <div className="p-6 bg-green-50 border border-green-200 rounded-md">
            <h2 className="text-xl font-bold text-green-800 mb-4">🦷 患者用ダッシュボード</h2>
            <p className="mb-4">ここに以下の機能を実装していきます：</p>
            <ul className="list-disc ml-6 space-y-2 text-green-900">
              <li>新規予約の作成（空き時間の検索）</li>
              <li>過去の予約履歴の確認</li>
              <li>予約のキャンセル手続き</li>
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
