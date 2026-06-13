import { type ReactNode, type ButtonHTMLAttributes } from "react";

// 버튼 스타일 종류
type Variant = "primary" | "ghost" | "icon";
// 버튼 크기 종류
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode; // 버튼 내용
  variant?: Variant; // 스타일
  size?: Size; // 크기
  className?: string; // 추가요소
}

// Init
export default function Button({
  children,
  variant = "ghost",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {

  // 
  const variantCls: Record<Variant, string> = {
    primary: "btn-primary",
    ghost: "btn-ghost",
    icon: "btn-icon",
  };

  const sizeCls: Record<Size, string> = {
    sm: "btn-sm",
    md: "btn-md",
  };

  const cls =
    variant === "icon"
      ? `btn-icon ${className}`
      : `${variantCls[variant]} ${sizeCls[size]} ${className}`;

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
