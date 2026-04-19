// src/features/reservation/components/ReservationForm.tsx

"use client";

import { useState } from "react";
import { getAvailableSlots, createReservation } from "../actions";
import { useRouter } from "next/navigation";

type Treatment = { id: string; name: string; duration: number };

export default function ReservationForm({ treatments }: { treatments: Treatment[] }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [treatmentId, setTreatmentId] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 空き枠検索ボタンの処理
  const handleSearch = async () => {
    if (!date || !treatmentId) return;
    setIsLoading(true);
    setSelectedSlot("");
    try {
      const slots = await getAvailableSlots(date, treatmentId);
      setAvailableSlots(slots);
    } catch (error) {
      alert("空き枠の取得に失敗しました");
    }
    setIsLoading(false);
  };

  // 予約確定ボタンの処理
  const handleReserve = async () => {
    if (!date || !treatmentId || !selectedSlot) return;
    setIsLoading(true);
    try {
      await createReservation(date, selectedSlot, treatmentId);
      alert("予約が完了しました！");
      router.push("/"); // トップページへ戻る
    } catch (error: any) {
      alert(error.message || "予約に失敗しました");
    }
    setIsLoading(false);
  };

  // 過去の日付を選べないようにするための「今日の日付」
  const today = new Date().toLocaleDateString("ja-JP").split('/').map(p => p.padStart(2, '0')).join('-');

  return (
    <div className="bg-white p-6 rounded-lg shadow border">
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">治療内容</label>
          <select
            className="w-full border rounded px-3 py-2 bg-white"
            value={treatmentId}
            onChange={(e) => { setTreatmentId(e.target.value); setAvailableSlots([]); }}
          >
            <option value="">選択してください</option>
            {treatments.map((t) => (
              <option key={t.id} value={t.id}>{t.name} ({t.duration}分)</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">希望日</label>
          <input
            type="date"
            min={today}
            className="w-full border rounded px-3 py-2"
            value={date}
            onChange={(e) => { setDate(e.target.value); setAvailableSlots([]); }}
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={!date || !treatmentId || isLoading}
          className="w-full bg-green-600 text-white py-2 rounded font-bold disabled:bg-gray-300 hover:bg-green-700"
        >
          {isLoading ? "検索中..." : "空き時間を検索"}
        </button>
      </div>

      {availableSlots.length > 0 && (
        <div className="border-t pt-4 animate-fade-in">
          <h3 className="font-bold mb-3">予約可能な時間</h3>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {availableSlots.map((slot) => (
               <button
                 key={slot}
                 onClick={() => setSelectedSlot(slot)}
                 className={`py-2 rounded border text-center transition-colors ${
                   selectedSlot === slot 
                     ? "bg-green-100 border-green-500 font-bold text-green-800" 
                     : "hover:bg-gray-50"
                 }`}
               >
                 {slot}
               </button>
            ))}
          </div>
          <button
            onClick={handleReserve}
            disabled={!selectedSlot || isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded font-bold disabled:bg-gray-300 hover:bg-blue-700"
          >
            {selectedSlot ? `${selectedSlot} で予約を確定する` : "時間を選択してください"}
          </button>
        </div>
      )}

      {date && treatmentId && availableSlots.length === 0 && !isLoading && (
        <div className="text-red-500 text-center py-4 border-t bg-red-50 rounded mt-4">
          選択された日は予約がいっぱいです。<br/>別の治療内容か、別の日付をお試しください。
        </div>
      )}
    </div>
  );
}
