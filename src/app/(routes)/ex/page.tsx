"use client";

import { Button } from "@/components/ui/Button";
import React from "react";

export default function page() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          ระบบจัดการดวงดาว
        </h1>

        <div className="grid gap-6">
          {/* Button Examples */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">ตัวอย่างปุ่ม</h2>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary Button</Button>
              <Button variant="secondary">Secondary Button</Button>
              <Button variant="outline">Outline Button</Button>
              <Button variant="ghost">Ghost Button</Button>
              <Button variant="destructive">Delete Button</Button>
            </div>
          </div>

          {/* Size Examples */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">ขนาดปุ่ม</h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm" variant="primary">
                Small
              </Button>
              <Button size="md" variant="primary">
                Medium
              </Button>
              <Button size="lg" variant="primary">
                Large
              </Button>
            </div>
          </div>

          {/* Loading Example */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              ปุ่มแสดงสถานะ Loading
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button loading={true}>กำลังโหลด...</Button>
              <Button disabled={true}>ปิดใช้งาน</Button>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">การจัดการดวงดาว</h2>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  //   window.location.href = "/horoscopes/add";
                }}
              >
                + เพิ่มดวงดาวใหม่
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  //   window.location.href = "/horoscopes";
                }}
              >
                ดูรายการดวงดาว
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
