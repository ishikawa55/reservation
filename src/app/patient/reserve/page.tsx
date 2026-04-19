// src/app/patient/reserve/page.tsx

import { prisma } from "@/lib/prisma";
import ReservationForm from "@/features/reservation/components/ReservationForm";
import Link from "next/link";

export default async function ReservePage() {
  // DBから治療メニューを取得してフォームに渡す
  const treatments = await prisma.treatment.findMany({
    orderBy: { duration: "asc" }
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">新規予約</h1>
        <Link href="/" className="text-blue-600 hover:underline">← 戻る</Link>
      </div>
      
      <ReservationForm treatments={treatments} />
    </div>
  );
}
