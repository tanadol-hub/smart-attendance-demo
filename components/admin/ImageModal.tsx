// components/admin/ImageModal.tsx
'use client';

import React from 'react';

// 🟢 ปรับโครงสร้างข้อมูลนักศึกษาให้รองรับค่าจากหน้าแดชบอร์ดเดิมด้วย
interface StudentModalData {
  id: string;
  name: string;
  distance: number;
  photoUrl?: string; 
  time?: string;
  status?: string;
}

// 🟢 เพิ่มสเปก Props ให้รองรับโครงสร้างเดิมของหน้าแดชบอร์ด (isOpen, onApprove, onReject)
interface ImageModalProps {
  isOpen?: boolean; 
  onClose: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  student: StudentModalData | null;
}

export default function ImageModal({ isOpen, onClose, onApprove, onReject, student }: ImageModalProps) {
  // เช็คเงื่อนไขการเปิด: ถ้าส่ง isOpen มาให้ใช้ isOpen ร่วมด้วย ถ้าไม่ส่งมาให้เช็คแค่ว่ามีข้อมูล student ไหม
  const shouldShow = isOpen !== undefined ? isOpen && student : !!student;
  
  if (!shouldShow || !student) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-900 text-sm">📷 ตรวจสอบภาพถ่ายยืนยันตัวตน</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition text-lg leading-none">&times;</button>
        </div>
        
        <div className="p-6">
          {/* กล่องแสดงรูปถ่ายสแนปสดจากกล้องเด็ก */}
          <div className="relative aspect-[4/3] w-full bg-slate-950 rounded-xl overflow-hidden border border-slate-200 mb-4">
            {student.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img 
                src={student.photoUrl} 
                alt="Student Live Snapshot" 
                className="w-full h-full object-cover scale-x-[-1]" 
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                ไม่พบไฟล์ภาพถ่ายหลักฐาน (ใช้รูปจำลองระบบ)
              </div>
            )}
          </div>
          
          {/* ข้อมูลรายละเอียดของนักศึกษา */}
          <div className="text-center space-y-1 mb-6">
            <p className="font-bold text-slate-900 text-base">{student.name}</p>
            <p className="text-xs text-slate-500 font-mono">รหัส: {student.id}</p>
            <div className="flex justify-center gap-2 mt-2">
              <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2.5 py-1 rounded-md">
                📍 ห่าง {student.distance} เมตร
              </span>
              {student.time && (
                <span className="text-xs text-slate-600 font-semibold bg-slate-100 px-2.5 py-1 rounded-md">
                  🕒 เวลา: {student.time}
                </span>
              )}
            </div>
          </div>

          {/* 🟢 ปุ่ม อนุมัติ / ปฏิเสธ: จะแสดงขึ้นมาอัตโนมัติเฉพาะหน้าแดชบอร์ดที่มีการส่งฟังก์ชันเข้ามา */}
          {(onApprove || onReject) && (
            <div className="grid grid-cols-2 gap-3 border-t pt-4">
              {onReject && (
                <button
                  onClick={() => {
                    onReject();
                    onClose();
                  }}
                  className="w-full text-xs font-bold bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 py-2.5 rounded-xl transition"
                >
                  ❌ ปฏิเสธ
                </button>
              )}
              {onApprove && (
                <button
                  onClick={() => {
                    onApprove();
                    onClose();
                  }}
                  className="w-full text-xs font-bold bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl transition shadow-sm"
                >
                  ✅ อนุมัติ
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}