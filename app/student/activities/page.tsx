// app/student/activities/page.tsx
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
  studentId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function StudentActivitiesPage() {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [activities, setActivities] = useState<Activity[]>([]);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);
  const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);

  useEffect(() => {
    // 1. ดึงข้อมูลนักศึกษาที่ล็อกอินไว้
    const sId = localStorage.getItem('currentStudentId') || '66000000';
    const sName = localStorage.getItem('currentStudentName') || 'นักศึกษาทดสอบ';
    
    // 🟢 ครอบ setTimeout ป้องกัน Error cascading renders
    setTimeout(() => {
      setStudentId(sId);
      setStudentName(sName);
    }, 0);

    // 2. ดึงรายการกิจกรรมทั้งหมดในระบบ (ถ้าไม่มีให้ตั้งค่าเริ่มต้นซอฟต์ๆ ไว้ก่อน)
    const savedActivities = localStorage.getItem('global_activities');
    if (!savedActivities) {
      const defaultActivities: Activity[] = [
        { id: 'ACT-9981', name: 'ปฐมนิเทศนักศึกษาใหม่ 2569', location: 'หอประชุมใหญ่ มทร.อีสาน', isActive: true },
        { id: 'ACT-1024', name: 'สัมมนาวิชาการด้านเทคโนโลยี', location: 'อาคารปฏิบัติการคอมพิวเตอร์', isActive: true }
      ];
      localStorage.setItem('global_activities', JSON.stringify(defaultActivities));
      
      setTimeout(() => {
        setActivities(defaultActivities);
      }, 0);
    } else {
      setTimeout(() => {
        setActivities(JSON.parse(savedActivities));
      }, 0);
    }

    // 3. ดึงรายการกิจกรรมที่นักศึกษาคนนี้ "กดเข้าร่วม" ไว้
    const savedJoined = localStorage.getItem(`joined_${sId}`);
    if (savedJoined) {
      setTimeout(() => {
        setJoinedIds(JSON.parse(savedJoined));
      }, 0);
    }

    // 4. ดึงสถานะประวัติการเช็คชื่อ
    const savedRecords = localStorage.getItem('global_checkins');
    if (savedRecords) {
      const allRecords: CheckInRecord[] = JSON.parse(savedRecords);
      // กรองเอาเฉพาะรายการเช็คชื่อของเด็กคนนี้
      setTimeout(() => {
        setCheckInRecords(allRecords.filter(r => r.studentId === sId));
      }, 0);
    }
  }, []);

  // ฟังก์ชันกด "ลงทะเบียนเข้าร่วมกิจกรรม" (เซฟเก็บลงเครื่องทันที)
  const handleJoinActivity = (activityId: string) => {
    const updatedJoined = [...joinedIds, activityId];
    setJoinedIds(updatedJoined);
    localStorage.setItem(`joined_${studentId}`, JSON.stringify(updatedJoined));
  };

  // ฟังก์ชันเช็คสถานะของกิจกรรมนั้นๆ ว่าเด็กคนนี้ทำถึงขั้นไหนแล้ว
  const getCheckInStatus = (activityId: string) => {
    const record = checkInRecords.find(r => r.activityId === activityId);
    return record ? record.status : null;
  };

  const handleLogout = () => {
    localStorage.removeItem('currentStudentId');
    localStorage.removeItem('currentStudentName');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans max-w-md mx-auto shadow-2xl bg-white flex flex-col justify-between">
      
      {/* ส่วนหัวแสดงโปรไฟล์นักศึกษา */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-b-3xl shadow-md">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs text-blue-100 font-semibold tracking-wider uppercase">ยินดีต้อนรับ</p>
            <h2 className="text-xl font-black mt-0.5">{studentName}</h2>
            <p className="text-xs font-mono text-blue-200 mt-1">รหัสประจำตัว: {studentId}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-xl transition"
          >
            ออกระบบ 🚪
          </button>
        </div>
      </div>

      {/* รายการกิจกรรม */}
      <div className="p-4 flex-1 space-y-4">
        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
          📅 รายการกิจกรรมประจำปี 2026
        </h3>

        {activities.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">ยังไม่มีกิจกรรมเปิดให้เข้าร่วมในขณะนี้</p>
        ) : (
          activities.map((activity) => {
            const isJoined = joinedIds.includes(activity.id);
            const checkInStatus = getCheckInStatus(activity.id);

            return (
              <div key={activity.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <span className="text-[10px] font-bold font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                      {activity.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{activity.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">📍 {activity.location}</p>
                  </div>
                  
                  {/* แสดงป้ายสถานะเช็คชื่อย้อนหลัง */}
                  {checkInStatus === 'PENDING' && <span className="text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200 px-2 py-1 rounded-lg">⏳ รออาจารย์ตรวจ</span>}
                  {checkInStatus === 'APPROVED' && <span className="text-[11px] font-bold bg-green-50 text-green-600 border border-green-200 px-2 py-1 rounded-lg">✅ เช็คชื่อสำเร็จ</span>}
                  {checkInStatus === 'REJECTED' && <span className="text-[11px] font-bold bg-red-50 text-red-600 border border-red-200 px-2 py-1 rounded-lg">❌ รูปไม่ชัดเจน</span>}
                </div>

                {/* ปุ่มควบคุมตามตรรกะข้อ 2 */}
                <div className="pt-1">
                  {!isJoined ? (
                    /* 1. สเต็ปยังไม่ได้กดเข้าร่วมกิจกรรม */
                    <button
                      onClick={() => handleJoinActivity(activity.id)}
                      disabled={!activity.isActive}
                      className="w-full text-center text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 py-2.5 rounded-xl transition border border-blue-200"
                    >
                      📌 กดลงทะเบียนเข้าร่วมกิจกรรม
                    </button>
                  ) : (
                    /* 2. เมื่อกดเข้าร่วมกิจกรรมเซฟลงเครื่องแล้ว */
                    checkInStatus === null ? (
                      /* ยังไม่เคยเช็คชื่อ ให้กดปุ่มไปหน้ากล้อง + GPS */
                      <Link
                        href={`/student/${activity.id}`}
                        className="w-full text-center block text-xs font-bold bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl transition shadow-md shadow-green-100"
                      >
                        📲 กดเข้าสู่หน้าเช็คชื่อ (เปิดกล้อง/GPS)
                      </Link>
                    ) : (
                      /* เช็คชื่อไปแล้ว ล็อกปุ่มไว้ ดูสถานะด้านบนแทน */
                      <button
                        disabled
                        className="w-full text-center text-xs font-bold bg-slate-100 text-slate-400 py-2.5 rounded-xl cursor-not-allowed border"
                      >
                        🔒 ส่งข้อมูลหลักฐานไปแล้ว
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="text-center text-[10px] text-slate-400 p-4 border-t bg-slate-50">
        ระบบเดโมเวอร์ชันพิเศษปรับปรุงแก้ไขง่าย
      </div>
    </div>
  );
}