import { useState } from "react";
import { useQuestStore } from "../store/useQuestStore";

const GRASS_COLORS = [
  "var(--color-grass-0)",
  "var(--color-grass-1)",
  "var(--color-grass-2)",
  "var(--color-grass-3)",
  "var(--color-grass-4)",
];

function getGrassColor(count: number) {
  if (count === 0) return GRASS_COLORS[0];
  if (count === 1) return GRASS_COLORS[1];
  if (count === 2) return GRASS_COLORS[2];
  if (count === 3) return GRASS_COLORS[3];
  return GRASS_COLORS[4];
}

function toDateStr(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

interface TooltipState {
  x: number;
  y: number;
  date: string;
  count: number;
  titles: string[];
}

export default function ContributionGrass() {
  const quests = useQuestStore((s) => s.quests);
  const today = new Date();
  const todayStr = toDateStr(today);

  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const grassData = Array.from({ length: daysInMonth }, (_, i) => {
    const d = new Date(year, month, i + 1);
    return { date: toDateStr(d), count: 0, titles: [] as string[] };
  });

  quests
    .filter((q) => q.completed && q.completedAt)
    .forEach((q) => {
      const date = toDateStr(new Date(q.completedAt!));
      const idx = grassData.findIndex((g) => g.date === date);
      if (idx !== -1) {
        grassData[idx].count++;
        grassData[idx].titles.push(q.title);
      }
    });

  const todayCompleted = grassData.find((g) => g.date === todayStr)?.count ?? 0;

  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="section-title mb-0">
          <span style={{ color: "var(--color-easy-text)" }}>●</span>
          이달의 잔디
        </h2>
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {month + 1}월
        </span>
      </div>

      {/* 잔디 그리드 */}
      <div className="flex flex-col gap-1.5 items-center">
        <div
          className="grid gap-1.5"
          style={{ gridTemplateColumns: "repeat(7, 20px)" }}
        >
          {grassData.map((day) => (
            <div
              key={day.date}
              className="w-5 h-5 rounded-sm cursor-default transition-colors"
              style={{
                backgroundColor: getGrassColor(day.count),
                outline:
                  day.date === todayStr
                    ? "2px solid var(--color-purple)"
                    : "none",
                outlineOffset: "1px",
              }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setTooltip({
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                  date: day.date,
                  count: day.count,
                  titles: day.titles,
                });
              }}
              onMouseLeave={() => setTooltip(null)}
            />
          ))}
        </div>

        {/* LessMore */}
        <div className="flex items-center gap-1.5 justify-end mt-1 w-full">
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            Less
          </span>
          {GRASS_COLORS.map((color, i) => (
            <div
              key={i}
              className="w-3 h-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
          ))}
          <span
            className="text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            More
          </span>
        </div>
      </div>

      {/* 오늘의 잔디 */}
      <div
        className="rounded-lg px-4 py-3 flex items-center gap-2"
        style={{ backgroundColor: "var(--color-bg-raised)" }}
      >
        <div
          className="w-3 h-3 rounded-sm shrink-0"
          style={{ backgroundColor: getGrassColor(todayCompleted) }}
        />
        <span
          className="text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          오늘의 잔디
        </span>
        <span
          className="text-sm ml-auto"
          style={{ color: "var(--color-text-primary)" }}
        >
          {todayCompleted}개 완료
        </span>
      </div>

      {/* 잔디 툴팁 */}
      {tooltip && (
        <div
          className="fixed z-9999 pointer-events-none"
          style={{
            left: tooltip.x,
            top: tooltip.y - 8,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div
            className="rounded-lg px-3 py-2 text-xs"
            style={{
              backgroundColor: "var(--color-bg-overlay)",
              border: "1px solid var(--color-bg-border)",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              minWidth: "120px",
            }}
          >
            <p
              className="font-semibold mb-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {formatDate(tooltip.date)}
            </p>
            {tooltip.count === 0 ? (
              <p style={{ color: "var(--color-text-muted)" }}>완료 없음</p>
            ) : (
              <>
                {tooltip.titles.slice(0, 5).map((t, i) => (
                  <p
                    key={i}
                    className="truncate"
                    style={{
                      color: "var(--color-text-primary)",
                      maxWidth: "180px",
                    }}
                  >
                    · {t}
                  </p>
                ))}
                {tooltip.titles.length > 5 && (
                  <p style={{ color: "var(--color-text-muted)" }}>
                    ... {tooltip.titles.length - 5}개 더
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
