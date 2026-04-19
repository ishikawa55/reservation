// src/features/reservation/components/DoctorCalendar.tsx

"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  backgroundColor: string;
  borderColor: string;
};

export default function DoctorCalendar({ events }: { events: CalendarEvent[] }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-8">
      {/* FullCalendarの各種設定
        - timeGridWeek: 最初は「週・時間指定」のビューで表示
        - headerToolbar: 上部のボタン配置
        - slotMinTime/slotMaxTime: 表示する時間の範囲（朝8時〜夜20時）
      */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        height="auto"
        slotMinTime="08:00:00"
        slotMaxTime="20:00:00"
        locale="ja"
        buttonText={{
          today: "今日",
          month: "月",
          week: "週",
          day: "日",
        }}
        allDaySlot={false} // 終日予定の枠は非表示
      />
    </div>
  );
}
