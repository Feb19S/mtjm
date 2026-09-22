import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { members } from "@/lib/data";
import MemberAvatar from "@/components/MemberAvatar";
import MemberAura from "@/components/MemberAura";
import MemberConstellation from "@/components/MemberConstellation";
import TiltCard from "@/components/TiltCard";

const roleStyle: Record<string, string> = {
  大哥: "border-red-500/40 bg-red-500/10 text-red-400",
  管理: "border-gold-500/40 bg-gold-500/10 text-gold-400",
  核心: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  成员: "border-ink-600 bg-ink-700 text-ink-300",
};

export function generateStaticParams() {
  return members.map((m) => ({ id: String(m.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const m = members.find((x) => x.id === Number(id));
  if (!m) return { title: "成员未找到" };
  return { title: `${m.nickname} · 明天见吗`, description: m.bio };
}

export default async function MemberProfile({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = members.find((m) => m.id === Number(id));
  if (!member) notFound();

  return (
    <div>
      {/* Hero：Galacean 角色光环 + 召唤入场 + 御剑精灵 + 引力场 */}
      <section className="relative overflow-hidden">
        <MemberAura memberClass={member.class} />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink-900/30 via-ink-900/70 to-ink-900" />

        <div className="relative px-5 pb-5 pt-6">
          <Link
            href="/members"
            className="mb-5 inline-flex items-center gap-1 text-xs text-ink-300"
          >
            <span className="text-ink-500">‹</span> 返回成员
          </Link>

          <TiltCard className="flex flex-col items-center text-center">
            <MemberAvatar member={member} size={96} />
            <h1 className="mt-3 font-serif text-2xl font-bold text-ink-100">
              {member.nickname}
            </h1>
            {member.title && (
              <p className="mt-1 text-sm text-gold-400">{member.title}</p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <span
                className={`rounded border px-2 py-0.5 text-[11px] ${roleStyle[member.role]}`}
              >
                {member.role}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-ink-400">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    member.online ? "bg-emerald-400" : "bg-ink-500"
                  }`}
                />
                {member.online ? "在线" : "离线"}
              </span>
            </div>
            {member.signature && (
              <p className="mt-3 text-[13px] italic text-ink-400">
                「{member.signature}」
              </p>
            )}
          </TiltCard>
        </div>
      </section>

      <div className="px-5 pb-10">
        {/* 数据概览 */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="rounded-xl border border-ink-700 bg-ink-850 p-3 text-center">
            <div className="text-[11px] text-ink-400">战力</div>
            <div className="mt-1 text-base font-semibold text-gold-400">
              {member.power.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl border border-ink-700 bg-ink-850 p-3 text-center">
            <div className="text-[11px] text-ink-400">职业</div>
            <div className="mt-1 text-base font-semibold text-ink-100">
              {member.class}
            </div>
          </div>
          <div className="rounded-xl border border-ink-700 bg-ink-850 p-3 text-center">
            <div className="text-[11px] text-ink-400">入伙</div>
            <div className="mt-1 text-base font-semibold text-ink-100">
              {member.joinedAt ?? `${member.joinWeeks}周`}
            </div>
          </div>
        </div>

        {/* 命格星盘 */}
        <section className="mt-5">
          <h2 className="mb-2.5 flex items-center gap-2 text-xs font-medium text-ink-300">
            <span className="h-3 w-[3px] rounded-full bg-gold-500" />
            命格星盘
          </h2>
          <div className="rounded-xl border border-ink-700 bg-ink-850 p-2">
            <MemberConstellation member={member} />
          </div>
          <p className="mt-1.5 text-center text-[11px] text-ink-500">
            旋转星图 · 五维命格一览（战力 / 资历 / 职位 / 标签 / 在线）
          </p>
        </section>

        {/* 标签 */}
        {member.tags && member.tags.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-2.5 flex items-center gap-2 text-xs font-medium text-ink-300">
              <span className="h-3 w-[3px] rounded-full bg-gold-500" />
              标签
            </h2>
            <div className="flex flex-wrap gap-2">
              {member.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-ink-600 bg-ink-800 px-3 py-1 text-[12px] text-ink-300"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 简介 */}
        <div className="mt-5">
          <h2 className="mb-2.5 flex items-center gap-2 text-xs font-medium text-ink-300">
            <span className="h-3 w-[3px] rounded-full bg-gold-500" />
            简介
          </h2>
          <p className="text-[13px] leading-relaxed text-ink-400">
            {member.bio}
          </p>
        </div>

        {/* 高光时刻 */}
        {member.achievements && member.achievements.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-2.5 flex items-center gap-2 text-xs font-medium text-ink-300">
              <span className="h-3 w-[3px] rounded-full bg-gold-500" />
              高光时刻
            </h2>
            <ul className="space-y-2">
              {member.achievements.map((a) => (
                <li
                  key={a}
                  className="flex items-center gap-2.5 rounded-xl border border-ink-700 bg-ink-850 px-3.5 py-2.5"
                >
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold-500" />
                  <span className="text-[13px] text-ink-200">{a}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 相册 */}
        {member.photos && member.photos.length > 0 && (
          <div className="mt-5">
            <h2 className="mb-2.5 flex items-center gap-2 text-xs font-medium text-ink-300">
              <span className="h-3 w-[3px] rounded-full bg-gold-500" />
              相册
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              {member.photos.map((p, i) => (
                <img
                  key={i}
                  src={p}
                  alt={`${member.nickname} 的截图 ${i + 1}`}
                  className="aspect-square w-full rounded-xl border border-ink-700 object-cover"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
