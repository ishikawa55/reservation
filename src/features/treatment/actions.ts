// src/features/treatment/actions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { treatmentSchema } from "@/types/schemas";

// 治療一覧を取得する関数
export async function getTreatments() {
  return await prisma.treatment.findMany({
    orderBy: { name: 'asc' }
  });
}

// 治療を追加する関数
export async function createTreatment(formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    duration: formData.get("duration"),
  };

  const validatedFields = treatmentSchema.safeParse(rawData);

  if (!validatedFields.success) {
    const errorMessage = validatedFields.error.issues[0]?.message || "入力内容にエラーがあります";
    return { error: errorMessage };
  }

  const { name, duration } = validatedFields.data;

  // DBに保存
  await prisma.treatment.create({
    data: { name, duration }
  });

  // 画面のデータを最新に更新する
  revalidatePath("/doctor/treatments");
  return { success: true };
}

// 治療を削除する関数
export async function deleteTreatment(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.treatment.delete({ where: { id } });
  revalidatePath("/doctor/treatments");
}
