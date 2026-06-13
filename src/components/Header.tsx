import { useState } from "react";
import { Flame, CircleUserRound, Swords } from "lucide-react";
import { useNavigate } from "react-router";
import { useQuestStore } from "../store/useQuestStore";

export default function Header() {
  const streak = useQuestStore((s) => s.user.streak);
  const navigate = useNavigate();
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b"
      style={{
        backgroundColor: "var(--color-bg-surface)",
        borderColor: "var(--color-bg-border)",
      }}
    >
      {/* 로고 */}
      <div className="flex items-center gap-2">
        <Swords size={20} style={{ color: "var(--color-purple)" }} />
        <span
          className="font-bold text-base"
          style={{ color: "var(--color-text-primary)" }}
        >
          Git-Quest
        </span>
      </div>

      {/* 오른쪽 Streak랑 개인설정 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <Flame size={16} className="text-orange-400" />
          <span
            className="text-sm font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {streak}일 연속
          </span>
        </div>

        {/* 프로필 버튼 */}
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button className="btn-icon" onClick={() => navigate("/profile")}>
            <CircleUserRound
              size={24}
              style={{ color: "var(--color-text-secondary)" }}
            />
          </button>
          {/* 툴팁 */}
          {showTooltip && (
            <div
              className="absolute right-0 top-full mt-1 px-2 py-1 rounded text-xs whitespace-nowrap pointer-events-none"
              style={{
                backgroundColor: "var(--color-bg-overlay)",
                border: "1px solid var(--color-bg-border)",
                color: "var(--color-text-primary)",
              }}
            >
              프로필 수정
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
