// components/admin/ImageModal.tsx
'use client';

import React from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  student: {
    id: string;
    name: string;
    distance: number;
  } | null;
}

export default function ImageModal({ isOpen, onClose, onApprove, onReject, student }: ImageModalProps) {
  if (!isOpen || !student) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* พื้นหลังมืดโปร่งแสง (Overlay) */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* กล่องหน้าต่าง Modal */}
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative z-10 shadow-2xl mx-4 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-lg font-bold text-gray-950">
            🔎 ตรวจสอบภาพถ่ายหลักฐาน
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-mono text-xl">✕</button>
        </div>

        {/* รายละเอียดนักศึกษา */}
        <div className="mb-4 space-y-1">
          <p className="text-sm text-gray-900 font-semibold">รหัสนักศึกษา: <span className="font-mono text-blue-600">{student.id}</span></p>
          <p className="text-sm text-gray-900 font-semibold">ชื่อ-นามสกุล: <span className="text-gray-700">{student.name}</span></p>
          <p className="text-xs text-gray-500">
            📍 สถานะ GPS: <span className="text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">ปกติ (ห่าง {student.distance} เมตร)</span>
          </p>
        </div>

        {/* รูปจำลองตัวอย่างใบหน้าเด็ก (Placeholder) */}
        <div className="relative aspect-[4/3] w-full bg-gray-100 rounded-xl overflow-hidden border border-gray-200 mb-6 flex items-center justify-center text-gray-400">
          <div className="text-center space-y-2">
            <span className="text-4xl block">👤</span>
            <span className="text-xs block font-medium text-gray-500">[ รูปภาพสตรีมสดจากกล้องนักศึกษา ]</span>
          </div>
        </div>

        {/* ปุ่มควบคุมคำสั่ง */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onReject}
            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-xl border border-red-200 transition"
          >
            ❌ ปฏิเสธ (ภาพไม่ชัด)
          </button>
          <button
            onClick={onApprove}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-100 transition"
          >
            ✅ อนุมัติการเข้าเรียน
          </button>
        </div>
      </div>
    </div>
  );
}