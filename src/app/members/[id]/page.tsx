import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { members } from "@/lib/data";
import MemberAvatar from "@/components/MemberAvatar";
import Reveal from "@/components/Reveal";
import PhotoGallery from "@/components/PhotoGallery";

const roleStyle: Record<string, string> = {
  大哥: "border-red-500/40 bg-red-500/10 text-red-400",
  管理: "border-gold-500/40 bg-gold-500/10 text-gold-400",
  核心: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  成员: "border-ink-600 bg-ink-700 text-ink-300",
};

const coverColor: Record<string, string> = {
  大哥: "#ef4444",
  管理: "#c9a961",
  核心: "#38bdf8",
  成员: "#6f6f82",
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

  const color = coverColor[member.role] ?? "#6f6f82";
  const images = [
    ...(member.avatar ? [member.avatar] : []),
    ...(member.photos ?? []),
  ];
  const related = members
    .filter(
      (m) => m.id !== member.id && (m.role === member.role || m.class === member.class)
    )
    .slice(0, 4);
  const maxPower = Math.max(...members.map((m) => m.power));
  const powerPct = Math.round((member.power / maxPower) * 100);

  return (
    <div>
      {/* 封面 + 大头像 */}
      <section className="relative">
        <div
          className="h-36 w-full sm:h-44"
          style={{
            background: `linear-gradient(135deg, ${color}40 0%, #0d0d11 68%)`,
          }}
        />
        <div className="relative mx-5 -mt-12 flex items-end gap-3">
          <div className="rounded-2xl border-2 border-ink-900 bg-ink-900 p-0.5">
            <MemberAvatar member={member} size={84} />
          </div>
          <div className="pb-1">
            <h1 className="font-serif text-2xl font-bold text-ink-100">
              {member.nickname}
            </h1>
            {member.title && (
              <p className="text-sm text-gold-400">{member.title}</p>
            )}
          </div>
        </div>
        <div className="mx-5 mt-3 flex flex-wrap items-center gap-2">
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
          {member.signature && (
            <p className="w-full text-[13px] italic text-ink-400">
              「{member.signature}」
            </p>
          )}
        </div>
      </section>

      <div className="mt-5 space-y-6 px-5 pb-12">
        {/* 数据概览 + 战力占比条 */}
        <Reveal>
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
          <div className="mt-2.5">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-800">
              <div
                className="h-full rounded-full bg-gold-500"
                style={{ width: `${powerPct}%` }}
              />
            </div>
            <div className="mt-1 text-right text-[10px] text-ink-500">
              占公会最高战力 {powerPct}%
            </div>
          </div>
        </Reveal>

        {/* 相册（图片主导，点开看大图） */}
        <Reveal>
          <h2 className="mb-2.5 flex items-center gap-2 text-xs font-medium text-ink-300">
            <span className="h-3 w-[3px] rounded-full bg-gold-500" />
            相册
          </h2>
          <PhotoGallery
            images={images}
            nickname={member.nickname}
            emptyHint={`把游戏截图放到 public/members/${member.id}/ 目录，并在 src/lib/data.ts 该成员的 photos 字段填入路径即可显示，例如 photos: ["/members/${member.id}/1.jpg", "/members/${member.id}/2.jpg"]。`}
          />
        </Reveal>

        {/* 高光时刻 */}
        {member.achievements && member.achievements.length > 0 && (
          <Reveal>
            <h2 className="mb-2.5 flex items-center gap-2 text-xs font-medium text-ink-300">
              <span className="h-3 w-[3px] rounded-full bg-gold-500" />
              高光时刻
            </h2>
            <ul className="space-y-2">
              {member.achievements.map((a, i) => (
                <li
                  key={a}
                  className="flex items-center gap-2.5 rounded-xl border border-ink-700 bg-ink-850 px-3.5 py-2.5"
                >
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-[10px] font-bold text-gold-400">
                    {i + 1}
                  </span>
                  <span className="text-[13px] text-ink-200">{a}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {/* 标签 */}
        {member.tags && member.tags.length > 0 && (
          <Reveal>
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
          </Reveal>
        )}

        {/* 简介 */}
        <Reveal>
          <h2 className="mb-2.5 flex items-center gap-2 text-xs font-medium text-ink-300">
            <span className="h-3 w-[3px] rounded-full bg-gold-500" />
            简介
          </h2>
          <p className="text-[13px] leading-relaxed text-ink-400">
            {member.bio}
          </p>
        </Reveal>

        {/* 相关成员（横向滑动，点击跳转） */}
        {related.length > 0 && (
          <Reveal>
            <h2 className="mb-2.5 flex items-center gap-2 text-xs font-medium text-ink-300">
              <span className="h-3 w-[3px] rounded-full bg-gold-500" />
              相关成员
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-1">
              {related.map((r) => (
                <Link
                  key={r.id}
                  href={`/members/${r.id}`}
                  className="flex w-20 flex-shrink-0 flex-col items-center gap-1.5 rounded-xl border border-ink-700 bg-ink-850 p-2.5 transition-colors hover:border-ink-500"
                >
                  <MemberAvatar member={r} size={44} />
                  <span className="w-full truncate text-center text-[11px] text-ink-200">
                    {r.nickname}
                  </span>
                  <span className="text-[10px] text-ink-500">{r.class}</span>
                </Link>
              ))}
            </div>
          </Reveal>
        )}

        <div className="pt-2 text-center">
          <Link
            href="/members"
            className="text-xs text-ink-400 underline-offset-2 hover:underline"
          >
            ‹ 返回成员列表
          </Link>
        </div>
      </div>
    </div>
  );
}
