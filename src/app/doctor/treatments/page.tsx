// src/app/doctor/treatments/page.tsx

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import TreatmentForm from "@/features/treatment/components/TreatmentForm";
import { deleteTreatment } from "@/features/treatment/actions";

export default async function TreatmentManagementPage() {
  const treatments = await prisma.treatment.findMany({
    orderBy: { duration: "asc" },
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">治療メニュー管理</h1>
        <Link href="/" className="text-blue-600 hover:underline">← ダッシュボードへ</Link>
      </div>

      {/* 先ほど作ったクライアントコンポーネントを配置 */}
      <TreatmentForm />

      {/* 一覧表示 */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-700">治療名</th>
              <th className="px-6 py-3 font-semibold text-gray-700">所要時間</th>
              <th className="px-6 py-3 font-semibold text-gray-700">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {treatments.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{t.name}</td>
                <td className="px-6 py-4">{t.duration} 分</td>
                <td className="px-6 py-4">
                  {/* 削除も新しいアクションファイルのものを使います */}
                  <form action={deleteTreatment}>
                    <input type="hidden" name="id" value={t.id} />
                    <button className="text-red-500 hover:text-red-700 text-sm font-bold">
                      削除
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {treatments.length === 0 && (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  登録されているメニューはありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
