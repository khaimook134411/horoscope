"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { LevelDropdown } from "@/components/ui/Dropdown";
import { Horoscope } from "@/types";
import CloseIcon from "./icons/CloseIcon";

interface HoroscopeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: HoroscopeFormData) => Promise<void>;
  editData?: Horoscope | null;
  title: string;
}

interface HoroscopeFormData {
  level: number;
  description: string;
  note: string;
}

export default function HoroscopeModal({
  isOpen,
  onClose,
  onSave,
  editData,
  title,
}: HoroscopeModalProps) {
  const [formData, setFormData] = useState<HoroscopeFormData>({
    level: 1,
    description: "",
    note: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or edit data changes
  useEffect(() => {
    if (isOpen) {
      if (editData) {
        setFormData({
          level: editData.level,
          description: editData.description,
          note: editData.note,
        });
      } else {
        setFormData({
          level: 1,
          description: "",
          note: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, editData]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = "กรุณากรอกคำอธิบาย";
    }

    if (formData.level < 1 || formData.level > 5) {
      newErrors.level = "ระดับต้องอยู่ระหว่าง 1-5";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving horoscope:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof HoroscopeFormData,
    value: string | number
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#5c57574a] transition-opacity w-[430px] mx-auto"
        onClick={onClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4 mx-auto">
        <div className="relative bg-white rounded-lg shadow-xl max-w-[430px] w-full">
          <div className="flex items-center justify-between px-4 pt-4">
            <h3 className="text-md font-semibold ">{title}</h3>

            <Button variant="ghost" size="sm" onClick={onClose}>
              <CloseIcon />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="py-4 px-6">
            <div className="space-y-4">
              <LevelDropdown
                value={formData.level}
                onChange={(level) => handleInputChange("level", level)}
                error={errors.level}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ดวง (คำทำนาย) *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="กรอกคำอธิบายดวงดาว..."
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  เสริมดวง (หมายเหตุ)
                </label>
                <textarea
                  value={formData.note}
                  onChange={(e) => handleInputChange("note", e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="หมายเหตุเพิ่มเติม (ไม่บังคับ)..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                ยกเลิก
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? "กำลังบันทึก..." : editData ? "อัปเดต" : "บันทึก"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
