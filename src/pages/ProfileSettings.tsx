import { useState } from "react";
import { useNavigate } from "react-router";
import {
  ArrowLeft,
  Monitor,
  Server,
  ShieldCheck,
  Gamepad2,
  GraduationCap,
  type LucideIcon,
} from "lucide-react";
import { useQuestStore } from "../store/useQuestStore";

// 얼굴 프리셋
const PRESET_FACES = [
  ":-)",
  ":-(",
  ":-O",
  ":-P",
  ";-)",
  "B-)",
  ">:)",
  ":-|",
  ":^)",
  "XD",
  "OwO",
  "o_o",
  "T_T",
  ":o",
];

// 직업; lucied-icon
const JOBS: { name: string; icon: LucideIcon; desc: string }[] = [
  {
    name: "프론트엔드",
    icon: Monitor,
    desc: "눈에 보이는 아름다운 환상을 빚어내는 자",
  },
  {
    name: "백엔드",
    icon: Server,
    desc: "보이지 않는 곳에서 세계의 규칙을 지배",
  },
  {
    name: "게임개발",
    icon: Gamepad2,
    desc: "무에서 유의 세계를 설계하는 창조자",
  },
  {
    name: "보안",
    icon: ShieldCheck,
    desc: "해커로부터 왕국을 수호하는 수호기사",
  },
  {
    name: "학생",
    icon: GraduationCap,
    desc: "아직 직업을 정하지 않은 무한한 가능성",
  },
];

export default function ProfileSettings() {
  const navigate = useNavigate();
  const user = useQuestStore((s) => s.user);
  const setFace = useQuestStore((s) => s.setUserFace);

  // 완료 전 temp
  const [face, setFaceLocal] = useState(user.face ?? ":-)");
  const [name, setName] = useState(user.name);
  const [job, setJob] = useState(user.title ?? "마법사");

  function handleFaceChange(e: React.ChangeEvent<HTMLInputElement>) {
    // 한글 X; 3자 제한
    const val = e.target.value.replace(/[ㄱ-ㅎㅏ-ㅣ가-힣]/g, "");
    if (val.length <= 3) setFaceLocal(val);
  }

  function handleSave() {
    setFace(face, name, job); // store
    navigate("/"); // toHome
  }

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-bg-base)" }}
    >
      <header
        className="sticky top-0 z-50 flex items-center gap-3 px-6 py-3 border-b"
        style={{
          backgroundColor: "var(--color-bg-surface)",
          borderColor: "var(--color-bg-border)",
        }}
      >
        {/* 뒤로가기 */}
        <button onClick={() => navigate("/")} className="btn-icon">
          <ArrowLeft size={18} />
        </button>
        <span
          className="font-bold text-base"
          style={{ color: "var(--color-text-primary)" }}
        >
          프로필 수정
        </span>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6">
        {/* 실시간 미리보기 */}
        <div className="card flex items-center gap-6">
          <div
            className="w-20 h-20 rounded-xl flex items-center justify-center font-mono font-bold text-2xl shrink-0"
            style={{
              backgroundColor: "var(--color-bg-raised)",
              border: "2px solid var(--color-purple)",
              color: "var(--color-text-primary)",
            }}
          >
            {face || "?"}
          </div>
          <div>
            <p
              className="text-xs mb-1"
              style={{ color: "var(--color-text-muted)" }}
            >
              미리보기
            </p>
            <p
              className="font-bold text-xl"
              style={{ color: "var(--color-text-primary)" }}
            >
              {name || "이름 없음"}
            </p>
            <p
              className="text-sm mt-0.5"
              style={{ color: "var(--color-purple)" }}
            >
              {job}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 왼쪽; 개인정보 */}
          <div className="flex flex-col gap-4">
            {/* 이름 */}
            <div className="card flex flex-col gap-3">
              <h2 className="section-title mb-0">캐릭터 이름</h2>
              <input
                className="input"
                placeholder="이름을 입력하세요"
                value={name}
                maxLength={16}
                onChange={(e) => setName(e.target.value)}
              />
              <p
                className="text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {name.length} / 16
              </p>
            </div>

            {/* 얼굴 */}
            <div className="card flex flex-col gap-4">
              <h2 className="section-title mb-0">얼굴</h2>
              <input
                className="input font-mono text-center text-sm tracking-widest"
                placeholder="특수문자로 나만의 얼굴을 만들어보세요 (최대 3자)"
                value={face}
                onChange={handleFaceChange}
              />
              <div>
                <p
                  className="text-xs mb-2"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  프리셋
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_FACES.map((f) => (
                    <button
                      key={f}
                      onClick={() => setFaceLocal(f)}
                      className="font-mono text-sm px-3 py-1.5 rounded-lg transition-all"
                      style={{
                        backgroundColor:
                          face === f
                            ? "var(--color-purple)"
                            : "var(--color-bg-raised)",
                        color:
                          face === f ? "white" : "var(--color-text-secondary)",
                        border: `1px solid ${face === f ? "transparent" : "var(--color-bg-border)"}`,
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽; 직업 */}
          <div className="card flex flex-col gap-4">
            <h2 className="section-title mb-0">직업</h2>
            <div className="flex flex-col gap-2">
              {JOBS.map((j) => (
                <button
                  key={j.name}
                  onClick={() => setJob(j.name)}
                  className="flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all"
                  style={{
                    backgroundColor:
                      job === j.name
                        ? "var(--color-purple-muted)"
                        : "var(--color-bg-raised)",
                    border: `1px solid ${job === j.name ? "var(--color-purple)" : "var(--color-bg-border)"}`,
                  }}
                  onMouseEnter={(e) => {
                    if (job !== j.name)
                      e.currentTarget.style.borderColor = "var(--color-purple)";
                  }}
                  onMouseLeave={(e) => {
                    if (job !== j.name)
                      e.currentTarget.style.borderColor =
                        "var(--color-bg-border)";
                  }}
                >
                  <j.icon size={20} style={{ color: "var(--color-purple)" }} />
                  <div>
                    <p
                      className="font-semibold text-sm"
                      style={{
                        color:
                          job === j.name
                            ? "var(--color-text-primary)"
                            : "var(--color-text-secondary)",
                      }}
                    >
                      {j.name}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {j.desc}
                    </p>
                  </div>
                  {/* 선택한 직업에 점 표시 */}
                  {job === j.name && (
                    <div
                      className="ml-auto w-2 h-2 rounded-full"
                      style={{ backgroundColor: "var(--color-purple)" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 완료 버튼 */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-lg font-semibold text-white transition-all active:scale-95"
          style={{ backgroundColor: "var(--color-purple)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor =
              "var(--color-purple-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "var(--color-purple)")
          }
        >
          완료
        </button>
      </main>
    </div>
  );
}
