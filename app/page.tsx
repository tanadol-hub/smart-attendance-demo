"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";

// 🚀 1. สร้าง Interface กำหนดชนิดข้อมูลให้ชัดเจน เพื่อแก้ปัญหาตระกูล "any"
interface AttendanceLog {
  id: number;
  userId: number;
  userCode: string;
  type: "IN" | "OUT";
  timestamp: string;
  latitude: number;
  longitude: number;
  status: string;
}

export default function AttendancePage() {
  const [checkInTime, setCheckInTime] = useState<string>("-");
  const [checkOutTime, setCheckOutTime] = useState<string>("-");
  const [locationText, setLocationText] = useState<string>("ยังไม่ได้ดึงพิกัด");
  const [cameraStatus, setCameraStatus] = useState<string>("ยังไม่ได้เปิดกล้อง");
  const [locationStatus, setLocationStatus] = useState<string>("ยังไม่ได้ตรวจสอบ");
  const [attendanceStatus, setAttendanceStatus] = useState<string>("-");
  
  // 🚀 แก้ไขจุดที่ 1: เปลี่ยนจาก any[] มาใช้ Interface ที่เราสร้างไว้ด้านบน
  const [historyLogs, setHistoryLogs] = useState<AttendanceLog[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // 🚀 แก้ไขจุดที่ 2: ใช้ useCallback ครอบฟังก์ชันดึงข้อมูล เพื่อสร้างความเสถียรและเคลียร์ Error ใน useEffect
  const fetchHistory = useCallback(async () => {
    try {
      const response = await fetch("/api/attendance");
      const result = await response.json();
      if (result.success) {
        setHistoryLogs(result.data.reverse()); // โชว์อันล่าสุดขึ้นก่อน
      }
    } catch (err) {
      console.error("โหลดประวัติล้มเหลว", err);
    }
  }, []); // ใส่ array ว่างตรงนี้ หมายถึงให้สร้างฟังก์ชันนี้แค่ครั้งแรกที่เปิดแอป

  // เรียกใช้เมื่อเปิดหน้าเว็บครั้งแรก โดยส่ง fetchHistory เข้าไปเป็น dependency ให้ถูกต้องตามกฎ React
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const startCamera = async () => {
    try {
      setCameraStatus("กำลังเปิดกล้อง...");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraStatus("เปิดกล้องสำเร็จ");
      }
    } catch (error) {
      setCameraStatus("เปิดกล้องล้มเหลว");
      alert("กรุณาอนุญาตให้เข้าถึงกล้อง");
    }
  };

  const handleRecordTime = async (type: "IN" | "OUT") => {
    const now = new Date();
    const timeString = now.toLocaleTimeString("th-TH") + " น.";

    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const totalMinutes = (currentHour * 60) + currentMinute;

    const limitStartLate = (8 * 60) + 31;  
    const limitHalfDay = (9 * 60) + 30;   
    const limitFullDay = (13 * 60) + 1;   

    let calculatedStatus = "เข้างานปกติ 🎉";
    if (type === "IN") {
      if (totalMinutes < limitStartLate) calculatedStatus = "เข้างานปกติ 🎉";
      else if (totalMinutes >= limitStartLate && totalMinutes <= limitHalfDay) calculatedStatus = "เข้างานสาย ⚠️";
      else if (totalMinutes > limitHalfDay && totalMinutes <= limitFullDay) calculatedStatus = "ลางานครึ่งวัน 📝";
      else calculatedStatus = "ลางานเต็มวัน ❌";
      setCheckInTime(timeString);
    } else {
      calculatedStatus = "ลงเวลาออกงาน";
      setCheckOutTime(timeString);
    }

    setAttendanceStatus(calculatedStatus);
    setLocationStatus("กำลังตรวจสอบตำแหน่ง...");

    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      setLocationText(`Lat: ${lat.toFixed(6)}, Lon: ${lon.toFixed(6)}`);
      setLocationStatus("ตรวจสอบพิกัดสำเร็จ");

      try {
        const response = await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userCode: "B6900001", 
            type: type,
            latitude: lat,
            longitude: lon,
            status: calculatedStatus,
          }),
        });
        
        const result = await response.json();
        if (result.success) {
          alert(`📥 บันทึกลงฐานข้อมูลไฟล์สำเร็จ!`);
          fetchHistory(); // เรียกอัปเดตตารางใหม่หลังจากกดบันทึกสำเร็จ
        }
      } catch (err) {
        console.error("Save failed", err);
      }
    }, () => {
      setLocationStatus("ดึงพิกัดล้มเหลว");
      alert("โปรดเปิดสิทธิ์ GPS");
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans pb-10">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-50 shadow-sm">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-sm font-semibold text-gray-700">ระบบลงเวลาเดโม - มทร.อีสาน</h1>
          <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">U</div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-4 flex flex-col gap-4">
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
          <h2 className="text-lg font-bold text-slate-700">ลงเวลาปฏิบัติงาน</h2>
          <div className="mt-3 flex flex-col gap-2 text-xs text-left">
            <div className="p-2 bg-slate-50 rounded-lg flex justify-between">
              <span>สถานะกล้อง:</span> <span className="font-semibold text-orange-600">{cameraStatus}</span>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg flex justify-between">
              <span>สถานะพิกัด:</span> <span className="font-semibold text-orange-600">{locationStatus}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
          <div className="w-full aspect-[4/5] bg-black rounded-xl overflow-hidden relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
            {cameraStatus !== "เปิดกล้องสำเร็จ" && (
              <span className="text-gray-400 text-xs absolute inset-0 flex items-center justify-center bg-black/90">กรุณากดเปิดกล้องก่อนลงเวลา</span>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2">
          <button onClick={startCamera} className="w-full bg-cyan-500 text-white font-semibold py-2.5 rounded-xl text-sm shadow-sm">เปิดกล้อง</button>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={() => handleRecordTime("IN")} className="bg-emerald-500 text-white font-semibold py-3 rounded-xl text-sm shadow-sm">ลงเวลาเข้างาน</button>
            <button onClick={() => handleRecordTime("OUT")} className="bg-rose-500 text-white font-semibold py-3 rounded-xl text-sm shadow-sm">ลงเวลาออกงาน</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-white p-3 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-400">เข้างาน</p>
            <p className="text-base font-bold text-emerald-600">{checkInTime}</p>
          </div>
          <div className="bg-white p-3 rounded-xl border border-gray-100">
            <p className="text-xs text-gray-400">ออกงาน</p>
            <p className="text-base font-bold text-rose-600">{checkOutTime}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-xs space-y-1 text-gray-600">
          <p><span className="font-bold">พิกัดปัจจุบัน:</span> {locationText}</p>
          <p><span className="font-bold">คำนวณสถานะ:</span> <span className="text-blue-600 font-bold">{attendanceStatus}</span></p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex justify-between items-center">
            <span>📊 ตารางฐานข้อมูลประวัติจริง</span>
            <span className="text-xs font-normal text-gray-400">(ข้อมูลไม่หายเมื่อรีเฟรช)</span>
          </h3>
          <div className="overflow-x-auto max-h-60 text-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500">
                  <th className="p-2">ID</th>
                  <th className="p-2">ประเภท</th>
                  <th className="p-2">สถานะ</th>
                  <th className="p-2">พิกัด (Lat, Lon)</th>
                </tr>
              </thead>
              <tbody>
                {historyLogs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-400">ยังไม่มีข้อมูลบันทึกในฐานข้อมูล</td>
                  </tr>
                ) : (
                  historyLogs.map((log) => (
                    <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-2 font-semibold text-gray-700">{log.id}</td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.type === "IN" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                          {log.type === "IN" ? "เข้า" : "ออก"}
                        </span>
                      </td>
                      <td className="p-2 text-gray-600">{log.status}</td>
                      <td className="p-2 text-gray-400 font-mono text-[10px]">{log.latitude.toFixed(4)}, {log.longitude.toFixed(4)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}