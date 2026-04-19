// src/features/treatment/components/TreatmentForm.tsx

"use client";

import { useRef } from "react";
import { createTreatment } from "../actions";
import toast from "react-hot-toast";

export default function TreatmentForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    // 新しく作ったZodバリデーション付きのアクションを呼び出す
    const result = await createTreatment(formData);

    if (result?.error) {
      toast.error(result.error); // Zodが弾いたエラーを赤いトーストで表示
    } else {
      toast.success("治療メニューを登録しました");
      formRef.current?.reset(); // 成功したら入力欄を空にする
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
      <h2 className="text-lg font-semibold mb-4">新規メニュー登録</h2>
      {/* actionにhandleSubmitを指定 */}
      <form ref={formRef} action={handleSubmit} className="flex gap-4">
        <input
          name="name"
          placeholder="治療名 (例: 定期検診)"
          required
          className="flex-grow border rounded px-3 py-2"
        />
        <input
          name="duration"
          type="number"
          placeholder="所要時間 (分)"
          required
          className="w-32 border rounded px-3 py-2"
        />
        <button className="bg-blue-600 text-white px-6 py-2 rounded font-bold hover:bg-blue-700">
          登録
        </button>
      </form>
    </div>
  );
}
