// src/app/doctor/reservations/page.tsx

import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { cancelReservation } from "@/features/reservation/actions";

export default async function DoctorReservationsPage() {
  // 今日以降のすべての予約を取得し、患者情報(user)と治療情報(treatment)も一緒に取ってくる
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 今日の0時0分を基準にする

  const reservations = await prisma.reservation.findMany({
    where: {
      startTime: { gte: today },
    },
    include: {
      user: { select: { name: true, email: true } }, // 患者の名前とメアド
      treatment: { select: { name: true, duration: true } }, // 治療内容
    },
    orderBy: {
      startTime: "asc",
    },
  });

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">全体の予約スケジュール</h1>
        <Link href="/" className="text-blue-600 hover:underline">← ダッシュボードへ</Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {reservations.length === 0 ? (
          <p className="p-6 text-gray-500 text-center">現在、今後の予約は入っていません。</p>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 font-semibold text-gray-700">日時</th>
                <th className="px-6 py-3 font-semibold text-gray-700">患者名</th>
                <th className="px-6 py-3 font-semibold text-gray-700">治療内容</th>
                <th className="px-6 py-3 font-semibold text-gray-700">ステータス</th>
                <th className="px-6 py-3 font-semibold text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reservations.map((res) => {
                const isCancelled = res.status === "CANCELLED";
                return (
                  <tr key={res.id} className={`hover:bg-gray-50 ${isCancelled ? "bg-gray-100 opacity-60" : ""}`}>
                    <td className="px-6 py-4">
                      {res.startTime.toLocaleString("ja-JP", {
                        month: "short", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit"
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{res.user.name}</div>
                      <div className="text-xs text-gray-500">{res.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {res.treatment.name} <span className="text-sm text-gray-500">({res.treatment.duration}分)</span>
                    </td>
                    <td className="px-6 py-4">
                      {isCancelled ? (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">キャンセル済</span>
                      ) : (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">予約確定</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {/* 患者側で作ったキャンセルアクションを院長側でも使い回します */}
                      {!isCancelled && (
                        <form action={cancelReservation}>
                          <input type="hidden" name="id" value={res.id} />
                          <button className="text-red-500 hover:text-red-700 text-sm font-bold border border-red-500 px-3 py-1 rounded hover:bg-red-50 transition-colors">
                            院長権限で取消
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
