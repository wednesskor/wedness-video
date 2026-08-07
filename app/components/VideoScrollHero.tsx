"use client";

import { useEffect, useRef, useState } from "react";

export default function VideoScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [duration, setDuration] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [isVideoLoaded, setIsVideoLoaded] = useState<boolean>(false);

  const targetTimeRef = useRef<number>(0);
  const currentTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);

  // Helper to draw video frame onto canvas
  const renderFrame = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (
      canvas.width !== video.videoWidth ||
      canvas.height !== video.videoHeight
    ) {
      if (video.videoWidth > 0 && video.videoHeight > 0) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
        setIsVideoLoaded(true);
        renderFrame();
      }
    };

    const handleSeeked = () => {
      renderFrame();
      isSeekingRef.current = false;
    };

    if (video.readyState >= 2) {
      handleLoadedMetadata();
    } else {
      video.addEventListener("loadedmetadata", handleLoadedMetadata);
      video.addEventListener("loadeddata", handleLoadedMetadata);
    }

    video.addEventListener("seeked", handleSeeked);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("loadeddata", handleLoadedMetadata);
      video.removeEventListener("seeked", handleSeeked);
    };
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrollableHeight = rect.height - window.innerHeight;

      if (scrollableHeight <= 0) return;

      const rawProgress = -rect.top / scrollableHeight;
      const currentProgress = Math.max(0, Math.min(1, rawProgress));

      setProgress(currentProgress);

      if (duration > 0) {
        targetTimeRef.current = currentProgress * duration;
      }
    };

    const updateVideoTime = () => {
      const video = videoRef.current;
      if (video && duration > 0 && !isSeekingRef.current) {
        const diff = targetTimeRef.current - currentTimeRef.current;

        if (Math.abs(diff) > 0.005) {
          currentTimeRef.current += diff * 0.25;

          if (!video.seeking) {
            isSeekingRef.current = true;
            video.currentTime = currentTimeRef.current;
          }
        } else if (
          Math.abs(video.currentTime - targetTimeRef.current) > 0.01 &&
          !video.seeking
        ) {
          isSeekingRef.current = true;
          video.currentTime = targetTimeRef.current;
        }
      }
      animationFrameId = requestAnimationFrame(updateVideoTime);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    animationFrameId = requestAnimationFrame(updateVideoTime);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [duration]);

  return (
    <section ref={containerRef} className="relative w-full h-[600vh] bg-black">
      <div
        className="sticky top-0 w-full h-screen bg-black flex flex-col items-center justify-center overflow-hidden z-20"
        style={{ position: "sticky", top: 0 }}
      >
        {/* Video Container: 90% width of layout for large clear display */}
        <div className="relative w-[90%] md:w-[70vw] h-[75vh] md:h-[70vh] max-w-[1400px] max-h-[850px] rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.9)] border border-white/10 flex items-center justify-center bg-black">
          {/* Hidden video element used as frame source */}
          <video
            ref={videoRef}
            src="/video1.mp4"
            muted
            playsInline
            preload="auto"
            className="hidden"
          />

          {/* Smooth Canvas rendering target */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover pointer-events-none"
          />

          {!isVideoLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white/60 text-sm font-['SUIT',sans-serif]">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                <span>비디오 로딩 중...</span>
              </div>
            </div>
          )}

          <div className="absolute inset-0 pointer-events-none ring-1 ring-white/10 rounded-2xl"></div>
        </div>

        {/* Scroll to experience text and animation at bottom */}
        <div
          className={`absolute bottom-6 flex flex-col items-center gap-2 text-white/80 transition-opacity duration-500 pointer-events-none select-none ${
            progress > 0.9 ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="text-[14px] font-['SUIT',sans-serif] font-medium tracking-[0.2em] uppercase text-white/70">
            스크롤해서 체험하기
          </span>
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center p-1">
            <div className="w-1.5 h-2.5 bg-white/80 rounded-full animate-bounce mt-1"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
