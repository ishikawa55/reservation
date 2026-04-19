// src/features/reservation/actions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// 空き枠を取得する関数
export async function getAvailableSlots(dateStr: string, treatmentId: string) {
  // 1. 日付文字列(YYYY-MM-DD)から曜日を取得 (タイムゾーンを日本時間に固定)
  const date = new Date(`${dateStr}T00:00:00+09:00`);
  const dayOfWeek = date.getDay();

  // 2. 営業時間と治療内容を取得
  const [businessHour, treatment] = await Promise.all([
    prisma.businessHour.findUnique({ where: { dayOfWeek } }),
    prisma.treatment.findUnique({ where: { id: treatmentId } }),
  ]);

  if (!businessHour || businessHour.isClosed || !treatment) {
    return []; // 休診日または設定がない場合は空配列を返す
  }

  // 3. 該当日の既存予約を取得
  const startOfDay = new Date(`${dateStr}T00:00:00+09:00`);
  const endOfDay = new Date(`${dateStr}T23:59:59+09:00`);

  const existingReservations = await prisma.reservation.findMany({
    where: {
      startTime: { gte: startOfDay, lte: endOfDay },
      status: { not: "CANCELLED" },
    },
  });

  // 4. 空き枠の計算
  const availableSlots: string[] = [];
  const durationMs = treatment.duration * 60 * 1000;
  let currentTime = new Date(`${dateStr}T${businessHour.openTime}:00+09:00`);
  const closeTime = new Date(`${dateStr}T${businessHour.closeTime}:00+09:00`);

  // 30分間隔でスロットを検証
  while (currentTime.getTime() + durationMs <= closeTime.getTime()) {
    const slotStart = currentTime.getTime();
    const slotEnd = slotStart + durationMs;

    // 既存予約との重なり（ダブルブッキング）をチェック
    const isOverlapping = existingReservations.some((res) => {
      return slotStart < res.endTime.getTime() && slotEnd > res.startTime.getTime();
    });

    if (!isOverlapping) {
      const hours = currentTime.getHours().toString().padStart(2, "0");
      const minutes = currentTime.getMinutes().toString().padStart(2, "0");
      availableSlots.push(`${hours}:${minutes}`);
    }
    
    // 次のスロットへ（30分進める）
    currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
  }

  return availableSlots;
}

// 予約をDBに保存する関数
export async function createReservation(dateStr: string, timeStr: string, treatmentId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("ログインが必要です");

  const treatment = await prisma.treatment.findUnique({ where: { id: treatmentId } });
  if (!treatment) throw new Error("治療メニューが見つかりません");

  const startTime = new Date(`${dateStr}T${timeStr}:00+09:00`);
  const endTime = new Date(startTime.getTime() + treatment.duration * 60 * 1000);

  // 最終チェック（誰かが直前に予約を取っていないか）
  const existing = await prisma.reservation.findFirst({
    where: {
      startTime: { lt: endTime },
      endTime: { gt: startTime },
      status: { not: "CANCELLED" },
    },
  });

  if (existing) {
    throw new Error("申し訳ありません、この時間はすでに予約が埋まってしまいました。");
  }

  await prisma.reservation.create({
    data: {
      userId: session.user.id,
      treatmentId,
      startTime,
      endTime,
      status: "CONFIRMED",
    },
  });
}

// 自分の予約一覧を取得する
export async function getMyAppointments() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return [];

  return await prisma.reservation.findMany({
    where: { 
      userId: session.user.id,
      status: "CONFIRMED", // 確定済みのものだけ
      startTime: { gte: new Date() } // 未来の予約だけ表示（任意）
    },
    include: {
      treatment: true // 治療内容（名前や時間）も一緒に取得
    },
    orderBy: {
      startTime: 'asc'
    }
  });
}

// 予約をキャンセルする
export async function cancelReservation(formData: FormData) {
  const id = formData.get("id") as string;
  
  await prisma.reservation.update({
    where: { id },
    data: { status: 'CANCELLED' }
  });

  revalidatePath("/");
}
