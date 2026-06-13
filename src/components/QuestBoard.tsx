import {
  ClipboardList,
  LayoutGrid,
  CheckSquare,
  Bug,
  Rocket,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";
import type { QuestFilter } from "../types";
import { useQuestStore } from "../store/useQuestStore";
import AddQuest from "./AddQuest";
import QuestItem from "./QuestItem";
import { type ReactNode } from "react";

// 카테고리 목록
const CATEGORY_FILTERS: {
  label: string;
  value: QuestFilter;
  icon: ReactNode;
}[] = [
  { label: "All", value: "all", icon: <LayoutGrid size={13} /> },
  { label: "태스크", value: "태스크", icon: <CheckSquare size={13} /> },
  { label: "버그픽스", value: "버그픽스", icon: <Bug size={13} /> },
  { label: "사이드", value: "사이드", icon: <Rocket size={13} /> },
  { label: "공부", value: "공부", icon: <BookOpen size={13} /> },
  { label: "기타", value: "기타", icon: <MoreHorizontal size={13} /> },
];

export default function QuestBoard() {
  const quests = useQuestStore((s) => s.quests);
  const questFilter = useQuestStore((s) => s.questFilter);
  const statusFilter = useQuestStore((s) => s.statusFilter);
  const setQuestFilter = useQuestStore((s) => s.setQuestFilter);
  const setStatusFilter = useQuestStore((s) => s.setStatusFilter);

  // 카테고리 & 진행상태
  const filtered = quests.filter((q) => {
    const matchCategory = questFilter === "all" || q.category === questFilter;
    const matchStatus = statusFilter === "active" ? !q.completed : q.completed;
    return matchCategory && matchStatus;
  });

  const activeCount = quests.filter((q) => !q.completed).length;
  const completedCount = quests.filter((q) => q.completed).length;

  return (
    <div className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="section-title mb-0">
          <ClipboardList size={15} style={{ color: "var(--color-purple)" }} />
          퀘스트 보드
        </h2>
        <div className="flex items-center gap-2">
          <span
            className="badge"
            style={{
              backgroundColor: "var(--color-bg-raised)",
              color: "var(--color-text-secondary)",
            }}
          >
            진행 {activeCount}
          </span>
          <span
            className="badge"
            style={{
              backgroundColor: "var(--color-bg-raised)",
              color: "var(--color-text-secondary)",
            }}
          >
            완료 {completedCount}
          </span>
        </div>
      </div>

      {/* 퀘스트 추가 */}
      <AddQuest />

      <div className="divider" />

      {/* 필터 */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* 카테고리 필터 */}
        <div className="flex items-center gap-1.5">
          {CATEGORY_FILTERS.map((f) => (
            <button
              key={String(f.value)}
              onClick={() => setQuestFilter(f.value)}
              className="filter-tab flex items-center gap-1.5"
              // 선택 필터 강조
              style={
                questFilter === f.value
                  ? {
                      backgroundColor: "var(--color-purple)",
                      color: "white",
                      borderColor: "transparent",
                    }
                  : {}
              }
            >
              {f.icon}
              {f.label}
            </button>
          ))}
        </div>

        {/* 진행중 필터 */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStatusFilter("active")}
            className="filter-tab"
            style={
              statusFilter === "active"
                ? {
                    backgroundColor: "var(--color-purple)",
                    color: "white",
                    borderColor: "transparent",
                  }
                : {}
            }
          >
            진행중
          </button>
          <button
            onClick={() => setStatusFilter("completed")}
            className="filter-tab"
            style={
              statusFilter === "completed"
                ? {
                    backgroundColor: "var(--color-purple)",
                    color: "white",
                    borderColor: "transparent",
                  }
                : {}
            }
          >
            완료
          </button>
        </div>
      </div>

      {/* 퀘스트 목록 */}
      <div className="flex flex-col gap-2">
        {filtered.length === 0 ? (
          <div
            className="py-10 text-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            <p className="text-sm">
              {statusFilter === "active"
                ? "아직 비어있어요. 퀘스트를 완료해보세요!"
                : "완료한 퀘스트가 없어요."}
            </p>
          </div>
        ) : (
          filtered.map((quest) => <QuestItem key={quest.id} quest={quest} />)
        )}
      </div>
    </div>
  );
}
