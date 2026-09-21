import Link from "next/link";
import {
  clan,
  announcements,
  activities,
  members,
} from "@/lib/data";

const tagStyle: Record<string, string> = {
  公告: "bg-ink-700 text-ink-200",
  活动: "bg-gold-500/15 text-gold-400",
  招募: "bg-emerald-500/15 text-emerald-400",
};

export default function HomePage() {
  const onlineCount = members.filter((m) => m.online).length;

  return (
    <div className="px-5 pt-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl border border-ink-700 bg-ink-850 p-6">
        <div className="pointer-events-none absolute -right-6 -top-6 font-serif text-[88px] leading-none text-ink-800 select-none">
          百
        </div>
        <p className="text-xs tracking-[0.2em] text-gold-500">
          {clan.subtitle}
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold tracking-wide text-ink-100">
          {clan.name}
        </h1>
        <p className="mt-2 text-sm text-ink-300">{clan.slogan}</p>
        <p className="mt-4 text-[13px] leading-relaxed text-ink-400">
          {clan.intro}
        </p>
      </section>

      {/* Stats */}
      <section className="mt-4 grid grid-cols-4 gap-2">
        {[
          { label: "成员", value: clan.memberCount },
          { label: "在线", value: onlineCount },
          { label: "等级", value: clan.level },
          { label: "周活动", value: clan.weeklyActivities },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-ink-700 bg-ink-850 py-3 text-center"
          >
            <div className="font-serif text-xl font-bold text-gold-500">
              {s.value}
            </div>
            <div className="mt-0.5 text-[11px] text-ink-400">{s.label}</div>
          </div>
        ))}
      </section>

      {/* 进行中活动 */}
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-medium text-ink-200">
            <span className="h-3.5 w-[3px] rounded-full bg-gold-500" />
            本周活动
          </h2>
          <Link
            href="/activities"
            className="text-xs text-ink-400 transition-colors hover:text-gold-500"
          >
            全部 ›
          </Link>
        </div>
        <div className="space-y-2.5">
          {activities.map((a) => (
            <div
              key={a.id}
              className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-850 p-3.5"
            >
              <span
                className="h-9 w-1 rounded-full"
                style={{ backgroundColor: a.accent }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-ink-100">
                    {a.name}
                  </span>
                  <span className="rounded bg-ink-700 px-1.5 py-0.5 text-[10px] text-ink-300">
                    {a.difficulty}
                  </span>
                </div>
                <p className="mt-0.5 truncate text-xs text-ink-400">
                  {a.schedule}
                </p>
              </div>
              <span className="shrink-0 text-xs text-ink-300">
                {a.joined}/{a.capacity}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 公告 */}
      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-medium text-ink-200">
            <span className="h-3.5 w-[3px] rounded-full bg-gold-500" />
            最新公告
          </h2>
        </div>
        <div className="divide-y divide-ink-700 overflow-hidden rounded-xl border border-ink-700 bg-ink-850">
          {announcements.map((n) => (
            <div key={n.id} className="flex items-center gap-3 px-3.5 py-3">
              <span
                className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] ${tagStyle[n.tag]}`}
              >
                {n.tag}
              </span>
              <span className="min-w-0 flex-1 truncate text-[13px] text-ink-200">
                {n.title}
              </span>
              <span className="shrink-0 text-[11px] text-ink-500">{n.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-7">
        <Link
          href="/recruit"
          className="flex items-center justify-between rounded-2xl border border-gold-500/40 bg-gold-500/10 px-5 py-4 transition-colors active:bg-gold-500/20"
        >
          <div>
            <div className="font-serif text-base font-bold text-gold-400">
              加入我们
            </div>
            <div className="mt-0.5 text-xs text-ink-300">
              长期招募中 · 缺奶妈和肉盾
            </div>
          </div>
          <span className="text-gold-500">›</span>
        </Link>
      </section>

      <footer className="mt-8 pb-4 text-center text-[11px] text-ink-600">
        明天见吗 · 建业 {clan.foundedDays} 天
      </footer>
    </div>
  );
}
