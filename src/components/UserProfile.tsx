import { Flame, Star, CheckCircle } from "lucide-react";
import { useQuestStore } from "../store/useQuestStore";
import { XpBar, StatCard } from "./ui";

export default function UserProfile() {
  const user = useQuestStore((s) => s.user);
  const quests = useQuestStore((s) => s.quests);
  const todayStr = new Date().toISOString().split("T")[0];
  const todayCompleted = quests.filter(
    (q) =>
      q.completed &&
      q.completedAt &&
      new Date(q.completedAt).toISOString().split("T")[0] === todayStr,
  ).length;

  return (
    <div className="card flex items-center gap-6">
      {/* 아바타 */}
      <div className="relative shrink-0">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
          style={{
            backgroundColor: "var(--color-bg-raised)",
            border: "2px solid var(--color-purple)",
          }}
        >
          <span className="font-mono font-bold text-xl">{user.face}</span>
        </div>
        {/* 레벨 배지 */}
        <div
          className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: "var(--color-purple)" }}
        >
          {user.level}
        </div>
      </div>

      {/* 이름 XP */}
      <div className="flex-1 min-w-0">
        <p
          className="text-xs mb-0.5"
          style={{ color: "var(--color-text-muted)" }}
        >
          LEVEL {user.level} · {user.title}
        </p>
        <h2
          className="text-xl font-bold mb-2 flex items-center gap-2"
          style={{ color: "var(--color-text-primary)" }}
        >
          <span
            className="text-sm font-semibold px-1.5 py-0.5 rounded"
            style={{
              backgroundColor: "var(--color-purple-muted)",
              color: "var(--color-purple)",
            }}
          >
            {user.badge}
          </span>
          {user.name}
        </h2>

        {/* XP 바 */}
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-semibold shrink-0"
            style={{ color: "var(--color-text-muted)" }}
          >
            XP
          </span>
          <XpBar
            current={user.currentXp}
            max={user.xpToNextLevel + user.currentXp}
            className="flex-1"
          />
          <span
            className="text-xs shrink-0"
            style={{ color: "var(--color-text-muted)" }}
          >
            {user.currentXp} / {user.xpToNextLevel + user.currentXp} XP
          </span>
        </div>

        <p
          className="text-xs mt-1"
          style={{ color: "var(--color-text-muted)" }}
        >
          레벨업까지 {user.xpToNextLevel} XP
        </p>
      </div>

      {/* State */}
      <div className="flex gap-3 shrink-0">
        <StatCard
          value={user.streak}
          label="스트릭"
          icon={<Flame size={12} className="text-orange-400" />}
          valueClassName="text-orange-400"
        />
        <StatCard
          value={todayCompleted}
          label="오늘 완료"
          icon={
            <CheckCircle
              size={12}
              style={{ color: "var(--color-text-secondary)" }}
            />
          }
        />
        <StatCard
          value={user.totalXp.toLocaleString()}
          label="Total XP"
          icon={<Star size={12} style={{ color: "var(--color-purple)" }} />}
          valueClassName="text-purple-400"
        />
      </div>
    </div>
  );
}
