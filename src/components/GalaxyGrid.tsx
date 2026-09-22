"use client";

import { useRef } from "react";
import Link from "next/link";
import MemberAvatar from "@/components/MemberAvatar";
import type { Member } from "@/lib/data";

const roleStyle: Record<string, string> = {
  大哥: "bg-gold-500/20 text-gold-400",
  管理: "bg-emerald-500/15 text-emerald-400",
  核心: "bg-sky-500/15 text-sky-400",
  成员: "bg-ink-700 text-ink-300",
};

function StatusDot({ online }: { online: boolean }) {
  return (
    <span
      className={`h-1.5 w-1.5 rounded-full ${
        online ? "bg-emerald-400" : "bg-ink-500"
      }`}
    />
  );
}

// 成员星河：大哥 spotlight + 成员卡片网格，指针视差 + 悬浮光晕。
export default function GalaxyGrid({
  leader,
  others,
}: {
  leader: Member;
  others: Member[];
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = (e.clientX - r.left) / r.width - 0.5;
    const dy = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `translate(${dx * -14}px, ${dy * -14}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "translate(0,0)";
  };

  return (
    <div className="mt-6">
      {/* 大哥 spotlight */}
      <Link
        href={`/members/${leader.id}`}
        className="card-rise block"
        style={{ animationDelay: "0ms" }}
      >
        <div className="member-card spotlight">
          <div className="avatar-ring">
            <MemberAvatar member={leader} size={72} />
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-ink-100">
                {leader.nickname}
              </span>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] ${roleStyle[leader.role]}`}
              >
                {leader.role}
              </span>
            </div>
            <div className="mt-0.5 text-xs text-gold-400">{leader.title}</div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-ink-400">
              <span>{leader.class}</span>
              <span className="text-ink-600">·</span>
              <span>战力 {leader.power.toLocaleString()}</span>
              <span
                className={`ml-auto flex items-center gap-1 ${
                  leader.online ? "text-emerald-400" : "text-ink-500"
                }`}
              >
                <StatusDot online={leader.online} />
                {leader.online ? "在线" : "离线"}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-400">
              {leader.bio}
            </p>
          </div>
        </div>
      </Link>

      {/* 其他成员 */}
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={reset}
        className="galaxy-parallax mt-3 grid grid-cols-2 gap-3"
      >
        {others.map((m, i) => (
          <Link
            key={m.id}
            href={`/members/${m.id}`}
            className="card-rise block"
            style={{ animationDelay: `${i * 70}ms` }}
          >
            <div className="member-card">
              <div className="flex items-center gap-2.5">
                <div className="avatar-ring-sm">
                  <MemberAvatar member={m} size={44} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-ink-100">
                    {m.nickname}
                  </div>
                  <div className="mt-0.5 truncate text-[11px] text-ink-400">
                    {m.title}
                  </div>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2 text-[11px] text-ink-400">
                <span>{m.class}</span>
                <span className="text-ink-600">·</span>
                <span>{m.power.toLocaleString()}</span>
                <span className="ml-auto">
                  <StatusDot online={m.online} />
                </span>
              </div>
              <p className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-ink-500">
                {m.bio}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
