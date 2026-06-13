import { useEffect, useRef } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { useQuestStore } from "../store/useQuestStore";

const PRESETS = [
  { label: "45분", seconds: 45 * 60 },
  { label: "25분", seconds: 25 * 60 },
  { label: "10분", seconds: 10 * 60 },
];

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}

export default function Timer() {
  const timer = useQuestStore((s) => s.timer);
  const startTimer = useQuestStore((s) => s.startTimer);
  const pauseTimer = useQuestStore((s) => s.pauseTimer);
  const resetTimer = useQuestStore((s) => s.resetTimer);
  const tickTimer = useQuestStore((s) => s.tickTimer);
  const setTimerDuration = useQuestStore((s) => s.setTimerDuration);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (timer.status === "running") {
      intervalRef.current = setInterval(tickTimer, 1000); // 1초마다 실행
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current); // 멈추면 interval 제거
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timer.status, tickTimer]);

  // 타이머 원형 그리기
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const progress = timer.remaining / timer.duration; // 남은 비율
  const dashOffset = circumference * (1 - progress); // 줄어드는 길이

  const statusLabel =
    timer.status === "running"
      ? "집중 중"
      : timer.status === "paused"
        ? "일시정지"
        : "준비";

  return (
    <div className="card flex flex-col items-center gap-5">
      <div className="w-full">
        <h2 className="section-title mb-0">
          <span style={{ color: "var(--color-text-muted)" }}>⏱</span>
          타이머
        </h2>
      </div>

      {/* 타이머 원 */}
      <div className="relative flex items-center justify-center">
        <svg width="200" height="200" className="-rotate-90">
          {/* 회색원 */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="6"
            stroke="var(--color-bg-raised)"
          />
          {/* 보라원 */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            strokeWidth="6"
            stroke="var(--color-purple)"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: "stroke-dashoffset 0.8s ease" }}
          />
        </svg>

        {/* 타이머 중간 시간 표시 */}
        <div className="absolute flex flex-col items-center">
          <span
            className="font-mono text-4xl font-bold tracking-wider"
            style={{ color: "var(--color-text-primary)" }}
          >
            {formatTime(timer.remaining)}
          </span>
          <span
            className="text-xs mt-1"
            style={{ color: "var(--color-text-muted)" }}
          >
            {statusLabel}
          </span>
        </div>
      </div>

      {/* 프리셋 버튼 */}
      <div className="flex gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => setTimerDuration(p.seconds)}
            className="filter-tab"
            style={{
              borderColor:
                timer.duration === p.seconds
                  ? "var(--color-purple)"
                  : undefined,
              color:
                timer.duration === p.seconds
                  ? "var(--color-purple)"
                  : undefined,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* 제어 버튼 */}
      <div className="flex items-center gap-3">
        <button onClick={resetTimer} className="btn-icon w-10 h-10">
          <RotateCcw size={18} />
        </button>

        <button
          onClick={timer.status === "running" ? pauseTimer : startTimer}
          className="w-14 h-14 rounded-full flex items-center justify-center transition-all active:scale-95"
          style={{
            backgroundColor: "var(--color-purple)",
            boxShadow: "var(--shadow-purple)",
          }}
        >
          {timer.status === "running" ? (
            <Pause size={22} fill="white" color="white" />
          ) : (
            <Play
              size={22}
              fill="white"
              color="white"
              className="translate-x-0.5"
            />
          )}
        </button>
      </div>
    </div>
  );
}
