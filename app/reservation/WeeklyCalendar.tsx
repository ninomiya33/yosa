import React, { useState } from 'react';

const TIMES = Array.from({ length: 25 }, (_, i) => {
  const hour = 9 + Math.floor(i / 2);
  const min = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${min}`;
});

function getWeekDates(startDate: Date) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    dates.push(new Date(d));
  }
  return dates;
}

const TABS = [
  { label: '今週', offset: 0 },
  { label: '1ヶ月先', offset: 28 },
  { label: '3ヶ月先', offset: 84 },
];

export default function WeeklyCalendar({ selected, onSelect }: { selected: { date: string, time: string } | null, onSelect: (date: string, time: string) => void }) {
  const [tab, setTab] = useState(0);
  const [weekOffset, setWeekOffset] = useState(0);
  const today = new Date();
  today.setHours(0,0,0,0);
  const baseDate = new Date(today);
  baseDate.setDate(today.getDate() + TABS[tab].offset + weekOffset * 7);
  const weekDates = getWeekDates(baseDate);

  return (
    <div className="w-full">
      {/* タブ */}
      <div className="flex gap-1 md:gap-2 mb-3">
        {TABS.map((t, i) => (
          <button 
            key={t.label} 
            className={`flex-1 px-2 md:px-4 py-2 text-xs md:text-sm rounded-t-lg transition-colors ${
              tab === i 
                ? 'bg-pink-500 text-white shadow-md' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`} 
            onClick={() => { setTab(i); setWeekOffset(0); }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 週ナビゲーション */}
      <div className="flex justify-between items-center mb-3 px-2">
        <button 
          onClick={() => setWeekOffset(w => w - 1)} 
          disabled={weekOffset === 0} 
          className="px-2 py-1 text-xs md:text-sm bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition-colors"
        >
          前の週
        </button>
        <span className="font-semibold text-xs md:text-sm text-gray-700">
          {weekDates[0].toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })} ~ {weekDates[6].toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' })}
        </span>
        <button 
          onClick={() => setWeekOffset(w => w + 1)} 
          className="px-2 py-1 text-xs md:text-sm bg-gray-200 rounded hover:bg-gray-300 transition-colors"
        >
          次の週
        </button>
      </div>

      {/* カレンダーコンテナ */}
      <div className="relative border border-gray-200 rounded-lg overflow-hidden">
        {/* 固定ヘッダー（時間列） */}
        <div className="absolute left-0 top-0 w-16 md:w-20 bg-gray-50 border-r border-gray-200 z-10">
          <div className="h-12 md:h-14 bg-gray-100 border-b border-gray-200 flex items-center justify-center">
            <span className="text-xs md:text-sm font-semibold text-gray-700">時間</span>
          </div>
          {TIMES.map(time => (
            <div key={time} className="h-10 md:h-12 border-b border-gray-100 flex items-center justify-center">
              <span className="text-xs md:text-sm font-medium text-gray-600">{time}</span>
            </div>
          ))}
        </div>

        {/* スクロール可能な日付部分 */}
        <div className="ml-16 md:ml-20 overflow-x-auto">
          {/* 固定曜日ヘッダー */}
          <div className="flex min-w-max">
            {weekDates.map((date, i) => (
              <div key={i} className="w-20 md:w-24 bg-gray-100 border-b border-r border-gray-200">
                <div className="h-12 md:h-14 flex flex-col items-center justify-center">
                  <span className="text-xs md:text-sm font-semibold text-gray-700">
                    {date.getMonth()+1}/{date.getDate()}
                  </span>
                  <span className="text-xs text-gray-600">
                    ({['日','月','火','水','木','金','土'][date.getDay()]})
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* 時間スロット */}
          <div className="flex min-w-max">
            {weekDates.map((date, colIdx) => {
              const dateStr = date.toISOString().split('T')[0];
              return (
                <div key={colIdx} className="w-20 md:w-24">
                  {TIMES.map(time => {
                    const isSelected = selected && selected.date === dateStr && selected.time === time;
                    return (
                      <div key={time} className="h-10 md:h-12 border-b border-r border-gray-100 flex items-center justify-center">
                        <button
                          className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center mx-auto transition-all duration-200 ${
                            isSelected 
                              ? 'bg-pink-500 text-white shadow-md scale-110' 
                              : 'bg-white border border-pink-300 text-pink-500 hover:bg-pink-50 hover:border-pink-400'
                          }`}
                          onClick={() => onSelect(dateStr, time)}
                        >
                          <span className="text-xs">{isSelected ? '●' : '○'}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 説明 */}
      <div className="mt-3 text-center">
        <p className="text-xs text-gray-500">
          希望の時間枠をクリックして選択してください
        </p>
      </div>
    </div>
  );
} 