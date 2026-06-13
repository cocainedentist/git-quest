import type { ReactNode } from 'react'

interface StatCardProps {
  value: ReactNode // 숫자 이외에 1,250같은 문자열도 받기 위해서
  label: string
  icon?: ReactNode // lucide-react 활용 위해서
  valueClassName?: string
}

export default function StatCard({ value, label, icon, valueClassName = 'text-text-primary' }: StatCardProps) {
  return (
    <div className="stat-card">
      <span className={`stat-value ${valueClassName}`}>{value}</span>
      <span className="stat-label">
        {icon}
        {label}
      </span>
    </div>
  )
}
