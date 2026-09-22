"use client";

import { useEffect, useRef } from "react";
import type { Entity } from "@galacean/engine";

interface OrbData {
  entity: Entity;
  angle: number;
  speed: number;
  targetR: number;
  startR: number;
  r: number;
  z: number;
  phase: number;
  baseScale: number;
}

interface CompanionData {
  entity: Entity;
  angle: number;
  speed: number;
  r: number;
}

// 按职业染色（0..1 RGB）
const classColor: Record<string, [number, number, number]> = {
  剑客: [0.79, 0.66, 0.38],
  医者: [0.29, 0.87, 0.5],
  刺客: [0.65, 0.55, 0.98],
  射手: [0.22, 0.74, 0.97],
  肉盾: [0.98, 0.57, 0.24],
  术士: [0.96, 0.45, 0.71],
  刀客: [0.97, 0.45, 0.45],
  琴师: [0.18, 0.83, 0.75],
};

export default function MemberAura({ memberClass }: { memberClass: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const classRef = useRef(memberClass);
  classRef.current = memberClass;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return; // 回退到 CSS 背景

    let disposed = false;
    let engine: import("@galacean/engine").WebGLEngine | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let onVisibility: (() => void) | null = null;
    const detachPointer: Array<() => void> = [];

    (async () => {
      let GE: typeof import("@galacean/engine");
      try {
        GE = await import("@galacean/engine");
      } catch {
        return;
      }
      if (disposed || !canvas) return;

      let engineInstance: import("@galacean/engine").WebGLEngine;
      try {
        engineInstance = await GE.WebGLEngine.create({ canvas });
      } catch {
        return; // 无 WebGL → 回退
      }
      if (disposed) {
        engineInstance.destroy();
        return;
      }
      engine = engineInstance;

      const { Color, MeshRenderer, PrimitiveMesh, UnlitMaterial, Script, Camera } =
        GE;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      engine.canvas.resizeByClientSize(dpr);

      const scene = engine.sceneManager.activeScene;
      scene.background.solidColor = new Color(0.03, 0.03, 0.05, 1);

      const cameraEntity = scene.createRootEntity("camera");
      cameraEntity.addComponent(Camera);
      cameraEntity.transform.position.set(0, 0, 10);

      const rgb = classColor[classRef.current] ?? [0.79, 0.66, 0.38];

      // 组合动效脚本：光环 + 召唤入场 + 御剑精灵 + 引力场
      const AuraScript = class extends Script {
        orbs: OrbData[] = [];
        companion: CompanionData | null = null;
        pointer = { x: 0, y: 0 };
        pointerActive = false;
        pointerDown = false;
        elapsed = 0;
        readonly summonDur = 1.4;

        onUpdate(dt: number) {
          this.elapsed += dt;
          const t = Math.min(this.elapsed / this.summonDur, 1);
          const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic

          for (const o of this.orbs) {
            o.angle += o.speed * dt;
            let r: number;
            if (t < 1) {
              // 召唤入场：从外圈聚拢到目标半径
              r = o.startR + (o.targetR - o.startR) * ease;
            } else if (this.pointerDown) {
              // 引力场：被手指吸成漩涡
              let x = Math.cos(o.angle) * o.r;
              let y = Math.sin(o.angle) * o.r;
              const k = Math.min(3 * dt, 1);
              x += (this.pointer.x - x) * k;
              y += (this.pointer.y - y) * k;
              o.r = Math.hypot(x, y);
              o.angle = Math.atan2(y, x);
              r = o.r;
            } else {
              // 松手后缓回轨道
              o.r += (o.targetR - o.r) * Math.min(2 * dt, 1);
              r = o.r;
            }
            const px = Math.cos(o.angle) * r;
            const py = Math.sin(o.angle) * r;
            o.entity.transform.position.set(px, py, o.z);
            const tw = 0.7 + 0.3 * Math.sin(this.elapsed * 1.6 + o.phase);
            const s = o.baseScale * tw * (t < 1 ? 0.4 + 0.6 * ease : 1);
            o.entity.transform.scale.set(s, s, s);
          }

          // 御剑精灵：空闲绕飞，手指移动时跟随
          if (this.companion) {
            const c = this.companion;
            if (this.pointerActive && !this.pointerDown) {
              let x = Math.cos(c.angle) * c.r;
              let y = Math.sin(c.angle) * c.r;
              const k = Math.min(4 * dt, 1);
              x += (this.pointer.x - x) * k;
              y += (this.pointer.y - y) * k;
              c.r = Math.min(Math.hypot(x, y), 4.2);
              c.angle = Math.atan2(y, x);
            } else {
              c.angle += c.speed * dt;
              c.r += (3.4 - c.r) * Math.min(2 * dt, 1);
            }
            c.entity.transform.position.set(
              Math.cos(c.angle) * c.r,
              Math.sin(c.angle) * c.r,
              0.5,
            );
          }
        }
      };

      const sphere = PrimitiveMesh.createSphere(engine, 1, 8);
      const companionSphere = PrimitiveMesh.createSphere(engine, 1, 16);
      const orbs: OrbData[] = [];
      const count = 46;
      for (let i = 0; i < count; i++) {
        const entity = scene.createRootEntity("orb");
        const mr = entity.addComponent(MeshRenderer);
        mr.mesh = sphere;
        const mat = new UnlitMaterial(engine);
        const a = 0.75 + Math.random() * 0.25;
        mat.baseColor = new Color(rgb[0], rgb[1], rgb[2], a);
        mat.isTransparent = true;
        mr.setMaterial(mat);

        const startR = 8 + Math.random() * 2.5;
        const targetR = 2.2 + Math.random() * 2.2;
        orbs.push({
          entity,
          angle: Math.random() * Math.PI * 2,
          speed: 0.2 + Math.random() * 0.4,
          targetR,
          startR,
          r: startR,
          z: (Math.random() - 0.5) * 1.6,
          phase: Math.random() * Math.PI * 2,
          baseScale: 0.05 + Math.random() * 0.06,
        });
      }

      // 御剑精灵（更大更亮的一颗）
      const compEntity = scene.createRootEntity("companion");
      const cmr = compEntity.addComponent(MeshRenderer);
      cmr.mesh = companionSphere;
      const cmat = new UnlitMaterial(engine);
      cmat.baseColor = new Color(0.98, 0.93, 0.78, 0.95);
      cmat.isTransparent = true;
      cmr.setMaterial(cmat);
      const companion: CompanionData = {
        entity: compEntity,
        angle: 0,
        speed: 0.5,
        r: 3.4,
      };

      const animEntity = scene.createRootEntity("anim");
      const anim = animEntity.addComponent(AuraScript) as InstanceType<
        typeof AuraScript
      >;
      anim.orbs = orbs;
      anim.companion = companion;

      engine.run();

      // 指针交互（映射到场景世界坐标）
      const halfH = 4.142; // tan(22.5°) * 10
      const toWorld = (e: PointerEvent) => {
        const rect = canvas!.getBoundingClientRect();
        const aspect = rect.width / Math.max(rect.height, 1);
        const halfW = halfH * aspect;
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        return { x: nx * 2 * halfW, y: -ny * 2 * halfH };
      };
      const onMove = (e: PointerEvent) => {
        const w = toWorld(e);
        anim.pointer.x = w.x;
        anim.pointer.y = w.y;
        anim.pointerActive = true;
      };
      const onDown = (e: PointerEvent) => {
        const w = toWorld(e);
        anim.pointer.x = w.x;
        anim.pointer.y = w.y;
        anim.pointerActive = true;
        anim.pointerDown = true;
      };
      const onUp = () => {
        anim.pointerDown = false;
      };
      const onLeave = () => {
        anim.pointerDown = false;
        anim.pointerActive = false;
      };
      canvas.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerdown", onDown);
      canvas.addEventListener("pointerup", onUp);
      canvas.addEventListener("pointerleave", onLeave);
      canvas.addEventListener("pointercancel", onUp);
      detachPointer.push(() => {
        canvas.removeEventListener("pointermove", onMove);
        canvas.removeEventListener("pointerdown", onDown);
        canvas.removeEventListener("pointerup", onUp);
        canvas.removeEventListener("pointerleave", onLeave);
        canvas.removeEventListener("pointercancel", onUp);
      });

      resizeObserver = new ResizeObserver(() => {
        engine?.canvas.resizeByClientSize(dpr);
      });
      resizeObserver.observe(canvas);

      onVisibility = () => {
        if (!engine) return;
        if (document.hidden) engine.pause();
        else engine.resume();
      };
      document.addEventListener("visibilitychange", onVisibility);
    })();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      if (onVisibility)
        document.removeEventListener("visibilitychange", onVisibility);
      detachPointer.forEach((d) => d());
      engine?.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{ touchAction: "none" }}
    />
  );
}
