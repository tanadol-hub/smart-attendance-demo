// components/student/CameraFeed.tsx
'use client';

import React, { useRef, useState, useEffect } from 'react';

interface CameraFeedProps {
  onCapture: (photoBase64: string) => void;
  isDisabled: boolean;
}

export default function CameraFeed({ onCapture, isDisabled }: CameraFeedProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // เปิดกล้องเมื่อคอมโพเนนต์โหลด
  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' }, // บังคับใช้กล้องหน้า
          audio: false,
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError('ไม่สามารถเข้าถึงกล้องได้ กรุณาอนุญาตสิทธิ์การใช้งานกล้อง');
        console.error(err);
      }
    }

    startCamera();

    // ปิดกล้องเมื่อออกจากหน้าจอ
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // ฟังก์ชันสแนปภาพถ่าย
  const takeSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        // วาดภาพจากวิดีโอลงแคนวาส
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg');
        setPreview(imageData);
        onCapture(imageData); // ส่งรูปภาพกลับไปที่หน้าหลัก
      }
    }
  };

  const resetCamera = () => {
    setPreview(null);
  };

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center text-sm font-medium">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-[3/4] w-full bg-gray-900 rounded-2xl overflow-hidden shadow-inner border-2 border-gray-800">
        {/* ซ่อนแคนวาสไว้สำหรับประมวลผลเงียบๆ */}
        <canvas ref={canvasRef} className="hidden" />

        {!preview ? (
          /* หน้าจอ Live กล้องสด */
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover scale-x-[-1]" // กลับด้านภาพให้เหมือนกระจกเงา
            />
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full"></span> LIVE CAMERA
            </div>
          </>
        ) : (
          /* หน้าจอ Preview หลังสแนปภาพ */
          <img src={preview} alt="Preview" className="w-full h-full object-cover scale-x-[-1]" />
        )}
      </div>

      {/* ปุ่มกดถ่ายภาพ */}
      {!preview ? (
        <button
          onClick={takeSnapshot}
          disabled={isDisabled}
          className={`w-full font-bold py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition duration-200 shadow-lg ${
            isDisabled
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
              : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
          }`}
        >
          📸 {isDisabled ? 'โปรดรอการตรวจสอบ GPS' : 'แชะ! ถ่ายรูปและเช็คชื่อ'}
        </button>
      ) : (
        <button
          onClick={resetCamera}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition"
        >
          🔄 ถ่ายใหม่
        </button>
      )}
    </div>
  );
}