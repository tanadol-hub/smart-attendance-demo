// lib/geofence.ts

/**
 * คำนวณระยะห่างระหว่างจุด 2 จุด (หน่วยเป็นเมตร) ด้วย Haversine Formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // รัศมีของโลก (เมตร)
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c; // ระยะทางที่ได้ (เมตร)
  return Math.round(distance * 100) / 100; // ปัดเศษทศนิยม 2 ตำแหน่ง
}

/**
 * ตรวจสอบว่าพิกัดนักศึกษาอยู่ในรัศมีที่กำหนดหรือไม่
 */
export function isWithinRadius(
  studentLat: number,
  studentLon: number,
  centerLat: number,
  centerLon: number,
  radiusInMeters: number
): boolean {
  const distance = calculateDistance(studentLat, studentLon, centerLat, centerLon);
  return distance <= radiusInMeters;
}