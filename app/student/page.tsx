"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface AttendanceLog {
  id: number;
  userCode: string;
  type: "IN" | "OUT";
  timestamp: string;
  latitude: number;
  longitude: number;
  status: string;
}

export default function StudentPage() {
  const [userCode, setUserCode] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState("กำลังตรวจสอบพิกัด GPS...");
  const [myHistory, setMyHistory] = useState<AttendanceLog[]>([]);
  const [loading, setLoading] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  // 1. ตรวจสอบสิทธิ์การเข้าใช้งาน และเริ่มเปิดกล้อง + หาพิกัด
  useEffect(() => {
    const savedRole = localStorage.getItem("userRole");
    const savedCode = localStorage.getItem("userCode");

    // ถ้าไม่ใช่สิทธิ์นักศึกษา หรือไม่มีรหัส ให้เตะกลับไปหน้าล็อกอิน
    if (savedRole !== "STUDENT" || !savedCode) {
      alert("กรุณาเข้าสู่ระบบก่อนใช้งานครับ");
      router.push("/");
      return;
    }

    setUserCode(savedCode);
    startCamera();
    getLocation();
    fetchMyHistory(savedCode);

    // ปิดกล้องเมื่อออกจากหน้านี้
    return () => {
      stopCamera();
    };
  }, []);

  // 2. ฟังก์ชันเปิดกล้องวิดีโอ
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" }, // ใช้กล้องหน้า
        audio: false
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("ไม่สามารถเข้าถึงกล้องได้:", err);
      alert("กรุณาอนุญาตให้ระบบเข้าถึงกล้องถ่ายรูป");
    }
  };

  // ฟังก์ชันปิดกล้อง
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  // 3. ฟังก์ชันดึงพิกัด GPS
  const getLocation = () => {
    if (!navigator.geolocation) {
      setStatusMessage("เบราว์เซอร์ของคุณไม่รองรับ GPS");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setStatusMessage("จับพิกัด GPS สำเร็จ พร้อมลงเวลา");
      },
      (error) => {
        console.error("GPS Error:", error);
        setStatusMessage("ไม่สามารถดึงพิกัดได้ กรุณาเปิด Location บนมือถือ");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // 4. ฟังก์ชันดึงประวัติเฉพาะของตัวเองมาแสดงในตาราง
  const fetchMyHistory = async (code: string) => {
    try {
      const response = await fetch("/api/attendance");
      const result = await response.json();
      if (result.success) {
        // กรองเอาเฉพาะข้อมูลที่เป็นของรหัสนักศึกษาคนนี้ และเรียงจากใหม่ไปเก่า
        const filtered = result.data.filter((log: AttendanceLog) => log.userCode === code);
        setMyHistory(filtered.reverse());
      }
    } catch (err) {
      console.error("ดึงข้อมูลประวัติล้มเหลว", err);
    }
  };

  // 5. ฟังก์ชันกดบันทึกเวลา (แอบจับภาพอัตโนมัติ + ส่งค่าพิกัด)
  const handleRecordTime = async (type: "IN" | "OUT") => {
    if (lat === null || lng === null) {
      alert("ไม่สามารถบันทึกเวลาได้ เนื่องจากยังไม่มีพิกัด GPS กรุณารอสักครู่หรือรีเฟรชหน้าจอ");
      return;
    }

    setLoading(true);
    let capturedImageBase64 = "";

    // 📸 สั่ง Snap ภาพนิ่งจากหน้าจอ Video สดๆ ณ วินาทีนั้น
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        capturedImageBase64 = canvas.toDataURL("image/jpeg");
      }
    }

    try {
      // ส่งข้อมูลเข้าเซิร์ฟเวอร์หลังบ้าน
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userCode: userCode,
          type: type,
          latitude: lat,
          longitude: lng,
          status: "เช็คชื่อผ่านอุปกรณ์เคลื่อนที่",
          image: capturedImageBase64 // ส่งภาพ Base64 ไปให้หลังบ้านโยนขึ้น Blob คลาวด์
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`บันทึกเวลา${type === "IN" ? "เข้าเรียน" : "เลิกเรียน"} สำเร็จ พร้อมเก็บหลักฐานใบหน้าแล้ว!`);
        fetchMyHistory(userCode); // รีเฟรชตารางประวัติด้านล่าง
      } else {
        alert(`เกิดข้อผิดพลาด: ${result.error}`);
      }
    } catch (error) {
      console.error("Submit Error:", error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    stopCamera();
    localStorage.clear();
    router.push("/");
  };

  return (
    <div style={{ padding: "15px", fontFamily: "sans-serif", maxWidth: "600px", margin: "auto", paddingBottom: "40px" }}>
      {/* ส่วนหัวหน้าจอ */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
        <div>
          <h3 style={{ margin: 0, color: "#333" }}>ระบบเช็คชื่อนักศึกษา</h3>
          <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#666" }}>สวัสดี: <strong>{userCode}</strong></p>
        </div>
        <button 
          onClick={handleLogout} 
          style={{ padding: "6px 12px", backgroundColor: "#ff4d4d", color: "white", border: "none", borderRadius: "6px", fontSize: "13px", cursor: "pointer" }}
        >
          ออกจากระบบ
        </button>
      </div>

      {/* หน้าจอกล้องส่องหน้าตรง */}
      <div style={{ position: "relative", width: "100%", backgroundColor: "#000", borderRadius: "12px", overflow: "hidden", aspectRatio: "4/3", marginBottom: "15px", boxShadow: "0 4px 10px rgba(0,0,0,0.15)" }}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", top: "10px", left: "10px", backgroundColor: "rgba(0,0,0,0.6)", color: "#fff", padding: "4px 10px", borderRadius: "20px", fontSize: "12px" }}>
          📷 กล้องกำลังทำงาน
        </div>
      </div>

      {/* บล็อกแสดงสถานะพิกัด GPS */}
      <div style={{ backgroundColor: "#f9f9f9", padding: "12px", borderRadius: "8px", border: "1px solid #eee", marginBottom: "20px", fontSize: "13px" }}>
        <div style={{ fontWeight: "bold", color: lat ? "green" : "orange", marginBottom: "4px" }}>
          📍 {statusMessage}
        </div>
        {lat && lng && (
          <div style={{ color: "#666" }}>
            พิกัดปัจจุบัน: {lat.toFixed(6)}, {lng.toFixed(6)}
          </div>
        )}
      </div>

      {/* ปุ่มกดลงเวลาขนาดใหญ่ เหมาะกับนิ้วมือบนสมาร์ทโฟน */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "30px" }}>
        <button
          onClick={() => handleRecordTime("IN")}
          disabled={loading || !lat}
          style={{ padding: "18px", backgroundColor: loading || !lat ? "#ccc" : "#28a745", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 6px rgba(40,167,69,0.2)" }}
        >
          {loading ? "กำลังบันทึก..." : "📥 เช็คชื่อเข้าเรียน"}
        </button>
        <button
          onClick={() => handleRecordTime("OUT")}
          disabled={loading || !lat}
          style={{ padding: "18px", backgroundColor: loading || !lat ? "#ccc" : "#dc3545", color: "white", border: "none", borderRadius: "10px", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0 4px 6px rgba(220,53,69,0.2)" }}
        >
          {loading ? "กำลังบันทึก..." : "📤 เช็คชื่อเลิกเรียน"}
        </button>
      </div>

      {/* ตารางประวัติส่วนตัวย้อนหลังของนักศึกษาคนนี้ */}
      <div>
        <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>🕒 ประวัติการเช็คชื่อของคุณ</h4>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #ddd" }}>
                <th style={{ padding: "8px" }}>เวลา</th>
                <th style={{ padding: "8px" }}>ประเภท</th>
                <th style={{ padding: "8px" }}>สถานะ</th>
              </tr>
            </thead>
            <tbody>
              {myHistory.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: "15px", textAlign: "center", color: "#999" }}>ยังไม่มีประวัติการเช็คชื่อ</td>
                </tr>
              ) : (
                myHistory.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "8px" }}>{new Date(log.timestamp).toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" })} น.</td>
                    <td style={{ padding: "8px" }}>
                      <span style={{ color: log.type === "IN" ? "green" : "red", fontWeight: "bold" }}>
                        {log.type === "IN" ? "เข้า" : "ออก"}
                      </span>
                    </td>
                    <td style={{ padding: "8px", color: "#666", fontSize: "12px" }}>สำเร็จ</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}