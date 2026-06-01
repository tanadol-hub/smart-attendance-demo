// app/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link'; // 🟢 ใช้ Link ตัวนี้ตัวเดียวจบในการเปลี่ยนหน้าครับ

export default function HomePage() {
  const [mockCode, setMockCode] = useState('ACT-9981');
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <div className="max-w-md w-full text-center space-y-3 mb-8">
        <h1 className="text-4xl font-black text-gray-950 tracking-tight">
          RMUTI Smart Check-in
        </h1>
        <p className="text-sm text-gray-500">
          ระบบเช็คชื่อเข้ากิจกรรมอัจฉริยะ ด้วยเทคโนโลยี Geofencing และ Live Photo
        </p>
      </div>

      <div className="max-w-md w-full space-y-4">
        {/* กล่องฝั่งอาจารย์ */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            👨‍🏫 สำหรับอาจารย์ / ผู้ดูแลระบบ
          </h2>
          <p className="text-xs text-gray-500">
            สร้างกิจกรรมใหม่ กำหนดรัศมี GPS และเปิดแดชบอร์ดเพื่อตรวจภาพถ่ายหลักฐานของนักศึกษา
          </p>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <Link 
              href="/admin/create"
              className="bg-blue-600 hover:bg-blue-700 text-white text-center font-bold py-2.5 px-4 rounded-xl text-sm transition"
            >
              ➕ สร้างกิจกรรม
            </Link>
            <Link 
              href="/admin/dashboard"
              className="bg-gray-900 hover:bg-gray-800 text-white text-center font-bold py-2.5 px-4 rounded-xl text-sm transition"
            >
              📊 แดชบอร์ดตรวจยอด
            </Link>
          </div>
        </div>

        {/* กล่องฝั่งนักศึกษา */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            👨‍🎓 สำหรับนักศึกษา (เดโมระบบ)
          </h2>
          <p className="text-xs text-gray-500">
            จำลองสถานการณ์สแกนคิวอาร์โค้ดเข้ามาเช็คชื่อ โดยระบบจะบังคับเปิดกล้องและตรวจพิกัด GPS
          </p>
          <div className="pt-2 space-y-2">
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">ใส่รหัสกิจกรรมสมมติเพื่อทดสอบ</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={mockCode}
                onChange={(e) => setMockCode(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-xl font-mono text-sm uppercase text-gray-900 outline-none focus:border-blue-500"
              />
              <Link 
                href={`/student/${mockCode || 'ACT-DEFAULT'}`}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-5 rounded-xl text-sm transition flex items-center"
              >
                เข้าเช็คชื่อ ➡️
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-gray-400 mt-12">
        พัฒนาเพื่อใช้ในโครงการประกวดซอฟต์แวร์วิชาการ © 2026
      </div>
    </div>
  );
}