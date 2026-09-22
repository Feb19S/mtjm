"use client";

import { useRef, type ReactNode } from "react";

// 3D 倾斜名片：指针 / 触摸驱动 perspective 倾斜
export default function TiltCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const lastPointer = useRef(0);

  const apply = (rx: number, ry: number) => {
    if (!ref.current) return;
    ref.current.style.transform = `perspective(800px) rotateX(${rx.toFixed(
      2,
    )}deg) rotateY(${ry.toFixed(2)}deg)`;
  };

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    lastPointer.current = Date.now();
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    apply(-py * 10, px * 12);
  };

  const reset = () => apply(0, 0);

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={className}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 150ms ease-out",
        willChange: "transform",
        transform: "perspective(800px) rotateX(0) rotateY(0)",
      }}
    >
      {children}
    </div>
  );
}
