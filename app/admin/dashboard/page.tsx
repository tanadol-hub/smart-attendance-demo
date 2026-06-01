// app/admin/dashboard/page.tsx
'use client';

import React, { useState } from 'react';
import ImageModal from '@/components/admin/ImageModal';

// สร้างข้อมูลจำลอง (Mock Data) ของเด็กที่เช็คชื่อเข้ามา
const mockRecords = [
  { id: '66012345', name: 'นายสมชาย สายเนิร์ด', time: '09:02 น.', distance: 12.5, status: 'PENDING' },
  { id: '66012389', name: 'นางสาวสมศรี เรียนดี', time: '09:05 น.', distance: 4.2, status: 'PENDING' },
  { id: '66012412', name: 'นายมานะ ขยันยิ่ง', time: '08:58 น.', distance: 22.1, status: 'APPROVED' },
];

export default function AdminDashboardPage() {
  const [records, setRecords] = useState(mockRecords);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<typeof mockRecords[0] | null>(null);

  const openVerification = (student: typeof mockRecords[0]) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  // ฟังก์ชันเวลากดอนุมัติในโมดอล
  const handleApprove = () => {
    if (selectedStudent) {
      setRecords(records.map(r => r.id === selectedStudent.id ? { ...r, status: 'APPROVED' } : r));
      setIsModalOpen(false);
    }
  };

  // ฟังก์ชันเวลากดปฏิเสธในโมดอล
  const handleReject = () => {
    if (selectedStudent) {
      setRecords(records.map(r => r.id === selectedStudent.id ? { ...r, status: 'REJECTED' } : r));
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* หัวกระดาษ */}
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h1 className="text-2xl font-black text-gray-950">📊 แดชบอร์ดผู้ดูแลระบบ</h1>
            <p className="text-sm text-gray-500 mt-0.5">กิจกรรม: ปฐมนิเทศนักศึกษาใหม่ 2026</p>
          </div>
          <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full">🔴 กำลังเปิดรับเช็คชื่อ</span>
        </div>

        {/* การ์ดสรุปจำนวนยอดสรุป */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <span className="text-xs font-medium text-gray-500 block">มาเรียนทั้งหมด</span>
            <span className="text-2xl font-black text-gray-900">3 คน</span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <span className="text-xs font-medium text-gray-500 block text-green-600">อนุมัติแล้ว</span>
            <span className="text-2xl font-black text-green-600">
              {records.filter(r => r.status === 'APPROVED').length} คน
            </span>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm text-center">
            <span className="text-xs font-medium text-gray-500 block text-amber-500">รอตรวจสอบ</span>
            <span className="text-2xl font-black text-amber-500">
              {records.filter(r => r.status === 'PENDING').length} คน
            </span>
          </div>
        </div>

        {/* ตารางรายชื่อนักศึกษา */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 bg-gray-50 border-b font-bold text-sm text-gray-700">รายชื่อการส่งเช็คชื่อล่าสุด</div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-700">
              <thead className="bg-gray-100 text-xs font-bold uppercase text-gray-600 border-b">
                <tr>
                  <th className="p-4">รหัสนักศึกษา</th>
                  <th className="p-4">ชื่อ-นามสกุล</th>
                  <th className="p-4">เวลาส่ง</th>
                  <th className="p-4">สถานะ</th>
                  <th className="p-4 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 transition">
                    <td className="p-4 font-mono font-medium text-gray-900">{record.id}</td>
                    <td className="p-4 font-semibold text-gray-800">{record.name}</td>
                    <td className="p-4 text-gray-500">{record.time}</td>
                    <td className="p-4">
                      {record.status === 'PENDING' && <span className="bg-amber-50 text-amber-700 text-xs px-2.5 py-1 rounded-md font-bold">⏳ รอตรวจรูป</span>}
                      {record.status === 'APPROVED' && <span className="bg-green-50 text-green-700 text-xs px-2.5 py-1 rounded-md font-bold">✅ ผ่านแล้ว</span>}
                      {record.status === 'REJECTED' && <span className="bg-red-50 text-red-700 text-xs px-2.5 py-1 rounded-md font-bold">❌ ถูกปฏิเสธ</span>}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => openVerification(record)}
                        disabled={record.status !== 'PENDING'}
                        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition ${
                          record.status === 'PENDING'
                            ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {record.status === 'PENDING' ? '👁️ ดูหลักฐาน' : 'ตรวจแล้ว'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* เรียกใช้งาน ป๊อปอัปส่องรูป */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
        student={selectedStudent}
      />
    </div>
  );
}