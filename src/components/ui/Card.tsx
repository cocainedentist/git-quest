import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string; // 선택적 props; ?를 붙이면 없어도 된다 (기본값: undefined)
  /* 패딩 X */
  noPadding?: boolean;
}

export default function Card({
  children,
  className = "",
  noPadding,
}: CardProps) {
  return (
    <div className={`card ${noPadding ? "p-0!" : ""} ${className}`}>
      {/* p-0! = !important; 스타일 우선순위 강제로 높이기 */}
      {children}
    </div>
  );
}
