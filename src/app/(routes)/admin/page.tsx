"use client";

import { Button } from "@/components/ui/Button";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { horoscopeAPI } from "@/lib/api";
import StatusCard from "@/components/StatusCard";
import Badge from "@/components/ui/Badge";
import HoroscopeModal from "@/components/HoroscopeModal";
import { Horoscope } from "@/types";
import TrashIcon from "@/components/icons/TrashIcon";
import EditIcon from "@/components/icons/EditIcon";
import { getBadgeVariant, textByLevelMap } from "@/lib/utils";
import toast, { Toaster } from "react-hot-toast";

export default function AdminPage() {
  const [horoscopes, setHoroscopes] = useState<Horoscope[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHoroscope, setEditingHoroscope] = useState<Horoscope | null>(
    null
  );

  useEffect(() => {
    fetchHoroscopes();
  }, []);

  const fetchHoroscopes = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data } = await horoscopeAPI.getAll();

      if (data) {
        setHoroscopes(data || []);
      } else {
        setError("Failed to fetch horoscopes");
      }
    } catch {
      setError("Error fetching horoscopes");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("คุณแน่ใจหรือไม่ว่าต้องการลบดวงดาวนี้?")) {
      return;
    }
    try {
      const response = await horoscopeAPI.delete(id);
      const { data } = response;
      if (data) {
        setHoroscopes((prev) => prev.filter((h) => h.id !== id));
        toast.success("ลบสำเร็จ");
      } else {
        toast.error("เกิดข้อผิดพลาดในการลบ");
      }
    } catch {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  const handleAddNew = () => {
    setEditingHoroscope(null);
    setIsModalOpen(true);
  };

  const handleEdit = (horoscope: Horoscope) => {
    setEditingHoroscope(horoscope);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingHoroscope(null);
  };

  const handleSaveHoroscope = async (data: {
    level: number;
    description: string;
    note: string;
  }) => {
    try {
      if (editingHoroscope) {
        // Update existing horoscope - use simple API call
        const response = await horoscopeAPI.update(editingHoroscope.id, {
          level: data.level,
          description: data.description,
          note: data.note,
        });

        if (response.status === 200) {
          setHoroscopes((prev) =>
            prev.map((h) =>
              h.id === editingHoroscope.id ? { ...h, ...data } : h
            )
          );
          toast.success("อัปเดตสำเร็จ");
        } else {
          toast.error("เกิดข้อผิดพลาดในการอัปเดต");
        }
      } else {
        // Create new horoscope - use simple API call
        const response = await horoscopeAPI.create({
          level: data.level,
          description: data.description,
          note: data.note,
        });

        if (response.status === 201) {
          if (response.data[0]) {
            setHoroscopes((prev) => [...prev, response.data[0]]);
            toast.success("เพิ่มสำเร็จ");
          }
        } else {
          toast.error("เกิดข้อผิดพลาดในการเพิ่ม");
        }
      }
    } catch {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  const handleLogout = async () => {
    try {
      await horoscopeAPI.logout();
      window.location.href = "/";
    } catch {
      toast.error("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
  };

  // Filter horoscopes based on search term
  const filteredHoroscopes = horoscopes.filter((horoscope) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      horoscope.description?.toLowerCase().includes(searchLower) ||
      horoscope.note?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูลดวงดาว...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100  max-w-7xl mx-auto p-4 sm:px-6 lg:px-8">
      <Toaster />
      <div className="w-full flex justify-between">
        <Link
          href="/"
          className="text-sm text-blue-600 hover:text-blue-500 underline"
        >
          กลับสู่หน้าหลัก
        </Link>
        <Button variant="secondary" size="sm" onClick={handleLogout}>
          ออกจากระบบ
        </Button>
      </div>
      <div className="my-4">
        <h1 className="text-2xl font-bold text-gray-900">
          หน้าแอดมินจัดการดวง
        </h1>
        <p className="mt-2 text-gray-600">จัดการข้อมูลดวงดาวทั้งหมด</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-3 mb-4">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="ค้นหาคำทำนาย..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-9 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <Button variant="primary" size="md" onClick={handleAddNew}>
            + เพิ่มดวงใหม่
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <StatusCard
          title="ดวงทั้งหมด"
          value={horoscopes.length}
          icon="🔮"
          variant="blue"
        />
        <StatusCard
          title="ผลการค้นหา"
          value={filteredHoroscopes.length}
          icon="🔍"
          variant="green"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          <div className="flex">
            <span className="text-red-500">⚠️</span>
            <div className="ml-3">
              <h3 className="text-sm font-medium">เกิดข้อผิดพลาด</h3>
              <div className="mt-2 text-sm">{error}</div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ระดับ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ดวง (คำทำนาย)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  เสริมดวง (หมายเหตุ)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  การจัดการ
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredHoroscopes.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-6xl mb-4">🔮</span>
                      <p className="text-lg font-medium text-gray-900 mb-1">
                        ไม่พบข้อมูลดวงดาว
                      </p>
                      <p className="text-gray-500">
                        {horoscopes.length === 0
                          ? "ยังไม่มีข้อมูลในระบบ"
                          : "ไม่พบข้อมูลที่ตรงกับการค้นหา"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredHoroscopes.map((horoscope) => (
                  <tr key={horoscope.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getBadgeVariant(horoscope.level)}>
                        {textByLevelMap[horoscope.level] || horoscope.level}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm text-gray-900 max-w-xs truncate"
                        title={horoscope.description}
                      >
                        {horoscope.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm text-gray-900 max-w-xs truncate"
                        title={horoscope.note || "ไม่มีข้อมูล"}
                      >
                        {horoscope.note || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="!py-1 !px-1"
                          onClick={() => handleEdit(horoscope)}
                        >
                          <EditIcon />
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          className="!py-1 !px-1"
                          onClick={() => {
                            handleDelete(horoscope.id);
                          }}
                        >
                          <TrashIcon />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Horoscope Modal */}
      <HoroscopeModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleSaveHoroscope}
        editData={editingHoroscope}
        title={editingHoroscope ? "แก้ไขดวง" : "เพิ่มดวงใหม่"}
      />
    </div>
  );
}
