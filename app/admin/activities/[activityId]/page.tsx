// app/admin/activities/[activityId]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import ImageModal from '@/components/admin/ImageModal';

interface PageProps {
  params: Promise<{ activityId: string }>;
}

interface StudentRecord {
  id: string; // REC-XXXX
  activityId: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  photoUrl: string;
  distance: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function ActivityDetailsPage({ params }: PageProps) {
  const { activityId } = use(params);
  const [records, setRecords] = useState<StudentRecord[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedStudent, setSelectedStudent] = useState<any>(null); // สำหรับเปิด Modal โชว์รูป

  useEffect(() => {
    const fetchRecords = () => {
      const savedCheckIns = localStorage.getItem('global_checkins');
      if (savedCheckIns) {
        const allRecords: StudentRecord[] = JSON.parse(savedCheckIns);
        setRecords(allRecords.filter(r => r.activityId === activityId));
      }
    };
    // 🟢 ครอบ setTimeout เพื่อกัน Error Cascading Render
    setTimeout(fetchRecords, 0);
  }, [activityId]);

  const updateStatus = (recordId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    // 1. อัปเดต State ในหน้าจออาจารย์ทันที
    const updated = records.map(r => r.id === recordId ? { ...r, status: newStatus } : r);
    setRecords(updated);

    // 2. เซฟทับลง localStorage เครื่องกลาง เพื่อให้ฝั่งนักเรียนเห็นสถานะด้วย
    const savedCheckIns = localStorage.getItem('global_checkins');
    if (savedCheckIns) {
      const allRecords: StudentRecord[] = JSON.parse(savedCheckIns);
      const newAll = allRecords.map(r => r.id === recordId ? { ...r, status: newStatus } : r);
      localStorage.setItem('global_checkins', JSON.stringify(newAll));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-200 pb-4 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-950">🔍 ตรวจสอบรายชื่อ</h1>
            <p className="text-xs text-slate-500 mt-0.5">รหัสกิจกรรม: {activityId}</p>
          </div>
          <Link href="/admin/activities" className="text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-xl transition text-center">
            ⬅️ กลับหน้ารวมกิจกรรม
          </Link>
        </div>

        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          {records.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">ยังไม่มีนักศึกษาเช็คชื่อเข้ามาในกิจกรรมนี้ครับ</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {records.map((record) => (
                <div key={record.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-500">{record.studentId}</span>
                      <h3 className="text-sm font-bold text-slate-900">{record.studentName}</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">🕒 เวลาส่ง: {record.timestamp} | 📍 ระยะห่าง: {record.distance} เมตร</p>
                    
                    {/* ป้ายโชว์สถานะ */}
                    <div className="mt-2 inline-block">
                      {record.status === 'PENDING' && <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">⏳ รออาจารย์ตรวจสอบ</span>}
                      {record.status === 'APPROVED' && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">✅ อนุมัติแล้ว</span>}
                      {record.status === 'REJECTED' && <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">❌ ปฏิเสธ (ภาพ/พิกัดไม่ถูกต้อง)</span>}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* ปุ่มเปิดดูรูป */}
                    <button
                      onClick={() => setSelectedStudent({ id: record.studentId, name: record.studentName, distance: record.distance, photoUrl: record.photoUrl })}
                      className="text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-xl transition"
                    >
                      📷 ดูรูปถ่าย
                    </button>
                    
                    {/* ปุ่ม อนุมัติ / ปฏิเสธ (จะหายไปถ้าอาจารย์กดไปแล้ว) */}
                    {record.status === 'PENDING' && (
                      <>
                        <button onClick={() => updateStatus(record.id, 'APPROVED')} className="text-xs font-bold bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-xl transition shadow-sm">
                          อนุมัติ
                        </button>
                        <button onClick={() => updateStatus(record.id, 'REJECTED')} className="text-xs font-bold bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1.5 rounded-xl transition">
                          ปฏิเสธ
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal เปิดส่องรูปที่แกะมาจากกล้องเด็ก */}
      {selectedStudent && (
        <ImageModal student={selectedStudent} onClose={() => setSelectedStudent(null)} />
      )}
    </div>
  );
}