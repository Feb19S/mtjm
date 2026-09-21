import PageHeader from "@/components/PageHeader";
import ActivitySignup from "@/components/ActivitySignup";
import { activities } from "@/lib/data";

const weekSchedule = [
  { day: "周一", items: [] as string[] },
  { day: "周二", items: [] },
  { day: "周三", items: ["五人本 20:00"] },
  { day: "周四", items: [] },
  { day: "周五", items: ["十人本 21:00"] },
  { day: "周六", items: ["五人本 20:00"] },
  { day: "周日", items: ["爬塔集中"] },
];

export default function ActivitiesPage() {
  return (
    <div>
      <PageHeader
        title="活动"
        subtitle="百业周常排期 · 报名与进度一览"
      />

      <div className="px-5 pt-5">
        {/* 活动卡片（可报名） */}
        <ActivitySignup activities={activities} />

        {/* 周排期 */}
        <h2 className="mb-3 mt-7 flex items-center gap-2 text-sm font-medium text-ink-200">
          <span className="h-3.5 w-[3px] rounded-full bg-gold-500" />
          本周排期
        </h2>
        <div className="overflow-hidden rounded-xl border border-ink-700 bg-ink-850">
          {weekSchedule.map((d, i) => (
            <div
              key={d.day}
              className={`flex items-center gap-3 px-4 py-2.5 ${
                i !== 0 ? "border-t border-ink-800" : ""
              }`}
            >
              <span className="w-10 shrink-0 text-xs text-ink-400">{d.day}</span>
              <div className="flex flex-1 flex-wrap gap-1.5">
                {d.items.length ? (
                  d.items.map((it) => (
                    <span
                      key={it}
                      className="rounded-md border border-gold-500/30 bg-gold-500/10 px-2 py-0.5 text-[11px] text-gold-400"
                    >
                      {it}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] text-ink-600">—</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 报名说明 */}
        <div className="mt-5 rounded-xl border border-ink-700 bg-ink-850 p-4">
          <h4 className="text-xs font-medium text-ink-300">报名须知</h4>
          <ul className="mt-2 space-y-1.5 text-[12px] leading-relaxed text-ink-400">
            <li>· 每周一在群内发报名表，周五 18:00 截止</li>
            <li>· 报名后请准时到场，临时有事提前请假</li>
            <li>· 十人本需 T 奶齐全，战力不足可找大哥带</li>
            <li>· 爬塔不强制，随缘参与，记录个人层数</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
