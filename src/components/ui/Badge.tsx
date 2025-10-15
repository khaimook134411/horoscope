import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "blue" | "green" | "yellow" | "orange" | "red";
  size?: "sm" | "md" | "lg";
  level?: "high" | "medium" | "low" | "สูง" | "กลาง" | "ต่ำ";
  className?: string;
}

const variantStyles = {
  blue: "bg-blue-100 text-blue-800 border-blue-200",
  green: "bg-green-100 text-green-800 border-green-200",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  orange: "bg-orange-100 text-orange-800 border-orange-200",
  red: "bg-red-100 text-red-800 border-red-200",
};

export default function Badge({
  children,
  variant = "yellow",
  className = "",
}: BadgeProps) {
  const colorClass = variantStyles[variant];

  return (
    <span
      className={`inline-flex items-center text-xs py-1 px-2 font-semibold rounded-full border ${colorClass} ${className}`}
    >
      {children}
    </span>
  );
}
