// app/admin/dashboard/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ImageModal from '@/components/admin/ImageModal';

interface Activity {
  id: string;
  name: string;
  isActive: boolean;
}

interface CheckInRecord {
  id: string;
  activityId: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  photoUrl: string;
  distance: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function AdminDashboard() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  useEffect(() => {
    // โหลดข้อมูลทั้งหมดเมื่อเปิดหน้า
    const loadData = () => {
      const savedActs = localStorage.getItem('global_activities');
      if (savedActs) setActivities(JSON.parse(savedActs));

      const savedRecords = localStorage.getItem('global_checkins');
      if (savedRecords) setCheckIns(JSON.parse(savedRecords));
    };
    setTimeout(loadData, 0);
  }, []);

  // ฟังก์ชันอัปเดตสถานะจากหน้าแดชบอร์ด
  const handleUpdateStatus = (recordId: string, newStatus: 'APPROVED' | 'REJECTED') => {
    const updated = checkIns.map(r => r.id === recordId ? { ...r, status: newStatus } : r);
    setCheckIns(updated);
    localStorage.setItem('global_checkins', JSON.stringify(updated));
  };

  // คำนวณสถิติ
  const pendingCount = checkIns.filter(r => r.status === 'PENDING').length;
  const activeActivitiesCount = activities.filter(a => a.isActive).length;

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">📊 แดชบอร์ดภาพรวมระบบ</h1>
            <p className="text-xs text-slate-500 mt-1">สรุปข้อมูลการเช็คชื่อและกิจกรรมทั้งหมด</p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2.5 rounded-xl transition">
              🏠 หน้าแรก
            </Link>
            <Link href="/admin/activities" className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl shadow transition">
              📂 จัดการกิจกรรมทั้งหมด
            </Link>
          </div>
        </div>

        {/* สรุปสถิติ (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xl">📝</div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">กิจกรรมที่เปิดอยู่</p>
              <p className="text-2xl font-black text-slate-900">{activeActivitiesCount} <span className="text-sm font-medium text-slate-500">วิชา</span></p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-yellow-50 text-yellow-600 flex items-center justify-center text-xl">⏳</div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">รอการอนุมัติ</p>
              <p className="text-2xl font-black text-slate-900">{pendingCount} <span className="text-sm font-medium text-slate-500">รายการ</span></p>
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center text-xl">✅</div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">เช็คชื่อสำเร็จแล้ว</p>
              <p className="text-2xl font-black text-slate-900">{checkIns.filter(r => r.status === 'APPROVED').length} <span className="text-sm font-medium text-slate-500">คน</span></p>
            </div>
          </div>
        </div>

        {/* รายการที่ต้องรอกดอนุมัติด่วน (Pending Queue) */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b font-bold text-sm text-slate-900 bg-slate-50/50 flex justify-between items-center">
            <span>🚨 รายการรอกดอนุมัติด่วน (Pending)</span>
            <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">{pendingCount} รายการ</span>
          </div>
          
          {pendingCount === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm font-medium">ไม่มีรายการค้างอนุมัติครับ เคลียร์งานหมดแล้ว! 🎉</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {checkIns.filter(r => r.status === 'PENDING').map((record) => (
                <div key={record.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">รหัสกิจกรรม: {record.activityId}</span>
                      <h3 className="text-sm font-bold text-slate-900">{record.studentName} ({record.studentId})</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">🕒 {record.timestamp} | 📍 ระยะห่าง: {record.distance} ม.</p>
                  </div>
                  
                  <button
                    onClick={() => setSelectedStudent({ 
                      id: record.studentId, 
                      name: record.studentName, 
                      distance: record.distance, 
                      photoUrl: record.photoUrl,
                      time: record.timestamp,
                      recordId: record.id 
                    })}
                    className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl transition shadow-sm"
                  >
                    🔍 เปิดตรวจหลักฐาน
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* เรียกใช้งาน ImageModal แบบสมบูรณ์ */}
      {selectedStudent && (
        <ImageModal 
          isOpen={true}
          student={selectedStudent} 
          onClose={() => setSelectedStudent(null)} 
          onApprove={() => handleUpdateStatus(selectedStudent.recordId, 'APPROVED')}
          onReject={() => handleUpdateStatus(selectedStudent.recordId, 'REJECTED')}
        />
      )}
    </div>
  );
}