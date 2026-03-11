"use client";

import { useState, useEffect, useCallback } from "react";

interface DayRecord {
  date: string;
  count: number;
}

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDate(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export default function Calendar() {
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1); // 1-indexed
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [records, setRecords] = useState<DayRecord[]>([]);
  const [monthTotal, setMonthTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);

  const fetchRecords = useCallback(async () => {
    setFetching(true);
    try {
      const res = await fetch(`/api/records?year=${currentYear}&month=${currentMonth}`);
      const data = await res.json();
      if (data.success) {
        setRecords(data.records);
        setMonthTotal(data.monthTotal);
      }
    } finally {
      setFetching(false);
    }
  }, [currentYear, currentMonth]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const getCount = (dateStr: string) =>
    records.find((r) => r.date === dateStr)?.count ?? 0;

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth - 1, 1).getDay();
  const todayStr = formatDate(today.getFullYear(), today.getMonth() + 1, today.getDate());

  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const handleDone = async () => {
    if (!selectedDate || loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/done", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: selectedDate }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchRecords();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 max-w-sm mx-auto">
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPrevMonth}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 text-lg font-light"
          aria-label="Previous month"
        >
          ‹
        </button>
        <div className="text-center">
          <div className="font-semibold text-gray-800">
            {MONTH_NAMES[currentMonth - 1]} {currentYear}
          </div>
          <div className="text-sm text-gray-500 mt-0.5">
            {fetching ? (
              <span className="text-gray-300">Loading…</span>
            ) : (
              <>
                Month total:{" "}
                <span className="font-semibold text-blue-600">{monthTotal}</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={goToNextMonth}
          className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors text-gray-600 text-lg font-light"
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-gray-400 py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Empty cells before the 1st */}
        {Array.from({ length: firstDayOfWeek }, (_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {/* Day cells */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = formatDate(currentYear, currentMonth, day);
          const count = getCount(dateStr);
          const isSelected = selectedDate === dateStr;
          const isToday = dateStr === todayStr;

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(isSelected ? null : dateStr)}
              className={[
                "relative flex flex-col items-center justify-center rounded-xl py-1.5 transition-all select-none",
                isSelected
                  ? "bg-blue-500 text-white shadow-sm"
                  : isToday
                  ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200"
                  : "hover:bg-gray-50 text-gray-700",
              ].join(" ")}
              aria-label={`${dateStr}${count > 0 ? `, done ${count} times` : ""}`}
              aria-pressed={isSelected}
            >
              <span className="text-sm font-medium leading-none">{day}</span>
              {count > 0 && (
                <span
                  className={[
                    "text-xs font-semibold leading-none mt-0.5",
                    isSelected ? "text-blue-100" : "text-blue-500",
                  ].join(" ")}
                >
                  ×{count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Done button */}
      <div className="mt-6">
        <button
          onClick={handleDone}
          disabled={!selectedDate || loading}
          className={[
            "w-full py-3 rounded-xl font-semibold text-sm transition-all",
            selectedDate && !loading
              ? "bg-blue-500 hover:bg-blue-600 active:scale-[0.98] text-white shadow-sm"
              : "bg-gray-100 text-gray-400 cursor-not-allowed",
          ].join(" ")}
        >
          {loading
            ? "Saving…"
            : selectedDate
            ? "Done"
            : "Select a date first"}
        </button>
      </div>

      {selectedDate && (
        <p className="text-center text-xs text-gray-400 mt-2">
          Selected: {selectedDate}
          {getCount(selectedDate) > 0 && ` · done ${getCount(selectedDate)}×`}
        </p>
      )}
    </div>
  );
}
