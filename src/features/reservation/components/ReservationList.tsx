// src/features/reservation/components/ReservationList.tsx

import { cancelReservation } from "../actions";

type Appointment = {
  id: string;
  startTime: Date;
  treatment: { name: string };
};

export default function ReservationList({ appointments }: { appointments: Appointment[] }) {
  if (appointments.length === 0) {
    return <p className="text-gray-500 py-4">現在、予定されている予約はありません。</p>;
  }

  return (
    <div className="space-y-3">
      {appointments.map((app) => (
        <div key={app.id} className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm">
          <div>
            <div className="font-bold text-lg">
              {app.startTime.toLocaleString("ja-JP", {
                month: "short",
                day: "numeric",
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="text-sm text-gray-600">{app.treatment.name}</div>
          </div>
          <form action={cancelReservation}>
            <input type="hidden" name="id" value={app.id} />
            <button className="text-red-500 text-sm font-bold hover:underline">
              キャンセル
            </button>
          </form>
        </div>
      ))}
    </div>
  );
}
