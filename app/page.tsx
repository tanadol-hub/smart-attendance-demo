"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [userCode, setUserCode] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!userCode.trim()) {
      alert("กรุณากรอกรหัสผู้ใช้งาน");
      return;
    }

    // 🕵️‍♂️ เช็คสิทธิ์และเด้งหน้าตามเงื่อนไขรหัสตัวแรก
    if (userCode.startsWith("TCH")) {
      // เซฟรหัสอาจารย์ลงเครื่องเผื่อใช้ต่อ และเด้งไปแดชบอร์ดอาจารย์
      localStorage.setItem("userRole", "TEACHER");
      localStorage.setItem("userCode", userCode);
      router.push("/teacher");
    } else if (userCode.startsWith("STD")) {
      // เซฟรหัสนักศึกษาลงเครื่อง และเด้งไปหน้าลงเวลาสแกนกล้อง
      localStorage.setItem("userRole", "STUDENT");
      localStorage.setItem("userCode", userCode);
      router.push("/student");
    } else {
      alert("ไม่พบรหัสผู้ใช้งานนี้ในระบบ! (คำแนะนำ: นักศึกษาใช้ STD..., อาจารย์ใช้ TCH...)");
    }
  };

  return (
    <div style={{ padding: "50px", textAlign: "center", maxWidth: "400px", margin: "auto" }}>
      <h2>ระบบลงเวลาอัจฉริยะ มทร.อีสาน</h2>
      <p style={{ color: "#666" }}>เข้าสู่ระบบด้วยรหัสประจำตัวของคุณ</p>
      
      <form onSubmit={handleLogin} style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="กรอกรหัส (เช่น STD66001 หรือ TCH01)"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value.toUpperCase())}
          style={{ width: "100%", padding: "12px", marginBottom: "15px", borderRadius: "8px", border: "1px solid #ccc" }}
        />
        <button
          type="submit"
          style={{ width: "100%", padding: "12px", backgroundColor: "#0070f3", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold" }}
        >
          เข้าสู่ระบบ
        </button>
      </form>
    </div>
  );
}