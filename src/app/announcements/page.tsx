"use client";

import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { announcements } from "@/lib/data";

const tagStyle: Record<string, string> = {
  公告: "bg-ink-700 text-ink-200",
  活动: "bg-gold-500/15 text-gold-400",
  招募: "bg-emerald-500/15 text-emerald-400",
};

const filters = ["全部", "公告", "活动", "招募"] as const;
type Filter = (typeof filters)[number];

export default function AnnouncementsPage() {
  const [active, setActive] = useState<Filter>("全部");
  const list = announcements.filter(
    (n) => active === "全部" || n.tag === active
  );

  return (
    <div>
      <PageHeader title="公告" subtitle={`共 ${announcements.length} 条动态`} />

      <div className="px-5 pt-5">
        {/* 标签筛选 */}
        <div className="mb-4 flex gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                active === f
                  ? "bg-gold-500/20 text-gold-400"
                  : "bg-ink-850 text-ink-400"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* 列表 */}
        <div className="space-y-2.5">
          {list.map((n) => (
            <div
              key={n.id}
              className="rounded-xl border border-ink-700 bg-ink-850 p-4"
            >
              <div className="flex items-center gap-2">
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] ${tagStyle[n.tag]}`}
                >
                  {n.tag}
                </span>
                <span className="text-[11px] text-ink-500">{n.date}</span>
              </div>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-100">
                {n.title}
              </p>
            </div>
          ))}
          {list.length === 0 && (
            <p className="py-10 text-center text-sm text-ink-500">
              暂无相关动态
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
