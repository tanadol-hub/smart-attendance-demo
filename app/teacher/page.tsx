"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AttendanceLog {
  id: number;
  userCode: string;
  type: "IN" | "OUT";
  timestamp: string;
  latitude: number;
  longitude: number;
  status: string;
  imageUrl?: string; // รองรับลิงก์รูปภาพที่เราเก็บเข้าคลาวด์
}

export default function TeacherDashboard() {
  const [historyLogs, setHistoryLogs] = useState<AttendanceLog[]>([]);
  const [teacherCode, setTeacherCode] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null); // สำหรับกดดูรูปใหญ่
  const router = useRouter();

  // 1. ตรวจสอบสิทธิ์ตอนเข้าหน้าเว็บ
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const code = localStorage.getItem("userCode");
    
    if (role !== "TEACHER") {
      alert("คุณไม่มีสิทธิ์เข้าใช้งานหน้านี้!");
      router.push("/"); // ไล่กลับไปหน้าล็อกอิน
      return;
    }
    if (code) setTeacherCode(code);

    fetchTeacherData();
  }, []);

  // 2. ฟังก์ชันดึงประวัติการลงเวลาทั้งหมดจาก API หลังบ้าน
  const fetchTeacherData = async () => {
    try {
      const response = await fetch("/api/attendance");
      const result = await response.json();
      if (result.success) {
        // เรียงลำดับเอาข้อมูลล่าสุดขึ้นก่อน
        setHistoryLogs(result.data.reverse());
      }
    } catch (err) {
      console.error("ดึงข้อมูลล้มเหลว", err);
    }
  };

  // 3. ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif", maxWidth: "1200px", margin: "auto" }}>
      {/* ส่วนหัวหน้าเว็บ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "2px solid #eee", paddingBottom: "10px" }}>
        <div>
          <h2>ระบบจัดการสำหรับอาจารย์ (Dashboard)</h2>
          <p style={{ color: "#555" }}>ยินดีต้อนรับอาจารย์รหัส: <strong>{teacherCode}</strong></p>
        </div>
        <button 
          onClick={handleLogout}
          style={{ padding: "10px 15px", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
        >
          ออกจากระบบ
        </button>
      </div>

      {/* ตารางรายงานสรุป */}
      <div style={{ marginTop: "30px" }}>
        <h3>📊 รายงานการเข้าเรียน / ลงเวลาของนักศึกษา</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #ccc" }}>
              <th style={{ padding: "12px" }}>ID</th>
              <th style={{ padding: "12px" }}>รหัสนักศึกษา</th>
              <th style={{ padding: "12px" }}>ประเภท</th>
              <th style={{ padding: "12px" }}>เวลาบันทึก</th>
              <th style={{ padding: "12px" }}>พิกัด (Lat, Lon)</th>
              <th style={{ padding: "12px" }}>สถานะ</th>
              <th style={{ padding: "12px", textAlign: "center" }}>หลักฐานใบหน้า</th>
            </tr>
          </thead>
          <tbody>
            {historyLogs.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "20px", textAlign: "center", color: "#999" }}>ยังไม่มีข้อมูลการลงเวลาในระบบ</td>
              </tr>
            ) : (
              historyLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "12px" }}>{log.id}</td>
                  <td style={{ padding: "12px" }}><strong>{log.userCode}</strong></td>
                  <td style={{ padding: "12px" }}>
                    <span style={{ padding: "4px 8px", borderRadius: "4px", backgroundColor: log.type === "IN" ? "#e6f4ea" : "#fce8e6", color: log.type === "IN" ? "#137333" : "#c5221f", fontWeight: "bold" }}>
                      {log.type === "IN" ? "เข้าเรียน" : "เลิกเรียน"}
                    </span>
                  </td>
                  <td style={{ padding: "12px" }}>{new Date(log.timestamp).toLocaleString("th-TH")}</td>
                  <td style={{ padding: "12px", fontSize: "14px", color: "#555" }}>
                    {log.latitude.toFixed(4)}, {log.longitude.toFixed(4)}
                  </td>
                  <td style={{ padding: "12px", color: log.status.includes("สาย") ? "orange" : "green" }}>{log.status}</td>
                  <td style={{ padding: "12px", textAlign: "center" }}>
                    {log.imageUrl ? (
                      <button
                        onClick={() => setSelectedImage(log.imageUrl || null)}
                        style={{ padding: "6px 12px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer", fontSize: "13px" }}
                      >
                        👁️ เปิดดูรูปถ่าย
                      </button>
                    ) : (
                      <span style={{ color: "#999", fontSize: "13px" }}>ไม่มีรูปถ่าย</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 🖼️ กล่อง Pop-up ขยายดูรูปถ่ายหน้าตรงของนักศึกษา */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}
        >
          <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", position: "relative", textAlign: "center" }}>
            <p style={{ fontWeight: "bold", marginBottom: "10px" }}>📸 รูปถ่ายยืนยันตัวตนของนักศึกษา</p>
            <img src={selectedImage} alt="Student" style={{ maxWidth: "450px", maxHeight: "400px", borderRadius: "8px", display: "block" }} />
            <button 
              onClick={() => setSelectedImage(null)}
              style={{ marginTop: "15px", padding: "8px 20px", backgroundColor: "#333", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}