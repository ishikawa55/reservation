// src/app/doctor/business-hours/page.tsx

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import Link from "next/link";

export default async function BusinessHoursPage() {
  const hours = await prisma.businessHour.findMany({
    orderBy: { dayOfWeek: "asc" },
  });

  const dayNames = ["日", "月", "火", "水", "木", "金", "土"];

  async function updateHours(formData: FormData) {
    "use server";
    const dayOfWeek = parseInt(formData.get("dayOfWeek") as string);
    const openTime = formData.get("openTime") as string;
    const closeTime = formData.get("closeTime") as string;
    const isClosed = formData.get("isClosed") === "on";

    await prisma.businessHour.upsert({
      where: { dayOfWeek },
      update: { openTime, closeTime, isClosed },
      create: { dayOfWeek, openTime, closeTime, isClosed },
    });
    revalidatePath("/doctor/business-hours");
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">診察時間設定</h1>
        <Link href="/" className="text-blue-600 hover:underline">← 戻る</Link>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">曜日</th>
              <th className="px-6 py-3 text-left">診察時間</th>
              <th className="px-6 py-3 text-left">休診</th>
              <th className="px-6 py-3 text-left">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {dayNames.map((name, index) => {
              const setting = hours.find((h) => h.dayOfWeek === index);
              const formId = `form-day-${index}`; // 行ごとに一意のフォームIDを作成

              return (
                <tr key={index}>
                  <td className="px-6 py-4 font-bold">
                    {/* formタグはtdの中に隠しておき、IDをつける */}
                    <form id={formId} action={updateHours}>
                      <input type="hidden" name="dayOfWeek" value={index} />
                    </form>
                    {name}曜日
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <input
                        form={formId} // 外部のinputをformに紐付ける
                        name="openTime"
                        type="time"
                        defaultValue={setting?.openTime || "09:00"}
                        className="border rounded px-2 py-1"
                      />
                      <span>〜</span>
                      <input
                        form={formId} // 外部のinputをformに紐付ける
                        name="closeTime"
                        type="time"
                        defaultValue={setting?.closeTime || "18:00"}
                        className="border rounded px-2 py-1"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input
                      form={formId} // 外部のinputをformに紐付ける
                      name="isClosed"
                      type="checkbox"
                      defaultChecked={setting?.isClosed || false}
                      className="w-5 h-5"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      form={formId} // 外部のbuttonをformに紐付ける
                      className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      保存
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
