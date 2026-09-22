import PageHeader from "@/components/PageHeader";
import RecruitJoin from "@/components/RecruitJoin";
import {
  clan,
  recruitRoles,
  recruitRequirements,
  clanBenefits,
  contact,
} from "@/lib/data";

export default function RecruitPage() {
  return (
    <div>
      <PageHeader title="招募" subtitle="长期招新 · 一起闯江湖" />

      <div className="px-5 pt-5">
        {/* 招募标语 */}
        <section className="rounded-2xl border border-gold-500/40 bg-gold-500/10 p-5">
          <h2 className="font-serif text-xl font-bold text-gold-400">
            缺你一个
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-ink-300">
            「{clan.name}」正在长期招募。不要求顶尖战力，只希望你能稳定上线、
            愿意和队友一起玩。新手肯学，我们随时带。
          </p>
          <div className="mt-4 flex gap-2">
            <span className="rounded-md bg-ink-800 px-2 py-1 text-[11px] text-ink-300">
              佛系不卷
            </span>
            <span className="rounded-md bg-ink-800 px-2 py-1 text-[11px] text-ink-300">
              固定团
            </span>
            <span className="rounded-md bg-ink-800 px-2 py-1 text-[11px] text-ink-300">
              分红
            </span>
            <span className="rounded-md bg-ink-800 px-2 py-1 text-[11px] text-ink-300">
              带躺
            </span>
          </div>
        </section>

        {/* 职业缺口 */}
        <section className="mt-7">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink-200">
            <span className="h-3.5 w-[3px] rounded-full bg-gold-500" />
            职业缺口
          </h2>
          <div className="space-y-2.5">
            {recruitRoles.map((r) => {
              const pct = Math.round(((r.total - r.need) / r.total) * 100);
              return (
                <div
                  key={r.name}
                  className="rounded-xl border border-ink-700 bg-ink-850 p-3.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[13px] text-ink-200">
                      {r.name}
                      {r.urgent && (
                        <span className="rounded bg-red-500/15 px-1.5 py-0.5 text-[10px] text-red-400">
                          急缺
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-ink-400">
                      缺 {r.need} 人
                    </span>
                  </div>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                    <div
                      className={`h-full rounded-full ${
                        r.urgent ? "bg-red-400" : "bg-sky-400"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 我们提供 */}
        <section className="mt-7">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink-200">
            <span className="h-3.5 w-[3px] rounded-full bg-gold-500" />
            我们提供
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            {clanBenefits.map((b) => (
              <div
                key={b.title}
                className="rounded-xl border border-ink-700 bg-ink-850 p-4"
              >
                <div className="text-sm font-medium text-gold-400">
                  {b.title}
                </div>
                <p className="mt-1 text-[12px] leading-relaxed text-ink-400">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 招募要求 */}
        <section className="mt-7">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-medium text-ink-200">
            <span className="h-3.5 w-[3px] rounded-full bg-gold-500" />
            对你的期待
          </h2>
          <ul className="space-y-2 rounded-xl border border-ink-700 bg-ink-850 p-4">
            {recruitRequirements.map((req) => (
              <li
                key={req}
                className="flex items-start gap-2 text-[13px] leading-relaxed text-ink-300"
              >
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                {req}
              </li>
            ))}
          </ul>
        </section>

        {/* 加入方式：扫码进群 + 一键复制联系方式 */}
        <RecruitJoin
          wechat={contact.wechat}
          qqGroup={contact.qqGroup}
          note={contact.note}
        />
      </div>
    </div>
  );
}
