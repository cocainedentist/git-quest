import { useState } from "react";
import {
  Plus,
  CheckSquare,
  Bug,
  Rocket,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";
import type { Difficulty, Category } from "../types";
import { useQuestStore } from "../store/useQuestStore";
import { type ReactNode } from "react";

const DIFFICULTIES: Difficulty[] = ["Easy", "Normal", "Hard"];
const CATEGORIES: Category[] = ["태스크", "버그픽스", "사이드", "공부", "기타"];

// 카테고리 아이콘
const CATEGORY_ICON: Record<Category, ReactNode> = {
  태스크: <CheckSquare size={13} />,
  버그픽스: <Bug size={13} />,
  사이드: <Rocket size={13} />,
  공부: <BookOpen size={13} />,
  기타: <MoreHorizontal size={13} />,
};

// 난이도 XP
const DIFFICULTY_XP_LABEL: Record<Difficulty, string> = {
  Easy: "+20 EXP",
  Normal: "+35 EXP",
  Hard: "+50 EXP",
};

// 난이도 CSS
const DIFFICULTY_CLS: Record<Difficulty, string> = {
  Easy: "badge-easy",
  Normal: "badge-normal",
  Hard: "badge-hard",
};

export default function AddQuest() {
  const addQuest = useQuestStore((s) => s.addQuest);

  // 입력값 상태
  const [title, setTitle] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [category, setCategory] = useState<Category>("태스크");

  function handleSubmit() {
    const trimmed = title.trim(); // 앞뒤 공백 제거
    if (!trimmed) return; // 빈값 등록 X
    addQuest(trimmed, difficulty, category);
    setTitle(""); // 등록 후 초기화
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // 한글 여러번 등록되는 버그 무시 코드
    if (e.key === "Enter" && !e.nativeEvent.isComposing) handleSubmit();
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        className="input"
        placeholder="새 퀘스트를 입력하세요..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <div className="flex items-center gap-2 flex-wrap">
        {/* 난이도 선택 */}
        {DIFFICULTIES.map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={`badge cursor-pointer transition-all ${DIFFICULTY_CLS[d]} ${difficulty === d ? "opacity-100 scale-105 ring-1 ring-white/20" : "opacity-40 hover:opacity-70"}`}
          >
            {d} ({DIFFICULTY_XP_LABEL[d]})
          </button>
        ))}

        {/* 카테고리 선택 */}
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className="badge cursor-pointer transition-all flex items-center gap-1"
            style={{
              backgroundColor:
                category === c
                  ? "var(--color-bg-overlay)"
                  : "var(--color-bg-raised)",
              color:
                category === c
                  ? "var(--color-text-primary)"
                  : "var(--color-text-muted)",
              border:
                category === c
                  ? "1px solid var(--color-bg-border)"
                  : "1px solid transparent",
              opacity: category === c ? "1" : "0.6",
            }}
            onMouseEnter={(e) => {
              if (category !== c) e.currentTarget.style.opacity = "1";
            }}
            onMouseLeave={(e) => {
              if (category !== c) e.currentTarget.style.opacity = "0.6";
            }}
          >
            {CATEGORY_ICON[c]} {c}
          </button>
        ))}

        {/* 등록 버튼; 입력 있을때만 활성화 */}
        <button
          onClick={handleSubmit}
          disabled={!title.trim()}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white transition-all active:scale-95 rounded-full disabled:opacity-40"
          style={{ backgroundColor: "var(--color-purple)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--color-purple-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-purple)")
          }
        >
          <Plus size={14} />
          등록
        </button>
      </div>
    </div>
  );
}
