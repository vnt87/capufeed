import * as React from "react"
import { cn } from "@/lib/utils"

interface CircularProgressProps {
  value: number
  className?: string
  size?: number
  strokeWidth?: number
  children?: React.ReactNode
}

export function CircularProgress({
  value,
  className,
  size = 300,
  strokeWidth = 12,
  children,
  ...props
}: CircularProgressProps) {
  // Calculate circle properties
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDashoffset = circumference - (value / 100) * circumference

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      {...props}
    >
      {/* Background circle */}
      <svg
        className="absolute"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          className="text-secondary"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="currentColor"
        />
        <circle
          className="text-baby-purple dark:text-purple-400 transition-all duration-500 ease-in-out"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      {children}
    </div>
  )
}
