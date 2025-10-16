import React from "react";

interface StatusCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor?: string;
  className?: string;
  description?: string;
  variant?: "blue" | "green" | "yellow" | "red" | "purple";
}

const variantStyles = {
  blue: "bg-blue-100",
  green: "bg-green-100",
  yellow: "bg-yellow-100",
  red: "bg-red-100",
  purple: "bg-purple-100",
};

export default function StatusCard({
  title,
  value,
  icon,
  iconBgColor,
  className = "",
  description,
  variant = "blue",
}: StatusCardProps) {
  const bgColor = iconBgColor || variantStyles[variant];

  return (
    <div className={`bg-white rounded-lg shadow-sm p-2 ${className}`}>
      <div className="flex items-center gap-4">
        <div
          className={`p-2 ${bgColor} w-10 h-10 rounded-lg flex items-center justify-center`}
        >
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <p className="text-xs font-medium text-gray-600">{title}</p>
          <p className="text-lg font-bold text-gray-900">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
