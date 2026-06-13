import { Trash2 } from "lucide-react";
import type { Quest } from "../types";
import { useQuestStore } from "../store/useQuestStore";
import { DifficultyBadge, CategoryBadge, ExpBadge } from "./ui";

interface QuestItemProps {
  quest: Quest;
}

export default function QuestItem({ quest }: QuestItemProps) {
  const toggleQuest = useQuestStore((s) => s.toggleQuest);
  const deleteQuest = useQuestStore((s) => s.deleteQuest);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group"
      style={{ backgroundColor: "var(--color-bg-surface)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.backgroundColor = "var(--color-bg-raised)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.backgroundColor = "var(--color-bg-surface)")
      }
    >
      {/* 체크 원 */}
      <button
        onClick={() => toggleQuest(quest.id)}
        className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
        style={{
          borderColor: quest.completed
            ? "var(--color-purple)"
            : "var(--color-bg-border)",
          backgroundColor: quest.completed
            ? "var(--color-purple)"
            : "transparent",
        }}
        onMouseEnter={(e) => {
          // 미완료 상태일 때 hover
          if (!quest.completed) {
            e.currentTarget.style.borderColor = "var(--color-purple)";
            e.currentTarget.style.backgroundColor = "var(--color-purple-muted)";
          }
        }}
        onMouseLeave={(e) => {
          if (!quest.completed) {
            e.currentTarget.style.borderColor = "var(--color-bg-border)";
            e.currentTarget.style.backgroundColor = "transparent";
          }
        }}
        aria-label={quest.completed ? "퀘스트 취소" : "퀘스트 완료"}
      >
        {/* 완료 시 체크 표시 */}
        {quest.completed && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* 제목 배지 */}
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{
            // 완료 시 흐린 색 + 취소선
            color: quest.completed
              ? "var(--color-text-muted)"
              : "var(--color-text-primary)",
            textDecoration: quest.completed ? "line-through" : "none",
          }}
        >
          {quest.title}
        </p>
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          <DifficultyBadge level={quest.difficulty} />
          <CategoryBadge category={quest.category} />
          <ExpBadge amount={quest.exp} />
        </div>
      </div>

      {/* 삭제버튼 */}
      <button
        onClick={() => deleteQuest(quest.id)}
        className="btn-icon shrink-0 opacity-0 group-hover:opacity-100"
        aria-label="퀘스트 삭제"
        style={{ color: "var(--color-text-muted)" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.color = "var(--color-hard-text)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--color-text-muted)")
        }
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
