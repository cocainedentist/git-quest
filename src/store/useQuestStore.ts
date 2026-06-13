import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type {
  Quest,
  User,
  ActivityLog,
  GrassDay,
  TimerState,
  QuestFilter,
  StatusFilter,
  Difficulty,
  Category,
} from "../types";
import { DIFFICULTY_EXP } from "../types";

const XP_PER_LEVEL = 300;

function calcLevel(
  totalXp: number,
): Pick<User, "level" | "currentXp" | "xpToNextLevel"> {
  const level = Math.floor(totalXp / XP_PER_LEVEL) + 1;
  const currentXp = totalXp % XP_PER_LEVEL;
  const xpToNextLevel = XP_PER_LEVEL - currentXp;
  return { level, currentXp, xpToNextLevel };
}

const LEVEL_TITLES: Record<number, string> = {
  1: "새로운 시작을 하는",
  2: "첫 발을 내딛은",
  3: "성장하는",
  4: "두각을 나타내는",
  5: "실력을 쌓아가는",
  6: "경험이 쌓인",
  7: "전설에 가까워진",
  8: "모두가 인정하는",
};
function getTitle(level: number) {
  return LEVEL_TITLES[Math.min(level, 8)] ?? "-";
}

function toDateStr(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
function todayStr() {
  return toDateStr(new Date());
}

// 연속 스트릭 계산
function calcStreak(quests: Quest[]): number {
  const completedDates = new Set(
    quests
      .filter((q) => q.completed && q.completedAt)
      .map((q) => toDateStr(new Date(q.completedAt!))),
  );
  let streak = 0;
  const today = new Date();
  // 오늘 완료 X -> 어제부터 체크
  const startOffset = completedDates.has(toDateStr(today)) ? 0 : 1;
  for (let i = startOffset; i < 365; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    if (completedDates.has(toDateStr(d))) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}

// Init
const INITIAL_TOTAL_XP = 0;
const initLevel = calcLevel(INITIAL_TOTAL_XP);

const initialUser: User = {
  name: "모험가",
  title: "학생",
  totalXp: INITIAL_TOTAL_XP,
  streak: 0,
  face: ":-)",
  badge: "새로운 시작을 하는",
  ...initLevel,
};

const initialQuests: Quest[] = [
  {
    id: uuidv4(),
    title: "React 공부하기",
    difficulty: "Hard",
    category: "공부",
    exp: DIFFICULTY_EXP["Hard"],
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "아이템이 먹어지지 않는 버그 해결하기",
    difficulty: "Normal",
    category: "버그픽스",
    exp: DIFFICULTY_EXP["Normal"],
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "Backrooms - 기본 알고리즘 구현하기",
    difficulty: "Normal",
    category: "사이드",
    exp: DIFFICULTY_EXP["Normal"],
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: uuidv4(),
    title: "기타 연습하기",
    difficulty: "Easy",
    category: "기타",
    exp: DIFFICULTY_EXP["Easy"],
    completed: false,
    completedAt: null,
    createdAt: new Date().toISOString(),
  },
];

const initialLogs: ActivityLog[] = [
  {
    id: uuidv4(),
    type: "start",
    message: "GitQuest에 접속했습니다!",
    timestamp: new Date().toISOString(),
  },
];

// Store Type
interface QuestStore {
  user: User;
  quests: Quest[];
  logs: ActivityLog[];
  timer: TimerState;
  questFilter: QuestFilter;
  statusFilter: StatusFilter;

  addQuest: (title: string, difficulty: Difficulty, category: Category) => void;
  toggleQuest: (id: string) => void;
  deleteQuest: (id: string) => void;
  setQuestFilter: (filter: QuestFilter) => void;
  setStatusFilter: (filter: StatusFilter) => void;
  setTimerDuration: (seconds: number) => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  tickTimer: () => void;
  setUserFace: (face: string, name: string, title: string) => void;

  getFilteredQuests: () => Quest[];
  getGrassData: () => GrassDay[];
  getTodayCompleted: () => number;
}

// Store
export const useQuestStore = create<QuestStore>()(
  persist(
    (set, get) => {
      // 내부 헬퍼 — 타입에 노출 안 함
      function addLog(type: ActivityLog["type"], message: string) {
        const log: ActivityLog = {
          id: uuidv4(),
          type,
          message,
          timestamp: new Date().toISOString(),
        };
        set((s) => ({ logs: [log, ...s.logs].slice(0, 50) }));
      }

      return {
        user: initialUser,
        quests: initialQuests,
        logs: initialLogs,
        questFilter: "all",
        statusFilter: "active",
        timer: { status: "idle", duration: 25 * 60, remaining: 25 * 60 },

        addQuest: (title, difficulty, category) => {
          const quest: Quest = {
            id: uuidv4(),
            title,
            difficulty,
            category,
            exp: DIFFICULTY_EXP[difficulty],
            completed: false,
            completedAt: null,
            createdAt: new Date().toISOString(),
          };
          set((s) => ({ quests: [...s.quests, quest] }));
          addLog("quest_complete", `새 퀘스트 등록: "${title}"`);
        },

        toggleQuest: (id) => {
          const { quests, user } = get();
          const quest = quests.find((q) => q.id === id);
          if (!quest) return;

          const completing = !quest.completed;
          const newTotalXp = completing
            ? user.totalXp + quest.exp
            : Math.max(0, user.totalXp - quest.exp);

          const levelInfo = calcLevel(newTotalXp);
          const didLevelUp = completing && levelInfo.level > user.level;

          const updatedQuests = get().quests.map((q) =>
            q.id === id
              ? {
                  ...q,
                  completed: completing,
                  completedAt: completing ? new Date().toISOString() : null,
                }
              : q,
          );
          set((s) => ({
            quests: updatedQuests,
            user: {
              ...s.user,
              totalXp: newTotalXp,
              ...levelInfo,
              streak: calcStreak(updatedQuests),
              badge: getTitle(levelInfo.level),
            },
          }));

          if (completing) {
            addLog(
              "quest_complete",
              `"${quest.title}" 완료! +${quest.exp} EXP`,
            );
            if (didLevelUp)
              addLog(
                "level_up",
                `레벨 업! Lv.${levelInfo.level} ${getTitle(levelInfo.level)}`,
              );
          }
        },

        deleteQuest: (id) =>
          set((s) => ({ quests: s.quests.filter((q) => q.id !== id) })),

        setUserFace: (face, name, title) =>
          set((s) => ({ user: { ...s.user, face, name, title } })),

        setQuestFilter: (filter) => set({ questFilter: filter }),
        setStatusFilter: (filter) => set({ statusFilter: filter }),

        setTimerDuration: (seconds) =>
          set({
            timer: { status: "idle", duration: seconds, remaining: seconds },
          }),
        startTimer: () =>
          set((s) => ({ timer: { ...s.timer, status: "running" } })),
        pauseTimer: () =>
          set((s) => ({ timer: { ...s.timer, status: "paused" } })),
        resetTimer: () =>
          set((s) => ({
            timer: { ...s.timer, status: "idle", remaining: s.timer.duration },
          })),
        tickTimer: () => {
          const { timer } = get();
          if (timer.status !== "running") return;
          if (timer.remaining <= 1) {
            set((s) => ({
              timer: { ...s.timer, status: "idle", remaining: 0 },
            }));
            addLog("timer", "타이머가 종료되었습니다!");
          } else {
            set((s) => ({
              timer: { ...s.timer, remaining: s.timer.remaining - 1 },
            }));
          }
        },

        getFilteredQuests: () => {
          const { quests, questFilter, statusFilter } = get();
          return quests.filter((q) => {
            const matchCategory =
              questFilter === "all" || q.category === questFilter;
            const matchStatus =
              statusFilter === "active" ? !q.completed : q.completed;
            return matchCategory && matchStatus;
          });
        },

        getGrassData: () => {
          const { quests } = get();
          const map = new Map<string, number>();
          for (let i = 27; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            map.set(toDateStr(d), 0);
          }
          quests
            .filter((q) => q.completed && q.completedAt)
            .forEach((q) => {
              const date = toDateStr(new Date(q.completedAt!));
              if (map.has(date)) map.set(date, (map.get(date) ?? 0) + 1);
            });
          return Array.from(map.entries()).map(([date, count]) => ({
            date,
            count,
          }));
        },

        getTodayCompleted: () => {
          const today = todayStr();
          return get().quests.filter(
            (q) =>
              q.completed &&
              q.completedAt &&
              toDateStr(new Date(q.completedAt)) === today,
          ).length;
        },
      };
    },
    { name: "gitquest-store" },
  ),
);
