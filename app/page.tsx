// app/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function HomePage() {
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !studentName) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วนก่อนเข้าใช้งานครับ');
      return;
    }

    // 💾 บันทึกข้อมูลนักศึกษาที่ล็อกอินลง localStorage จำลองเป็น Session
    localStorage.setItem('currentStudentId', studentId);
    localStorage.setItem('currentStudentName', studentName);

    // พาเดินหน้าไปที่หน้ารวมกิจกรรมของนักศึกษา
    window.location.href = '/student/activities';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 relative font-sans">
      
      {/* ⚙️ 1. ลิงก์แอดมิน (อาจารย์) ซ่อนไว้มุมขวาบน เล็กๆ ตามบรีฟ */}
      <div className="absolute top-4 right-4 z-10">
        <Link 
          href="/admin/activities" 
          className="text-xs font-bold text-slate-400 hover:text-blue-600 border border-slate-200 hover:border-blue-300 bg-white px-3 py-1.5 rounded-lg transition shadow-sm block"
        >
          ⚙️ สำหรับผู้ดูแลระบบ (Admin)
        </Link>
      </div>

      {/* 👨‍🎓 2. กล่องล็อกอินนักศึกษา อยู่ตรงกลางหน้าจอเด่นๆ */}
      <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl mx-auto font-black shadow-inner">
            🎓
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            RMUTI Smart Check-In
          </h1>
          <p className="text-xs text-slate-400">
            โปรดกรอกข้อมูลเพื่อเข้าสู่ระบบกิจกรรมนักศึกษา
          </p>
        </div>

        {/* ฟอร์มล็อกอินเข้าใช้งาน */}
        <form onSubmit={handleStudentLogin} className="space-y-4">
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                รหัสนักศึกษา
              </label>
              <input 
                type="text" 
                required
                placeholder="เช่น 66012345"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                ชื่อ - นามสกุล
              </label>
              <input 
                type="text" 
                required
                placeholder="เช่น นายสมชาย สายเนิร์ด"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl text-sm shadow-lg shadow-blue-100 transition active:scale-[0.99] mt-2"
          >
            เข้าสู่ระบบนักศึกษา ➡️
          </button>
        </form>
      </div>

      <div className="text-center text-[10px] text-slate-400 mt-8 font-medium tracking-wide">
        มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน วิทยาเขตนครราชสีมา • 2026
      </div>
    </div>
  );
}