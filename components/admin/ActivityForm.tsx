// components/admin/ActivityForm.tsx
'use client'; // บังคับเป็น Client Component เพราะมีการใช้ State และ Form Submit

import React, { useState } from 'react';

export default function ActivityForm() {
  const [name, setName] = useState('');
  const [radius, setRadius] = useState(50);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  // พิกัดจำลอง (ตัวอย่าง: มทร.อีสาน นครราชสีมา)
  const mockLat = 14.9845;
  const mockLon = 102.1124;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // จำลองการสร้างรหัสกิจกรรมแบบสุ่ม
    const randomCode = 'ACT-' + Math.floor(1000 + Math.random() * 9000);
    setGeneratedCode(randomCode);
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        📍 สร้างกิจกรรมใหม่
      </h2>

      {!generatedCode ? (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ชื่อกิจกรรม / รายวิชา</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-gray-900"
              placeholder="เช่น ปัธมนิเทศนักศึกษาใหม่ 2569"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">พิกัดละติจูด (จำลอง)</label>
              <input type="text" disabled value={mockLat} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">พิกัดลองจิจูด (จำลอง)</label>
              <input type="text" disabled value={mockLon} className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">รัศมีที่อนุญาต (เมตร)</label>
            <input
              type="number"
              required
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 transition duration-200"
          >
            บันทึกและสร้างรหัสเข้ากิจกรรม
          </button>
        </form>
      ) : (
        /* เมื่อสร้างสำเร็จ จะแสดงรหัสให้เอาไปใช้ */
        <div className="text-center py-6 space-y-4 animate-fade-in">
          <div className="text-green-500 text-5xl">🎉</div>
          <p className="text-gray-600 font-medium">สร้างกิจกรรม &quot;{name}&quot; สำเร็จแล้ว!</p>
          <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-300 inline-block">
            <span className="text-xs text-gray-400 font-bold tracking-widest uppercase block mb-1">รหัสกิจกรรม (Activity Code)</span>
            <span className="text-4xl font-mono font-extrabold text-blue-600 tracking-wider">{generatedCode}</span>
          </div>
          <button
            onClick={() => setGeneratedCode(null)}
            className="block mx-auto text-sm text-gray-500 hover:text-blue-600 underline"
          >
            สร้างกิจกรรมอื่นเพิ่ม
          </button>
        </div>
      )}
    </div>
  );
}