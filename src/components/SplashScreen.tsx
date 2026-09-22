"use client";

import { useEffect, useRef, useState } from "react";
import type { Entity } from "@galacean/engine";
import { clan } from "@/lib/data";

interface Orb {
  entity: Entity;
  sx: number;
  sy: number;
  sz: number;
  hx: number;
  hy: number;
  hz: number;
  baseScale: number;
  phase: number;
  angle: number;
  orbitR: number;
  orbitSpeed: number;
}

// 开屏：金色流萤从四周汇聚成公会印记「明天见吗」，1.8s 后浮现标题与「入江湖」。
export default function SplashScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [closing, setClosing] = useState(false);
  const [gone, setGone] = useState(false);

  // 每次加载都播（用户设定），不缓存
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => setRevealed(true), 1800);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  const dismiss = () => {
    if (closing || gone) return;
    setClosing(true);
    window.setTimeout(() => {
      setGone(true);
      document.body.style.overflow = "";
    }, 650);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduceMotion = !!window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    let disposed = false;
    let engine: import("@galacean/engine").WebGLEngine | null = null;
    let ro: ResizeObserver | null = null;
    let onVis: (() => void) | null = null;

    (async () => {
      let GE: typeof import("@galacean/engine");
      try {
        GE = await import("@galacean/engine");
      } catch {
        return; // 加载失败 → 仅显示文字封面
      }
      if (disposed || !canvas) return;
      let eng: import("@galacean/engine").WebGLEngine;
      try {
        eng = await GE.WebGLEngine.create({ canvas });
      } catch {
        return; // 无 WebGL → 仅显示文字封面
      }
      if (disposed) {
        eng.destroy();
        return;
      }
      engine = eng;

      const { Color, MeshRenderer, PrimitiveMesh, UnlitMaterial, Script, Camera } =
        GE;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      engine.canvas.resizeByClientSize(dpr);

      const scene = engine.sceneManager.activeScene;
      scene.background.solidColor = new Color(0.04, 0.04, 0.06, 1);

      const cam = scene.createRootEntity("cam");
      cam.addComponent(Camera);
      cam.transform.position.set(0, 0, 10);

      const N = 90;
      const orbs: Orb[] = [];
      const sphere = PrimitiveMesh.createSphere(engine, 1, 8);
      const GOLDEN = Math.PI * (3 - Math.sqrt(5));

      for (let i = 0; i < N; i++) {
        const entity = scene.createRootEntity("p");
        const mr = entity.addComponent(MeshRenderer);
        mr.mesh = sphere;
        const mat = new UnlitMaterial(engine);
        const gold = Math.random() > 0.4;
        mat.baseColor = gold
          ? new Color(0.85, 0.7, 0.4, 1)
          : new Color(0.95, 0.93, 0.85, 1);
        mr.setMaterial(mat);

        // 家位置：椭圆印记（golden-angle 均匀分布）
        const r = 0.5 + (i % 5) * 0.62 + Math.random() * 0.25;
        const ang = i * GOLDEN;
        const hx = Math.cos(ang) * r;
        const hy = Math.sin(ang) * r * 0.5;
        const hz = (Math.random() - 0.5) * 1.5;

        // 起始：屏幕外散布
        const sx = (Math.random() - 0.5) * 16;
        const sy = (Math.random() - 0.5) * 14;
        const sz = (Math.random() - 0.5) * 6;

        const baseScale = 0.05 + Math.random() * 0.09;
        entity.transform.position.set(sx, sy, sz);
        entity.transform.scale.set(baseScale, baseScale, baseScale);

        orbs.push({
          entity,
          sx,
          sy,
          sz,
          hx,
          hy,
          hz,
          baseScale,
          phase: Math.random() * Math.PI * 2,
          angle: Math.random() * Math.PI * 2,
          orbitR: 0.05 + Math.random() * 0.12,
          orbitSpeed: 0.2 + Math.random() * 0.5,
        });
      }

      const SplashScript = class extends Script {
        ps: Orb[] = [];
        t = 0;
        onUpdate(dt: number): void {
          this.t += dt;
          const p = Math.min(this.t / 1.8, 1);
          const e = 1 - Math.pow(1 - p, 3);
          for (const o of this.ps) {
            const pos = o.entity.transform.position;
            if (p < 1) {
              pos.x = o.sx + (o.hx - o.sx) * e;
              pos.y = o.sy + (o.hy - o.sy) * e;
              pos.z = o.sz + (o.hz - o.sz) * e;
            } else {
              o.angle += o.orbitSpeed * dt;
              pos.x = o.hx + Math.cos(o.angle) * o.orbitR;
              pos.y = o.hy + Math.sin(o.angle) * o.orbitR;
              pos.z = o.hz;
            }
            const s =
              o.baseScale * (0.7 + 0.3 * Math.sin(this.t * 1.5 + o.phase));
            o.entity.transform.scale.set(s, s, s);
          }
        }
      };

      const animEnt = scene.createRootEntity("anim");
      const anim = animEnt.addComponent(SplashScript);
      (anim as unknown as { ps: Orb[] }).ps = orbs;

      engine.run();
      ro = new ResizeObserver(() => engine?.canvas.resizeByClientSize(dpr));
      ro.observe(canvas);
      onVis = () => {
        if (!engine) return;
        if (document.hidden) engine.pause();
        else engine.resume();
      };
      document.addEventListener("visibilitychange", onVis);
    })();

    return () => {
      disposed = true;
      ro?.disconnect();
      if (onVis) document.removeEventListener("visibilitychange", onVis);
      engine?.destroy();
    };
  }, []);

  if (gone) return null;

  return (
    <div className={`splash-overlay ${closing ? "splash-out" : "splash-in"}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,97,0.14),transparent_60%)]" />
      <button
        onClick={dismiss}
        className="absolute right-4 top-4 z-20 text-xs text-ink-400/80 transition-colors hover:text-ink-200"
      >
        跳过
      </button>
      <div className={`splash-center ${revealed ? "show" : ""}`}>
        <h1 className="clan-emblem font-serif">{clan.name}</h1>
        <p className="splash-sub">{clan.slogan}</p>
        <button onClick={dismiss} className="btn-enter">
          入江湖
        </button>
      </div>
    </div>
  );
}
