// src/types/schemas.ts

import { z } from "zod";

// 治療メニューのバリデーション
export const treatmentSchema = z.object({
  name: z.string().min(1, "治療名は必須です").max(50, "50文字以内で入力してください"),
  duration: z.coerce.number().min(15, "最短15分以上で設定してください").max(180, "最大180分以内で設定してください"),
});

// 予約作成のバリデーション
export const reservationSchema = z.object({
  dateStr: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "正しい日付形式ではありません"),
  timeStr: z.string().regex(/^\d{2}:\d{2}$/, "正しい時刻形式ではありません"),
  treatmentId: z.string().cuid("不正な治療IDです"),
});
