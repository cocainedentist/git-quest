import { Rocket, CheckCircle2, Star, Timer, Activity } from "lucide-react";
import { useQuestStore } from "../store/useQuestStore";
import type { ActivityLog as ActivityLogType } from "../types";
import { type ReactNode } from "react";

// 로그 종류별 아이콘
const LOG_ICONS: Record<ActivityLogType["type"], ReactNode> = {
  start: <Rocket size={13} style={{ color: "var(--color-cat-study)" }} />,
  quest_complete: (
    <CheckCircle2 size={13} style={{ color: "var(--color-easy-text)" }} />
  ),
  level_up: <Star size={13} style={{ color: "var(--color-cat-daily)" }} />,
  timer: <Timer size={13} style={{ color: "var(--color-text-muted)" }} />,
};

// HH:MM:SS
function formatTime(timestamp: string) {
  const d = new Date(timestamp);
  const h = d.getHours().toString().padStart(2, "0");
  const m = d.getMinutes().toString().padStart(2, "0");
  const s = d.getSeconds().toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
}

export default function ActivityLog() {
  const logs = useQuestStore((s) => s.logs);

  return (
    <div className="card flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="section-title mb-0">
          <Activity size={15} style={{ color: "var(--color-text-muted)" }} />
          활동 로그
        </h2>
        {/* 오른쪽 초록점 */}
        <div className="flex items-center gap-1.5">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: "var(--color-easy-text)",
              boxShadow: "0 0 6px var(--color-easy-text)",
            }}
          />
        </div>
      </div>

      {/* 로그 목록 스크롤 */}
      <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
        {logs.length === 0 ? (
          <p
            className="text-sm py-4 text-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            아직 활동 기록이 없어요.
          </p>
        ) : (
          logs.map((log) => (
            <div
              key={log.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {/* 시간 */}
              <span
                className="shrink-0 text-xs font-mono"
                style={{ color: "var(--color-text-muted)" }}
              >
                [{formatTime(log.timestamp)}]
              </span>
              {/* 아이콘 */}
              <span className="shrink-0 flex items-center">
                {LOG_ICONS[log.type]}
              </span>
              {/* 메세지; 길이제한 */}
              <span className="truncate">{log.message}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
