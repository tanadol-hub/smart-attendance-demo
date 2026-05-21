import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// กำหนดตำแหน่งเซฟไฟล์ฐานข้อมูล JSON
const dbPath = path.join(process.cwd(), "attendance_db.json");

// ฟังก์ชันช่วยอ่านข้อมูลจากไฟล์
const readDatabase = () => {
  if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], logs: [] }, null, 2), "utf-8");
  }
  const fileData = fs.readFileSync(dbPath, "utf-8");
  return JSON.parse(fileData);
};

// ฟังก์ชันช่วยเขียนข้อมูลลงไฟล์
const writeDatabase = (data: any) => {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
};

// 🚀 [บังคับ] ต้องใช้ชื่อฟังก์ชัน POST เป็นตัวพิมพ์ใหญ่ และไม่มี export default
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userCode, type, latitude, longitude, status } = body;

    const db = readDatabase();

    // 1. จัดการตารางข้อมูลผู้ใช้งาน (Users)
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

    // 2. จัดการตารางประวัติการลงเวลา (Attendance Logs)
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

    writeDatabase(db);

    return NextResponse.json({ success: true, data: newLog }, { status: 200 });
  } catch (error) {
    console.error("File DB Error:", error);
    return NextResponse.json({ success: false, error: "บันทึกข้อมูลล้มเหลว" }, { status: 500 });
  }
}

// 🚀 [บังคับ] ต้องใช้ชื่อฟังก์ชัน GET เป็นตัวพิมพ์ใหญ่ และไม่มี export default
export async function GET() {
  try {
    const db = readDatabase();
    return NextResponse.json({ success: true, data: db.logs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 });
  }
}