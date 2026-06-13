import { type ReactNode } from "react";
import {
  CheckSquare,
  Bug,
  Rocket,
  BookOpen,
  MoreHorizontal,
} from "lucide-react";

// 난이도
type Difficulty = "Easy" | "Normal" | "Hard";

const difficultyMap: Record<Difficulty, string> = {
  Easy: "badge badge-easy",
  Normal: "badge badge-normal",
  Hard: "badge badge-hard",
};

interface DifficultyBadgeProps {
  level: Difficulty;
}

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  return <span className={difficultyMap[level]}>{level}</span>;
}

// 카테고리
type Category = "태스크" | "버그픽스" | "사이드" | "공부" | "기타";

const categoryMap: Record<Category, ReactNode> = {
  태스크: <CheckSquare size={11} />,
  버그픽스: <Bug size={11} />,
  사이드: <Rocket size={11} />,
  공부: <BookOpen size={11} />,
  기타: <MoreHorizontal size={11} />,
};

interface CategoryBadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <span className="badge" style={{ color: "var(--color-purple)" }}>
      {categoryMap[category]} {category}
    </span>
  );
}

// XP
interface ExpBadgeProps {
  amount: number;
}

export function ExpBadge({ amount }: ExpBadgeProps) {
  return (
    <span
      className="badge font-mono"
      style={{ color: "var(--color-text-muted)" }}
    >
      +{amount} EXP
    </span>
  );
}
