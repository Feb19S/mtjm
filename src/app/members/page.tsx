import PageHeader from "@/components/PageHeader";
import { members } from "@/lib/data";

const roleStyle: Record<string, string> = {
  大哥: "border-red-500/40 bg-red-500/10 text-red-400",
  管理: "border-gold-500/40 bg-gold-500/10 text-gold-400",
  核心: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  成员: "border-ink-600 bg-ink-700 text-ink-300",
};

const classEmoji: Record<string, string> = {
  剑客: "⚔",
  医者: "☯",
  刺客: "🗡",
  射手: "🏹",
  肉盾: "🛡",
  术士: "✦",
  刀客: "⚔",
  琴师: "♪",
};

const roleOrder = ["大哥", "管理", "核心", "成员"] as const;

export default function MembersPage() {
  const onlineCount = members.filter((m) => m.online).length;
  const avgPower = Math.round(
    members.reduce((s, m) => s + m.power, 0) / members.length
  );

  const grouped = roleOrder.map((role) => ({
    role,
    list: members.filter((m) => m.role === role),
  }));

  return (
    <div>
      <PageHeader
        title="成员"
        subtitle={`共 ${members.length} 人 · 在线 ${onlineCount} · 平均战力 ${avgPower.toLocaleString()}`}
      />

      <div className="px-5 pt-5">
        {/* 职位统计 */}
        <div className="mb-5 grid grid-cols-4 gap-2">
          {roleOrder.map((role) => (
            <div
              key={role}
              className="rounded-xl border border-ink-700 bg-ink-850 py-2.5 text-center"
            >
              <div className="font-serif text-lg font-bold text-ink-100">
                {members.filter((m) => m.role === role).length}
              </div>
              <div className="mt-0.5 text-[11px] text-ink-400">{role}</div>
            </div>
          ))}
        </div>

        {grouped.map(
          ({ role, list }) =>
            list.length > 0 && (
              <section key={role} className="mb-6">
                <h2 className="mb-2.5 flex items-center gap-2 text-xs font-medium text-ink-300">
                  <span className="h-3 w-[3px] rounded-full bg-gold-500" />
                  {role}
                  <span className="text-ink-500">({list.length})</span>
                </h2>
                <div className="space-y-2">
                  {list.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-850 p-3.5"
                    >
                      {/* 头像 */}
                      <div className="relative">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-600 bg-ink-800 text-lg">
                          {classEmoji[m.class] ?? "侠"}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-ink-850 ${
                            m.online ? "bg-emerald-400" : "bg-ink-500"
                          }`}
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="truncate text-sm font-medium text-ink-100">
                            {m.nickname}
                          </span>
                          <span
                            className={`shrink-0 rounded border px-1.5 py-0.5 text-[10px] ${roleStyle[m.role]}`}
                          >
                            {m.role}
                          </span>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-[11px] text-ink-400">
                          <span>{m.class}</span>
                          <span>战力 {m.power.toLocaleString()}</span>
                          <span>入业 {m.joinWeeks} 周</span>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 text-[11px] ${
                          m.online ? "text-emerald-400" : "text-ink-500"
                        }`}
                      >
                        {m.online ? "在线" : "离线"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )
        )}
      </div>
    </div>
  );
}
