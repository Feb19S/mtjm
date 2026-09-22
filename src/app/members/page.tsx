import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import MemberAvatar from "@/components/MemberAvatar";
import { members } from "@/lib/data";

const roleStyle: Record<string, string> = {
  大哥: "border-red-500/40 bg-red-500/10 text-red-400",
  管理: "border-gold-500/40 bg-gold-500/10 text-gold-400",
  核心: "border-sky-500/40 bg-sky-500/10 text-sky-400",
  成员: "border-ink-600 bg-ink-700 text-ink-300",
};

const roleOrder = ["大哥", "管理", "核心", "成员"] as const;

export default function MembersPage() {
  const onlineCount = members.filter((m) => m.online).length;
  const avgPower = Math.round(
    members.reduce((s, m) => s + m.power, 0) / members.length
  );

  let riseIndex = 0;

  return (
    <div>
      <PageHeader
        title="成员"
        subtitle={`共 ${members.length} 人 · 在线 ${onlineCount} · 平均战力 ${avgPower.toLocaleString()}`}
      />

      <div className="px-5 pt-5">
        {roleOrder.map((role) => {
          const list = members.filter((m) => m.role === role);
          if (list.length === 0) return null;

          return (
            <section key={role} className="mb-6">
              <h2 className="mb-2.5 flex items-center gap-2 text-xs font-medium text-ink-300">
                <span className="h-3 w-[3px] rounded-full bg-gold-500" />
                {role}
                <span className="text-ink-500">({list.length})</span>
              </h2>

              <div className="grid grid-cols-2 gap-2.5">
                {list.map((m) => {
                  riseIndex += 1;
                  return (
                    <Link
                      key={m.id}
                      href={`/members/${m.id}`}
                      className="card-rise block rounded-2xl border border-ink-700 bg-ink-850 p-3.5 transition-transform active:scale-[0.98]"
                      style={{ animationDelay: `${riseIndex * 60}ms` }}
                    >
                      <div className="flex items-center gap-2.5">
                        <MemberAvatar member={m} size={48} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold text-ink-100">
                            {m.nickname}
                          </div>
                          <span
                            className={`mt-1 inline-block rounded border px-1.5 py-0.5 text-[10px] ${roleStyle[m.role]}`}
                          >
                            {m.role}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2.5 flex items-center gap-2 text-[11px] text-ink-400">
                        <span>{m.class}</span>
                        <span className="text-ink-600">·</span>
                        <span>战力 {m.power.toLocaleString()}</span>
                        <span className="ml-auto flex items-center gap-1">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              m.online ? "bg-emerald-400" : "bg-ink-500"
                            }`}
                          />
                          {m.online ? "在线" : "离线"}
                        </span>
                      </div>

                      <p className="mt-2 text-[12px] leading-relaxed text-ink-400">
                        {m.bio}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
