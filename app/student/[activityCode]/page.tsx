// app/student/[activityCode]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import CameraFeed from '@/components/student/CameraFeed';
import { calculateDistance } from '@/lib/geofence';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ activityCode: string }>;
}

// 🟢 สร้าง Interface เพื่อระบุประเภทข้อมูลแทนการใช้ any
interface SavedCheckIn {
  id: string;
  activityId: string;
  studentId: string;
  studentName: string;
  timestamp: string;
  photoUrl: string;
  distance: number;
  status: string;
}

export default function StudentCheckInPage({ params }: PageProps) {
  // แกะรหัสกิจกรรมจาก URL
  const { activityCode } = use(params);

  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [gpsStatus, setGpsStatus] = useState<'LOADING' | 'SUCCESS' | 'ERROR'>('LOADING');
  const [distance, setDistance] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // พิกัดศูนย์กลางกิจกรรมจำลอง (ตรงกับที่แอดมินสร้าง)
  const allowedLat = 14.9845;
  const allowedLon = 102.1124;
  const allowedRadius = 50; // รัศมี 50 เมตร

  useEffect(() => {
    // 1. ตรวจสอบว่าเบราว์เซอร์รองรับ Geolocation ไหม
    if (!navigator.geolocation) {
      setTimeout(() => {
        setGpsStatus('ERROR');
      }, 0);
      return;
    }

    // 2. ติดตามพิกัดของนักศึกษาแบบเรียลไทม์
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        // คำนวณระยะห่างด้วย Haversine Formula
        const currentDistance = calculateDistance(latitude, longitude, allowedLat, allowedLon);
        
        // ครอบด้วย setTimeout เพื่อป้องกันการเรนเดอร์ซ้ำซ้อนแบบซิงโครนัส
        setTimeout(() => {
          setDistance(currentDistance);
          setGpsStatus('SUCCESS');
        }, 0);
      },
      (error) => {
        console.error(error);
        setTimeout(() => {
          setGpsStatus('ERROR');
        }, 0);
      },
      { enableHighAccuracy: true } // บังคับใช้ GPS ความแม่นยำสูง
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // เช็คว่าเด็กอยู่นอกพื้นที่ห้ามส่งงานไหม
  const isOutOfRadius = distance === null || distance > allowedRadius;

  const handleCapture = (photoData: string) => {
    if (!studentId || !studentName) {
      alert('กรุณากรอกรหัสนักศึกษาและชื่อ-นามสกุลก่อนเช็คชื่อครับ');
      return;
    }

    // 📥 บันทึกหลักฐานเช็คชื่อลงฐานข้อมูลจำลองเครื่องกลาง
    const newCheckIn: SavedCheckIn = {
      id: 'REC-' + Math.floor(1000 + Math.random() * 9000),
      activityId: activityCode,
      studentId: studentId,
      studentName: studentName,
      timestamp: new Date().toLocaleTimeString('th-TH') + ' น.',
      photoUrl: photoData, // แนบรูปถ่าย Base64 
      distance: distance || 0,
      status: 'PENDING' // สแตนด์บายรอแอดมินกดอนุมัติ
    };

    // ดึงของเก่าออกมารวมร่างกับของใหม่
    const existingCheckIns = JSON.parse(localStorage.getItem('global_checkins') || '[]');
    
    // 🟢 แก้ไขจุดนี้: เปลี่ยนจาก (c: any) เป็น (c: SavedCheckIn) เพื่อปิดเออร์เรอร์ TypeScript
    const filtered = existingCheckIns.filter((c: SavedCheckIn) => !(c.studentId === studentId && c.activityId === activityCode));
    localStorage.setItem('global_checkins', JSON.stringify([...filtered, newCheckIn]));

    setIsSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between max-w-md mx-auto p-4 shadow-2xl bg-white">
      {/* ส่วนหัวของแอปฟิลมือถือ */}
      <div className="border-b pb-4 mb-4">
        <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded-full uppercase">
          รหัสกิจกรรม: {activityCode}
        </span>
        <h1 className="text-xl font-black text-gray-900 mt-2">📍 ระบบเช็คชื่อเข้ากิจกรรม</h1>
      </div>

      {!isSuccess ? (
        <div className="space-y-4 flex-1">
          {/* ฟอร์มกรอกชื่อเด็ก */}
          <div className="space-y-3 bg-gray-50 p-4 rounded-xl border">
            <input
              type="text"
              required
              placeholder="รหัสนักศึกษา (เช่น 66012345)"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-sm text-gray-900 outline-none focus:border-blue-500"
            />
            <input
              type="text"
              required
              placeholder="ชื่อ - นามสกุล"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-sm text-gray-900 outline-none focus:border-blue-500"
            />
          </div>

          {/* ป้ายโชว์สถานะพิกัดความปลอดภัย */}
          <div className="space-y-2">
            {gpsStatus === 'LOADING' && (
              <div className="bg-yellow-50 text-yellow-700 p-3 rounded-xl text-xs font-semibold animate-pulse">🛰️ กำลังค้นหาสัญญาณพิกัด GPS ของคุณ...</div>
            )}
            {gpsStatus === 'ERROR' && (
              <div className="bg-red-100 text-red-700 p-3 rounded-xl text-xs font-bold">❌ ดึงพิกัดล้มเหลว! กรุณาเปิด GPS และอนุญาตสิทธิ์ระบุตำแหน่งบนเว็บ</div>
            )}
            {gpsStatus === 'SUCCESS' && (
              <div className={`p-3 rounded-xl text-xs font-bold flex justify-between items-center ${isOutOfRadius ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                <span>{isOutOfRadius ? '🚨 อยู่นอกรัศมีกิจกรรม!' : '🟢 ยืนยันตำแหน่งสำเร็จ (อยู่ในรัศมี)'}</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded shadow-sm">ห่าง {distance} ม.</span>
              </div>
            )}
          </div>

          {/* คอมโพเนนต์กล้องสตรีมสด */}
          <CameraFeed onCapture={handleCapture} isDisabled={gpsStatus !== 'SUCCESS' || isOutOfRadius || !studentId || !studentName} />
        </div>
      ) : (
        /* เมื่อกดเช็คชื่อเสร็จสมบูรณ์ */
        <div className="text-center py-12 space-y-4 flex-1 flex flex-col justify-center items-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl animate-bounce">✓</div>
          <h2 className="text-2xl font-black text-gray-800">เช็คชื่อสำเร็จ!</h2>
          <p className="text-gray-500 text-sm max-w-xs">ระบบได้ทำการบันทึกภาพถ่ายใบหน้าและพิกัด GPS เพื่อส่งให้อาจารย์ผู้ตรวจเรียบร้อยแล้วครับ</p>
        </div>
      )}

      <Link 
        href="/student/activities"
        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow transition text-center block mt-4"
      >
        ⬅️ กลับไปดูสถานะที่หน้ารวมกิจกรรม
      </Link>
    </div>
  );
}