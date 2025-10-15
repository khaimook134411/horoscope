"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import CheckIcon from "../icons/CheckIcon";
import ArrowIcon from "../icons/ArrowIcon";

interface DropdownOption {
  value: string | number;
  label: string;
  description?: string;
  icon?: string;
  color?: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "bordered" | "filled";
}

export default function Dropdown({
  options,
  value,
  onChange,
  placeholder = "เลือก...",
  label,
  error,
  disabled = false,
  className = "",
  size = "md",
  variant = "default",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter options based on search term
  const filteredOptions = options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected option
  const selectedOption = options.find((option) => option.value === value);

  // Size variants
  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-4 py-3 text-base",
  };

  // Variant styles
  const variantStyles = {
    default: "border border-gray-300 bg-white hover:border-gray-400",
    bordered: "border-2 border-blue-200 bg-white hover:border-blue-300",
    filled: "border border-gray-200 bg-gray-50 hover:bg-gray-100",
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchTerm("");
      }
    }
  };

  const handleOptionSelect = (option: DropdownOption) => {
    onChange(option.value);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setSearchTerm("");
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (filteredOptions.length === 1) {
        handleOptionSelect(filteredOptions[0]);
      }
    }
  };

  const dropdownClasses = cn(
    "relative w-full rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-opacity-50",
    variantStyles[variant],
    sizeStyles[size],
    error ? "border-red-300 focus-within:ring-red-500" : "",
    disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : "cursor-pointer",
    className
  );

  return (
    <div className="space-y-2">
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Dropdown Container */}
      <div ref={dropdownRef} className="relative">
        {/* Trigger Button */}
        <div
          className={dropdownClasses}
          onClick={handleToggle}
          role="button"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 flex-1">
              {selectedOption ? (
                <div className="flex items-center min-w-0">
                  {selectedOption.icon && (
                    <span className="mr-2 text-lg">{selectedOption.icon}</span>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-gray-900 truncate">
                      {selectedOption.label}
                    </div>
                    {selectedOption.description && (
                      <div className="text-xs text-gray-500 truncate">
                        {selectedOption.description}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <span className="text-gray-500">{placeholder}</span>
              )}
            </div>

            {/* Dropdown Arrow */}
            <div className="ml-2 flex-shrink-0">
              {isOpen ? (
                <ArrowIcon className="rotate-180 w-5 h-5 text-gray-400 transition-transform duration-200" />
              ) : (
                <ArrowIcon className="w-5 h-5 text-gray-400 transition-transform duration-200" />
              )}
            </div>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-hidden">
            {/* Search Input */}
            {options.length > 5 && (
              <div className="p-3 border-b border-gray-100">
                <input
                  type="text"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="ค้นหา..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options List */}
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  ไม่พบตัวเลือก
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={cn(
                      "px-4 py-3 cursor-pointer transition-colors duration-150 hover:bg-gray-50",
                      option.value === value
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-900"
                    )}
                    onClick={() => handleOptionSelect(option)}
                    role="option"
                    aria-selected={option.value === value}
                  >
                    <div className="flex items-center">
                      {option.icon && (
                        <span className="mr-3 text-lg">{option.icon}</span>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {option.label}
                        </div>
                        {option.description && (
                          <div className="text-sm text-gray-500 truncate">
                            {option.description}
                          </div>
                        )}
                      </div>
                      {option.value === value && (
                        <CheckIcon className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center">{error}</p>
      )}
    </div>
  );
}

// Preset dropdown for horoscope levels
export const LevelDropdown = ({
  value,
  onChange,
  error,
  className,
}: {
  value?: number;
  onChange: (value: number) => void;
  error?: string;
  className?: string;
}) => {
  const levelOptions: DropdownOption[] = [
    {
      value: 1,
      label: "โชคดีมาก",
      description: "ระดับ 1 - โชคดีที่สุด",
      icon: "🌟",
      color: "text-green-600",
    },
    {
      value: 2,
      label: "โชคดี",
      description: "ระดับ 2 - โชคดี",
      icon: "✨",
      color: "text-blue-600",
    },
    {
      value: 3,
      label: "ปานกลาง",
      description: "ระดับ 3 - ธรรมดา",
      icon: "⚖️",
      color: "text-yellow-600",
    },
    {
      value: 4,
      label: "ไม่ค่อยดี",
      description: "ระดับ 4 - ต้องระวัง",
      icon: "⚠️",
      color: "text-orange-600",
    },
    {
      value: 5,
      label: "โชคร้าย",
      description: "ระดับ 5 - ระวังให้มาก",
      icon: "🚫",
      color: "text-red-600",
    },
  ];

  return (
    <Dropdown
      options={levelOptions}
      value={value}
      onChange={(val) => onChange(val as number)}
      placeholder="เลือกระดับความโชคดี"
      label="ระดับความโชคดี"
      error={error}
      className={className}
      variant="bordered"
    />
  );
};
