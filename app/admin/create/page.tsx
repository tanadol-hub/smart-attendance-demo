// app/admin/create/page.tsx

import React from 'react';
import ActivityForm from '@/components/admin/ActivityForm'; // 🧩 ดึง UI ที่เราแยกไว้ออกมาใช้

export default function AdminCreatePage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
          ระบบผู้ดูแลระบบ (Admin)
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          กำหนดขอบเขตพื้นที่ GPS และสร้างกิจกรรมสำหรับเช็คชื่อนักศึกษา
        </p>
      </div>

      {/* เรียกใช้งาน UI Form ชิ้นที่เราแยกไฟล์ไว้ */}
      <ActivityForm />
    </div>
  );
}