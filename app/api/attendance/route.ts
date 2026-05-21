import { NextResponse } from "next/server";
import { kv } from "@vercel/kv"; // 🚀 ใช้ตัวแปร kv ควบคุมฐานข้อมูลออนไลน์แทนระบบไฟล์จำลอง

// 🚀 [API สำหรับบันทึกเวลา - POST]
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userCode, type, latitude, longitude, status } = body;

    // 1. ดึงก้อนข้อมูล JSON ทั้งหมดที่เก็บบน Vercel คลาวด์ขึ้นมา (หากเพิ่งเริ่มและยังไม่มีข้อมูล ให้เริ่มด้วย object เปล่า)
    let db: any = await kv.get("attendance_db");
    if (!db) {
      db = { users: [], logs: [] };
    }

    // 2. จัดการตารางข้อมูลผู้ใช้งาน (Users)
    let user = db.users.find((u: any) => u.userCode === userCode);
    if (!user) {
      user = {
        id: db.users.length + 1,
        userCode: userCode,
        name: "ผู้ทดสอบระบบสมาร์ท",
        role: "STAFF",
      };
      db.users.push(user);
    }

    // 3. จัดการตารางประวัติการลงเวลา (Attendance Logs)
    const newLog = {
      id: db.logs.length + 1,
      userId: user.id,
      userCode: user.userCode,
      type: type,
      timestamp: new Date().toISOString(),
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      status: status,
    };
    db.logs.push(newLog);

    // 4. สั่งบันทึกก้อนข้อมูล JSON ทั้งหมดนี้กลับไปเก็บบนระบบคลาวด์ถาวร
    await kv.set("attendance_db", db);

    return NextResponse.json({ success: true, data: newLog }, { status: 200 });
  } catch (error) {
    console.error("Vercel KV Database Error:", error);
    return NextResponse.json({ success: false, error: "บันทึกข้อมูลลงคลาวด์ล้มเหลว" }, { status: 500 });
  }
}

// 🚀 [API สำหรับดึงประวัติมาโชว์บนหน้าตาราง - GET]
export async function GET() {
  try {
    // ดึงก้อนข้อมูลจากระบบคลาวด์มาแกะเอาเฉพาะตารางประวัติ (logs) ส่งไปโชว์หน้าบ้าน
    const db: any = await kv.get("attendance_db");
    const logs = db?.logs || [];
    
    return NextResponse.json({ success: true, data: logs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}