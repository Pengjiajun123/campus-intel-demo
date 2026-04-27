"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { mockIntelCards } from "@/data/mockIntel";
import { getIntelScheduleKey, sortIntelByUrgency } from "@/lib/intelSelectors";
import { getStatusCopy, isMissedIntel, isWithin24Hours, type StickerMood, type StickerStatus } from "@/lib/status";
import type { IntelCard } from "@/lib/types";

const calendarDays = [
  { key: "2026-04-27", label: "27", weekday: "一" },
  { key: "2026-04-28", label: "28", weekday: "二" },
  { key: "2026-04-29", label: "29", weekday: "三" },
  { key: "2026-04-30", label: "30", weekday: "四" },
  { key: "2026-05-01", label: "1", weekday: "五" },
  { key: "2026-05-02", label: "2", weekday: "六" },
  { key: "2026-05-03", label: "3", weekday: "日" },
];

const moodColor: Record<StickerMood, string> = {
  missed: "#6fb8ff",
  overload: "#ff6b5f",
  busy: "#ff9b45",
  urgent: "#ffd84d",
  easy: "#ff9ecf",
  clear: "#71d66b",
};

export function CampusCalendar() {
  const [selectedKey, setSelectedKey] = useState("2026-04-27");
  const dayMap = useMemo(
    () =>
      calendarDays.map((day) => {
        const items = sortIntelByUrgency(mockIntelCards.filter((card) => getIntelScheduleKey(card) === day.key));
        const status = getCalendarDayStatus(items);

        return {
          ...day,
          items,
          status,
          color: moodColor[status.mood],
        };
      }),
    [],
  );
  const selected = dayMap.find((day) => day.key === selectedKey) ?? dayMap[0];

  return (
    <section className="sticker-card-sm bg-[#fffdf8] p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-[#75685f]">校园日历</p>
          <h2 className="text-2xl font-black leading-tight text-[#283044]">这周哪天最挤？</h2>
        </div>
        <span className="rounded-full bg-[#ffd84d] px-3 py-1 text-xs font-black">4月</span>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5" role="list" aria-label="一周校园事项日历">
        {dayMap.map((day) => (
          <button
            key={day.key}
            type="button"
            onClick={() => setSelectedKey(day.key)}
            className={`calendar-day ${selectedKey === day.key ? "is-selected" : ""}`}
            aria-pressed={selectedKey === day.key}
          >
            <span className="text-[0.68rem] font-black text-[#75685f]">{day.weekday}</span>
            <span className="text-lg font-black leading-none">{day.label}</span>
            <span className="calendar-dot" style={{ background: day.color }} />
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-[26px] border-[5px] border-white bg-[#f7f1ed] p-4" aria-live="polite">
        <div className="flex items-center justify-between gap-3">
          <p className="text-lg font-black">{selected.weekday} · {selected.label} 日</p>
          <span className="rounded-full px-3 py-1 text-xs font-black" style={{ background: selected.color }}>
            {selected.status.shortLabel}
          </span>
        </div>

        <div className="mt-3 grid gap-2">
          {selected.items.length > 0 ? (
            selected.items.slice(0, 3).map((item) => (
              <Link
                key={item.id}
                href={`/intel/${item.id}`}
                className="rounded-[20px] bg-white px-3 py-3 text-sm font-black leading-5 text-[#283044] transition hover:-translate-y-0.5"
              >
                {item.title}
              </Link>
            ))
          ) : (
            <p className="rounded-[20px] bg-white px-3 py-3 text-sm font-black text-[#283044]/70">
              这天暂时清爽，可以用来补材料或看机会。
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

function getCalendarDayStatus(items: IntelCard[]): StickerStatus {
  if (items.length === 0) {
    return getStatusCopy("clear");
  }

  if (items.some(isMissedIntel)) {
    return getStatusCopy("missed");
  }

  const highCount = items.filter((item) => item.priority === "高").length;
  const within24Count = items.filter(isWithin24Hours).length;

  if (highCount >= 3 || within24Count >= 2) {
    return getStatusCopy("overload");
  }

  if (items.length >= 3) {
    return getStatusCopy("busy");
  }

  if (highCount > 0 || within24Count > 0) {
    return getStatusCopy("urgent");
  }

  return getStatusCopy("easy");
}
