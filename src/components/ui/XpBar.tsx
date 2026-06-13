interface XpBarProps {
  current: number;
  max: number;
  className?: string;
}

export default function XpBar({ current, max, className = "" }: XpBarProps) {
  const pct = Math.min((current / max) * 100, 100); // 퍼센트 계산

  return (
    <div className={`xp-bar-track ${className}`}>
      <div className="xp-bar-fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
