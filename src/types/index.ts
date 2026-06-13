// 난이도
export type Difficulty = "Easy" | "Normal" | "Hard";

export const DIFFICULTY_EXP: Record<Difficulty, number> = {
  Easy: 20,
  Normal: 35,
  Hard: 50,
};

// 카테고리
export type Category = "태스크" | "버그픽스" | "사이드" | "공부" | "기타";

// 퀘스트
export interface Quest {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: Category;
  exp: number;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
}

// 유저
export interface User {
  name: string;
  level: number;
  title: string;
  totalXp: number;
  currentXp: number;
  xpToNextLevel: number;
  streak: number;
  face: string; // 세글자 얼굴
  badge: string; // 칭호
}

// 로그
export type LogType = "start" | "quest_complete" | "level_up" | "timer";

export interface ActivityLog {
  id: string;
  type: LogType;
  message: string;
  timestamp: string;
}

// 잔디
export interface GrassDay {
  date: string;
  count: number;
}

// 타이머
export type TimerStatus = "idle" | "running" | "paused";

export interface TimerState {
  status: TimerStatus;
  duration: number;
  remaining: number;
}

// 필터
export type QuestFilter = "all" | Category;
export type StatusFilter = "active" | "completed";
