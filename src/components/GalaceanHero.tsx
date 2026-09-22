"use client";

import { useEffect, useRef } from "react";
import type { Entity } from "@galacean/engine";

interface OrbData {
  entity: Entity;
  baseX: number;
  vy: number;
  swaySpeed: number;
  swayAmp: number;
  phase: number;
  baseScale: number;
}

export default function GalaceanHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 减少动态效果偏好下，不启动 WebGL，只保留 CSS 背景
    if (reduceMotion) return;

    let disposed = false;
    let engine: import("@galacean/engine").WebGLEngine | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let onVisibility: (() => void) | null = null;

    (async () => {
      let GE: typeof import("@galacean/engine");
      try {
        GE = await import("@galacean/engine");
      } catch {
        return; // 加载失败 → 回退到 CSS 背景
      }
      if (disposed || !canvas) return;

      let engineInstance: import("@galacean/engine").WebGLEngine;
      try {
        engineInstance = await GE.WebGLEngine.create({ canvas });
      } catch {
        return; // 无 WebGL → 回退到 CSS 背景
      }
      if (disposed) {
        engineInstance.destroy();
        return;
      }
      engine = engineInstance;

      const {
        Color,
        MeshRenderer,
        PrimitiveMesh,
        UnlitMaterial,
        Script,
        Camera,
      } = GE;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      engine.canvas.resizeByClientSize(dpr);

      const scene = engine.sceneManager.activeScene;
      scene.background.solidColor = new Color(0.05, 0.05, 0.07, 1);

      // 相机
      const cameraEntity = scene.createRootEntity("camera");
      cameraEntity.addComponent(Camera);
      cameraEntity.transform.position.set(0, 0, 10);

      // 漂浮光点（流萤）动画脚本
      const OrbScript = class extends Script {
        orbs: OrbData[] = [];
        private _t = 0;
        onUpdate(dt: number): void {
          this._t += dt;
          for (const o of this.orbs) {
            const pos = o.entity.transform.position;
            pos.y += o.vy * dt;
            pos.x =
              o.baseX + Math.sin(this._t * o.swaySpeed + o.phase) * o.swayAmp;
            if (pos.y > 5.5) pos.y = -5.5;
            const s =
              o.baseScale * (0.65 + 0.35 * Math.sin(this._t * 1.6 + o.phase));
            o.entity.transform.scale.set(s, s, s);
          }
        }
      };

      const count = 42;
      const orbs: OrbData[] = [];
      const sphere = PrimitiveMesh.createSphere(engine, 1, 10);

      for (let i = 0; i < count; i++) {
        const entity = scene.createRootEntity("orb");
        const mr = entity.addComponent(MeshRenderer);
        mr.mesh = sphere;

        const isGold = Math.random() > 0.45;
        const mat = new UnlitMaterial(engine);
        mat.baseColor = isGold
          ? new Color(0.79, 0.66, 0.38, 1)
          : new Color(0.92, 0.9, 0.82, 1);
        mr.setMaterial(mat);

        const baseX = (Math.random() - 0.5) * 12;
        const baseY = (Math.random() - 0.5) * 11;
        const baseZ = (Math.random() - 0.5) * 4;
        const baseScale = 0.05 + Math.random() * 0.08;

        entity.transform.position.set(baseX, baseY, baseZ);
        entity.transform.scale.set(baseScale, baseScale, baseScale);

        orbs.push({
          entity,
          baseX,
          vy: 0.25 + Math.random() * 0.5,
          swaySpeed: 0.4 + Math.random() * 0.8,
          swayAmp: 0.3 + Math.random() * 0.6,
          phase: Math.random() * Math.PI * 2,
          baseScale,
        });
      }

      const animEntity = scene.createRootEntity("anim");
      const anim = animEntity.addComponent(OrbScript);
      (anim as unknown as { orbs: OrbData[] }).orbs = orbs;

      engine.run();

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
      engine?.destroy();
    };
  }, []);

  return (
    <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />
  );
}
