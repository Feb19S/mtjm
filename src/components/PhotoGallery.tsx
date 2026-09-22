"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// 相册：图片网格 + 点开全屏灯箱（支持左右切换、键盘、移动端滑动）。
// 无图时渲染占位网格 + 上传引导，提示真实图该放哪。
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
  const startX = useRef(0);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () => setActive((a) => (a === null ? a : (a - 1 + images.length) % images.length)),
    [images.length]
  );
  const next = useCallback(
    () => setActive((a) => (a === null ? a : (a + 1) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, close, prev, next]);

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

  return (
    <>
      <div className="grid grid-cols-3 gap-2.5">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="aspect-square overflow-hidden rounded-xl border border-ink-700 bg-ink-850"
            aria-label={`查看 ${nickname} 的截图 ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`${nickname} 截图 ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4"
          onClick={close}
          onTouchStart={(e) => {
            startX.current = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const dx = e.changedTouches[0].clientX - startX.current;
            if (dx > 40) prev();
            else if (dx < -40) next();
          }}
        >
          <button
            onClick={close}
            aria-label="关闭"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-lg text-ink-100"
          >
            ✕
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="上一张"
            className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-ink-100"
          >
            ‹
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt=""
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-full rounded-xl object-contain"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="下一张"
            className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl text-ink-100"
          >
            ›
          </button>
          <div className="absolute bottom-6 text-xs text-ink-300">
            {active + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
