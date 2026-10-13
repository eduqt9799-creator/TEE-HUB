import React, { useState, useEffect, useRef } from 'react';
import { AngleImage } from '../../types';

interface Product360ViewerProps {
  frames: string[]; // 36 frames
  angleImages: AngleImage[];
  productName: string;
}

export const Product360Viewer: React.FC<Product360ViewerProps> = ({
  frames,
  angleImages,
  productName,
}) => {
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(11); // 0-indexed, default frame 12
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [activeViewMode, setActiveViewMode] = useState<'360' | 'front' | 'back' | 'profile' | 'detail'>('360');
  const [staticImageUrl, setStaticImageUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const spinTimerRef = useRef<NodeJS.Timeout | null>(null);

  const totalFrames = frames.length || 36;

  // Auto spin timer
  useEffect(() => {
    if (isAutoSpinning && activeViewMode === '360') {
      spinTimerRef.current = setInterval(() => {
        setCurrentFrameIndex((prev) => (prev + 1) % totalFrames);
      }, 95);
    } else {
      if (spinTimerRef.current) clearInterval(spinTimerRef.current);
    }

    return () => {
      if (spinTimerRef.current) clearInterval(spinTimerRef.current);
    };
  }, [isAutoSpinning, totalFrames, activeViewMode]);

  const stopAutoSpin = () => {
    setIsAutoSpinning(false);
  };

  const toggleAutoSpin = () => {
    if (activeViewMode !== '360') {
      setActiveViewMode('360');
      setStaticImageUrl(null);
    }
    setIsAutoSpinning((prev) => !prev);
  };

  // Mouse & Touch interaction handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (activeViewMode !== '360') return;
    setIsDragging(true);
    setStartX(e.clientX);
    stopAutoSpin();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || activeViewMode !== '360') return;
    const deltaX = e.clientX - startX;
    if (Math.abs(deltaX) > 10) {
      const step = deltaX > 0 ? 1 : -1;
      setCurrentFrameIndex((prev) => (prev + step + totalFrames) % totalFrames);
      setStartX(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (activeViewMode !== '360' || e.touches.length === 0) return;
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    stopAutoSpin();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || activeViewMode !== '360' || e.touches.length === 0) return;
    const deltaX = e.touches[0].clientX - startX;
    if (Math.abs(deltaX) > 10) {
      const step = deltaX > 0 ? 1 : -1;
      setCurrentFrameIndex((prev) => (prev + step + totalFrames) % totalFrames);
      setStartX(e.touches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      setZoomLevel((z) => Math.min(1.6, z + 0.08));
    } else {
      setZoomLevel((z) => Math.max(0.85, z - 0.08));
    }
  };

  const adjustZoom = (delta: number) => {
    setZoomLevel((z) => Math.min(Math.max(0.85, z + delta), 1.6));
  };

  // Switch thumbnail view
  const handleThumbSelect = (mode: '360' | 'front' | 'back' | 'profile' | 'detail') => {
    setActiveViewMode(mode);
    stopAutoSpin();
    setZoomLevel(1.0);

    if (mode === '360') {
      setStaticImageUrl(null);
    } else if (mode === 'front') {
      const img = angleImages.find((a) => a.angleName.toLowerCase().includes('front'))?.url || frames[0];
      setStaticImageUrl(img);
    } else if (mode === 'back') {
      const img = angleImages.find((a) => a.angleName.toLowerCase().includes('back'))?.url || frames[18] || frames[0];
      setStaticImageUrl(img);
    } else if (mode === 'profile') {
      const img = angleImages.find((a) => a.angleName.toLowerCase().includes('side'))?.url || frames[9] || frames[0];
      setStaticImageUrl(img);
    } else if (mode === 'detail') {
      const img = angleImages.find((a) => a.angleName.toLowerCase().includes('print') || a.angleName.toLowerCase().includes('macro'))?.url || frames[0];
      setStaticImageUrl(img);
    }
  };

  // Select angle from 8 angles gallery
  const handleAngleSelect = (angle: AngleImage, index: number) => {
    setActiveViewMode('360');
    setStaticImageUrl(null);
    stopAutoSpin();
    setZoomLevel(1.0);
    // map 8 angles to 36 frames
    const mappedFrame = Math.floor((index * totalFrames) / 8);
    setCurrentFrameIndex(mappedFrame);
  };

  // Micro tilt angle to give physical rotational feel
  const currentAngleDeg = (currentFrameIndex / totalFrames) * 360;
  const rotationalTilt = Math.sin((currentAngleDeg * Math.PI) / 180) * 3;

  const currentDisplayImage = staticImageUrl || frames[currentFrameIndex] || frames[0];

  return (
    <div className="flex flex-col gap-4 w-full select-none" ref={containerRef}>
      <div className="flex flex-col-reverse md:flex-row gap-4 w-full items-start">
        {/* Left Thumbnail Switcher Strip */}
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible shrink-0 pb-2 md:pb-0 w-full md:w-auto">
          <button
            type="button"
            onClick={() => handleThumbSelect('360')}
            className={`w-16 h-20 rounded flex flex-col items-center justify-center p-1 text-center transition-all cursor-pointer ${
              activeViewMode === '360'
                ? 'bg-[#111111] text-white shadow-md'
                : 'bg-[#f5f3f0] hover:bg-[#eae8e5] text-[#111111] border border-[#e5e0d8]'
            }`}
          >
            <span className="material-symbols-outlined text-[20px] mb-0.5">360</span>
            <span className="text-[9px] uppercase tracking-wider font-bold">360° View</span>
          </button>

          <button
            type="button"
            onClick={() => handleThumbSelect('front')}
            className={`w-16 h-20 rounded overflow-hidden transition-all cursor-pointer border ${
              activeViewMode === 'front'
                ? 'border-2 border-[#111111] shadow-md'
                : 'border-[#e5e0d8] hover:opacity-90 bg-[#f5f3f0]'
            }`}
          >
            <img
              src={angleImages[0]?.url || frames[0]}
              alt="Front"
              className="w-full h-full object-cover"
            />
          </button>

          <button
            type="button"
            onClick={() => handleThumbSelect('back')}
            className={`w-16 h-20 rounded overflow-hidden transition-all cursor-pointer border ${
              activeViewMode === 'back'
                ? 'border-2 border-[#111111] shadow-md'
                : 'border-[#e5e0d8] hover:opacity-90 bg-[#f5f3f0]'
            }`}
          >
            <img
              src={angleImages[2]?.url || frames[18] || frames[0]}
              alt="Back"
              className="w-full h-full object-cover"
            />
          </button>

          <button
            type="button"
            onClick={() => handleThumbSelect('profile')}
            className={`w-16 h-20 rounded overflow-hidden transition-all cursor-pointer border ${
              activeViewMode === 'profile'
                ? 'border-2 border-[#111111] shadow-md'
                : 'border-[#e5e0d8] hover:opacity-90 bg-[#f5f3f0]'
            }`}
          >
            <img
              src={angleImages[1]?.url || frames[9] || frames[0]}
              alt="Side Profile"
              className="w-full h-full object-cover"
            />
          </button>

          <button
            type="button"
            onClick={() => handleThumbSelect('detail')}
            className={`w-16 h-20 rounded overflow-hidden transition-all cursor-pointer border ${
              activeViewMode === 'detail'
                ? 'border-2 border-[#111111] shadow-md'
                : 'border-[#e5e0d8] hover:opacity-90 bg-[#f5f3f0]'
            }`}
          >
            <img
              src={angleImages[6]?.url || frames[0]}
              alt="Detail Print"
              className="w-full h-full object-cover"
            />
          </button>
        </div>

        {/* Main Interactive Stage */}
        <div
          className={`relative flex-1 bg-[#f5f3f0] rounded-xl overflow-hidden aspect-[4/5] flex items-center justify-center border border-[#e5e0d8] shadow-sm ${
            isFullscreen ? 'fixed inset-0 z-50 rounded-none w-screen h-screen' : ''
          }`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onWheel={handleWheel}
        >
          {/* Garment Image Container */}
          <div
            className={`relative w-full h-full flex items-center justify-center p-6 ${
              activeViewMode === '360' ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
            }`}
          >
            <img
              src={currentDisplayImage}
              alt={`${productName} 360 degree product view`}
              className="max-h-full max-w-full object-contain filter drop-shadow-xl transition-transform duration-100 ease-out pointer-events-none"
              style={{
                transform: `scale(${zoomLevel}) rotate(${activeViewMode === '360' ? rotationalTilt : 0}deg)`,
              }}
            />

            {/* 360 Rotation Pedestal Disk */}
            {activeViewMode === '360' && (
              <div className="absolute bottom-8 w-3/4 max-w-sm h-10 rounded-[50%] bg-[#e4e2df]/60 pointer-events-none flex items-center justify-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur text-[#111111] text-[10px] tracking-wider uppercase font-bold shadow-sm">
                  <span className="material-symbols-outlined text-[14px] text-[#58614e] animate-spin">
                    rotate_right
                  </span>
                  360° Studio Stage
                </span>
              </div>
            )}
          </div>

          {/* Top Right Guidance Tooltips */}
          <div className="absolute top-4 right-4 flex flex-col gap-1.5 pointer-events-none">
            {activeViewMode === '360' && (
              <>
                <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded text-[#111111] text-[10px] font-semibold shadow-sm">
                  <span className="material-symbols-outlined text-[15px]">touch_app</span>
                  <span>Drag to Rotate</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/85 backdrop-blur-md px-2.5 py-1 rounded text-[#111111] text-[10px] font-semibold shadow-sm">
                  <span className="material-symbols-outlined text-[15px]">pinch</span>
                  <span>Scroll to Zoom</span>
                </div>
              </>
            )}
            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="pointer-events-auto p-1.5 bg-white/85 backdrop-blur-md rounded text-[#111111] hover:bg-white transition-colors shadow-sm self-end"
              title="Toggle Fullscreen"
            >
              <span className="material-symbols-outlined text-[18px]">
                {isFullscreen ? 'fullscreen_exit' : 'fullscreen'}
              </span>
            </button>
          </div>

          {/* Bottom Control Bar: Auto Spin, Frame Counter, Zoom Steppers */}
          <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-auto">
            {activeViewMode === '360' ? (
              <button
                type="button"
                onClick={toggleAutoSpin}
                className="flex items-center gap-1.5 bg-[#111111] text-white hover:bg-[#262626] px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">
                  {isAutoSpinning ? 'pause' : 'play_arrow'}
                </span>
                <span>{isAutoSpinning ? 'Pause 360°' : 'Auto Spin 360°'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleThumbSelect('360')}
                className="flex items-center gap-1.5 bg-[#111111] text-white hover:bg-[#262626] px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
              >
                <span className="material-symbols-outlined text-[17px]">360</span>
                <span>Switch to 360°</span>
              </button>
            )}

            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm text-[10px] font-bold tracking-wider text-[#5f615e] uppercase">
              {activeViewMode === '360'
                ? `FRAME ${currentFrameIndex + 1} / ${totalFrames}`
                : `HD STATIC ANGLE`}
            </div>

            <div className="flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-full shadow-sm">
              <button
                type="button"
                onClick={() => adjustZoom(-0.15)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-[#111111] hover:bg-[#eae8e5] transition-colors"
                title="Zoom Out"
              >
                <span className="material-symbols-outlined text-[16px]">remove</span>
              </button>
              <button
                type="button"
                onClick={() => adjustZoom(0.15)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-[#111111] hover:bg-[#eae8e5] transition-colors"
                title="Zoom In"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Real Look — 8 Angles Interactive HD Strip */}
      <div className="bg-[#f5f3f0] p-4 rounded-xl border border-[#e5e0d8] mt-2">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-bold text-sm text-[#111111] tracking-tight">
            Real Look — 8 Angles
          </h3>
          <span className="text-[10px] uppercase tracking-wider text-[#5f615e] font-semibold">
            Studio HD Capture
          </span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {angleImages.map((angle, idx) => (
            <div
              key={angle.angleName}
              onClick={() => handleAngleSelect(angle, idx)}
              className="group flex flex-col items-center gap-1 cursor-pointer"
              role="button"
            >
              <div className="w-full aspect-[3/4] bg-white rounded overflow-hidden shadow-sm group-hover:scale-105 transition-transform border border-[#e5e0d8]">
                <img
                  src={angle.url}
                  alt={angle.alt}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] font-medium text-[#5f615e] group-hover:text-[#111111] text-center truncate w-full">
                {angle.angleName}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
