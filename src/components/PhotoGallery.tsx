"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 相册：图片网格 + 全屏灯箱（方向感知滑切 + 淡入淡出 + Ken Burns 缓推 + 开场弹入）。
// 无图时渲染占位网格 + 上传引导。
export default function PhotoGallery({
  images,
  nickname,
  emptyHint,
}: {
  images: string[];
  nickname: string;
  emptyHint?: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1>(1);
  const [closing, setClosing] = useState(false);
  const activeRef = useRef<number | null>(null);
  const startX = useRef(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  const clearTimer = () => {
    if (timer.current) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const go = useCallback(
    (delta: number) => {
      const cur = activeRef.current;
      if (cur === null) return;
      const nextIdx = (cur + delta + images.length) % images.length;
      setLeaving(cur);
      setDir(delta > 0 ? 1 : -1);
      setActive(nextIdx);
      clearTimer();
      timer.current = window.setTimeout(() => setLeaving(null), 440);
    },
    [images.length]
  );

  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(1), [go]);

  const requestClose = useCallback(() => {
    setClosing(true);
    window.setTimeout(() => {
      setActive(null);
      setLeaving(null);
      setClosing(false);
    }, 200);
  }, []);

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      clearTimer();
    };
  }, [active, requestClose, prev, next]);

  if (images.length === 0) {
    return (
      <div>
        <div className="grid grid-cols-3 gap-2.5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-ink-700 bg-ink-850/60 text-ink-600"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="6" width="18" height="14" rx="2" />
                <circle cx="9" cy="12" r="2.2" />
                <path d="M3 17l5-4 4 3 3-2 6 5" />
              </svg>
              <span className="mt-1 text-[10px]">截图占位</span>
            </div>
          ))}
        </div>
        {emptyHint && (
          <p className="mt-2.5 rounded-xl border border-ink-700 bg-ink-850/60 p-3 text-[11px] leading-relaxed text-ink-400">
            {emptyHint}
          </p>
        )}
      </div>
    );
  }

  const enterClass =
    leaving === null ? "lb-pop" : dir === 1 ? "lb-from-right" : "lb-from-left";
  const leaveClass = dir === 1 ? "lb-to-left" : "lb-to-right";

  return (
    <>
      <div className="grid grid-cols-3 gap-2.5">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => {
              setLeaving(null);
              setDir(1);
              setActive(i);
            }}
            className="thumb-in aspect-square overflow-hidden rounded-xl border border-ink-700 bg-ink-850"
            style={{ animationDelay: `${i * 55}ms` }}
            aria-label={`查看 ${nickname} 的截图 ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${nickname} 截图 ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className={`lb-backdrop ${closing ? "lb-out" : "lb-in"}`}
          onClick={requestClose}
          onTouchStart={(e) => {
            startX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - startX.current;
            if (dx > 45) prev();
            else if (dx < -45) next();
          }}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              requestClose();
            }}
            aria-label="关闭"
            className="lb-btn absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg text-ink-100"
          >
            ✕
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="上一张"
            className="lb-btn absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-ink-100"
          >
            ‹
          </button>

          <div className="lb-stage">
            {leaving !== null && (
              <div className={`lb-layer ${leaveClass}`} onClick={(e) => e.stopPropagation()}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img className="lb-photo" src={images[leaving]} alt="" />
              </div>
            )}
            <div className={`lb-layer ${enterClass}`} onClick={(e) => e.stopPropagation()}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="lb-photo" src={images[active]} alt={`${nickname} 截图 ${active + 1}`} />
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="下一张"
            className="lb-btn absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-ink-100"
          >
            ›
          </button>

          <div className="lb-dots" onClick={(e) => e.stopPropagation()}>
            {images.map((_, i) => (
              <span key={i} className={`lb-dot ${i === active ? "on" : ""}`} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
