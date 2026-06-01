// app/admin/activities/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Activity {
  id: string;
  name: string;
  location: string;
  isActive: boolean;
}

interface CheckInRecord {
  activityId: string;
}

export default function AdminActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [allCheckIns, setAllCheckIns] = useState<CheckInRecord[]>([]);

  useEffect(() => {
    // ดึงรายการกิจกรรมทั้งหมดมาโชว์
    const savedActivities = localStorage.getItem('global_activities');
    if (savedActivities) {
      setTimeout(() => setActivities(JSON.parse(savedActivities)), 0);
    }
    
    // ดึงข้อมูลเช็คชื่อมาเพื่อร่วมนับยอดจำนวนนักศึกษา
    const savedCheckIns = localStorage.getItem('global_checkins');
    if (savedCheckIns) {
      setTimeout(() => setAllCheckIns(JSON.parse(savedCheckIns)), 0);
    }
  }, []);

  // ฟังก์ชันสลับ เปิด/ปิด การรับเช็คชื่อของวิชานั้นๆ
  const toggleActivityStatus = (id: string) => {
    const updated = activities.map(act => act.id === id ? { ...act, isActive: !act.isActive } : act);
    setActivities(updated);
    localStorage.setItem('global_activities', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* ส่วนหัวแดชบอร์ด */}
        <div className="flex justify-between items-center border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-2xl font-black text-slate-950">👨‍🏫 แดชบอร์ดจัดการกิจกรรม (Admin)</h1>
            <p className="text-xs text-slate-500 mt-0.5">สร้างกิจกรรม ตรวจสอบสถานะ และอนุมัติการเช็คชื่อของนักศึกษา</p>
          </div>
          <div className="flex gap-2">
            <Link href="/" className="text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded-xl transition">
              🏠 หน้าแรกสุด
            </Link>
            <Link href="/admin/create" className="text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl shadow transition">
              ➕ สร้างกิจกรรมใหม่
            </Link>
          </div>
        </div>

        {/* กล่องแสดงรายการกิจกรรม */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b font-bold text-sm text-slate-900 bg-slate-50/50">📋 รายการกิจกรรมและวิชาเรียนทั้งหมด</div>
          
          {activities.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-sm">ยังไม่มีกิจกรรมในระบบ กดปุ่มสร้างกิจกรรมใหม่ที่มุมขวาบนได้เลยครับพี่</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {activities.map((activity) => {
                // นับจำนวนเด็กที่กดส่งเช็คชื่อเข้ามาในกิจกรรมนี้
                const currentCount = allCheckIns.filter(r => r.activityId === activity.id).length;

                return (
                  <div key={activity.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {activity.id}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900">{activity.name}</h3>
                      </div>
                      <p className="text-xs text-slate-400">📍 สถานที่: {activity.location}</p>
                      <p className="text-xs font-semibold text-slate-500">📥 มีผู้ส่งเช็คชื่อเข้ามาแล้ว: <span className="text-blue-600 font-mono font-bold">{currentCount} คน</span></p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* ปุ่มสลับเปิดปิดระบบ */}
                      <button
                        onClick={() => toggleActivityStatus(activity.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                          activity.isActive 
                            ? 'bg-green-50 text-green-600 border-green-200' 
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}
                      >
                        {activity.isActive ? '🟢 เปิดรับเช็คชื่อ' : '🔴 ปิดรับเช็คชื่อ'}
                      </button>

                      {/* ลิงก์กดเจาะลึกเข้าไปดูรายชื่อเด็กด้านใน */}
                      <Link
                        href={`/admin/activities/${activity.id}`}
                        className="text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white px-4 py-1.5 rounded-xl shadow-sm transition"
                      >
                        👁️ ตรวจรายชื่อนักศึกษา
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}