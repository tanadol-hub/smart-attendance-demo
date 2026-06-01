// types/index.ts

// 1. โครงสร้างข้อมูลของ "กิจกรรม" (Activity)
export interface Activity {
  id: string;               // รหัสกิจกรรม (เช่น ACT-9981)
  name: string;             // ชื่อกิจกรรม
  latitude: number;         // พิกัดศูนย์กลาง (ละติจูด)
  longitude: number;        // พิกัดศูนย์กลาง (ลองจิจูด)
  radius: number;           // รัศมีที่อนุญาตให้เช็คชื่อ (เมตร)
  isActive: boolean;        // สถานะเปิด/ปิดรับเช็คชื่อ
  createdAt: string;        // เวลาที่สร้างกิจกรรม
}

// 2. โครงสร้างข้อมูลของ "การเช็คชื่อของนักศึกษา" (CheckInRecord)
export interface CheckInRecord {
  id: string;               // รหัสการเช็คชื่อ (UUID)
  activityId: string;       // เช็คชื่อในกิจกรรมไหน
  studentId: string;        // รหัสนักศึกษา (เช่น 66012345)
  studentName: string;      // ชื่อ-นามสกุล
  timestamp: string;        // เวลาที่กดเช็คชื่อ
  photoUrl: string;         // ลิงก์รูปภาพหลักฐานจาก Vercel Blob
  distance: number;         // ระยะห่างจากจุดศูนย์กลาง (เมตร)
  isValidLocation: boolean; // อยู่ในรัศมีหรือไม่ (true/false)
  status: 'PENDING' | 'APPROVED' | 'REJECTED'; // สถานะการยืนยันจากอาจารย์
}