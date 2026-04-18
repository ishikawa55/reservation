// src/features/treatment/actions.ts

"use client";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 治療一覧を取得する関数
export async function getTreatments() {
  return await prisma.treatment.findMany({
    orderBy: { name: 'asc' }
  });
}

// 治療を追加する関数
export async function createTreatment(formData: FormData) {
  const name = formData.get("name") as string;
  const duration = parseInt(formData.get("duration") as string);

  await prisma.treatment.create({
    data: { name, duration }
  });

  // 画面のデータを最新に更新する
  revalidatePath("/doctor/treatments");
}

// 治療を削除する関数
export async function deleteTreatment(id: string) {
  await prisma.treatment.delete({
    where: { id }
  });
  revalidatePath("/doctor/treatments");
}
