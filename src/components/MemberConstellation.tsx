"use client";

import { useEffect, useRef } from "react";
import type { Entity } from "@galacean/engine";
import type { Member } from "@/lib/data";

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

export default function MemberConstellation({ member }: { member: Member }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      !!window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let disposed = false;
    let engine: import("@galacean/engine").WebGLEngine | null = null;
    let resizeObserver: ResizeObserver | null = null;

    (async () => {
      let GE: typeof import("@galacean/engine");
      try {
        GE = await import("@galacean/engine");
      } catch {
        return;
      }
      if (disposed || !canvas) return;

      let ei: import("@galacean/engine").WebGLEngine;
      try {
        ei = await GE.WebGLEngine.create({ canvas });
      } catch {
        return;
      }
      if (disposed) {
        ei.destroy();
        return;
      }
      engine = ei;
      const eng = ei; // 非空别名，供闭包内的辅助函数使用

      const { Color, MeshRenderer, PrimitiveMesh, UnlitMaterial, Script, Camera } =
        GE;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      eng.canvas.resizeByClientSize(dpr);

      const scene = eng.sceneManager.activeScene;
      scene.background.solidColor = new Color(0.04, 0.04, 0.06, 1);

      const camEnt = scene.createRootEntity("cam");
      camEnt.addComponent(Camera);
      camEnt.transform.position.set(0, 0, 7);

      const rgb = classColor[member.class] ?? [0.79, 0.66, 0.38];

      // 五维命格：战力 / 资历 / 职位 / 标签 / 在线
      const roleWeight: Record<string, number> = {
        大哥: 1,
        管理: 0.8,
        核心: 0.6,
        成员: 0.4,
      };
      const stats = [
        Math.min(member.power / 22000, 1),
        Math.min((member.joinWeeks ?? 0) / 52, 1),
        roleWeight[member.role] ?? 0.4,
        Math.min((member.tags?.length ?? 0) / 5, 1),
        member.online ? 1 : 0.35,
      ];
      const n = stats.length;

      const group = scene.createRootEntity("group");
      const sphere = PrimitiveMesh.createSphere(eng, 1, 12);

      const mk = (
        r: number,
        g: number,
        b: number,
        a: number,
        sx: number,
        sy: number,
        sz: number,
        x: number,
        y: number,
        z: number,
      ): Entity => {
        const e = scene.createRootEntity("node");
        const mr = e.addComponent(MeshRenderer);
        mr.mesh = sphere;
        const m = new UnlitMaterial(eng);
        m.baseColor = new Color(r, g, b, a);
        m.isTransparent = true;
        mr.setMaterial(m);
        e.transform.position.set(x, y, z);
        e.transform.scale.set(sx, sy, sz);
        group.addChild(e);
        return e;
      };

      // 中心
      mk(0.95, 0.85, 0.5, 1, 0.35, 0.35, 0.35, 0, 0, 0);
      // 五维节点
      for (let i = 0; i < n; i++) {
        const ang = (i / n) * Math.PI * 2 - Math.PI / 2;
        const val = stats[i];
        const rad = 1.0 + val * 1.4;
        const s = 0.12 + val * 0.18;
        mk(
          rgb[0],
          rgb[1],
          rgb[2],
          0.95,
          s,
          s,
          s,
          Math.cos(ang) * rad,
          Math.sin(ang) * rad,
          0,
        );
      }
      // 外环
      const ringCount = 30;
      for (let i = 0; i < ringCount; i++) {
        const ang = (i / ringCount) * Math.PI * 2;
        mk(
          0.3,
          0.27,
          0.16,
          0.45,
          0.05,
          0.05,
          0.05,
          Math.cos(ang) * 2.8,
          Math.sin(ang) * 2.8,
          0,
        );
      }

      const SpinScript = class extends Script {
        onUpdate(dt: number) {
          this.entity.transform.rotate(0.12 * dt, 0.35 * dt, 0);
        }
      };
      group.addComponent(SpinScript);

      eng.run();

      resizeObserver = new ResizeObserver(() => {
        eng.canvas.resizeByClientSize(dpr);
      });
      resizeObserver.observe(canvas);
    })();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      engine?.destroy();
    };
  }, [member]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="h-[220px] w-full"
      style={{ touchAction: "none" }}
    />
  );
}
