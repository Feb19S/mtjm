"use client";

import { useCallback, useEffect, useState } from "react";
import type { Activity } from "@/lib/data";

const PLAYER_KEY = "mtjm:player";

export default function ActivitySignup({
  activities,
}: {
  activities: Activity[];
}) {
  const [player, setPlayer] = useState("");
  const [signups, setSignups] = useState<Record<string, string[]>>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 初始化：读昵称 + 拉取报名名单
  useEffect(() => {
    setPlayer(localStorage.getItem(PLAYER_KEY) ?? "");
    fetch("/api/signups")
      .then((r) => r.json())
      .then(setSignups)
      .catch(() => setError("报名名单加载失败，请刷新重试"));
  }, []);

  const toggle = useCallback(
    async (activityId: string) => {
      const name = player.trim();
      if (!name) {
        setError("请先填写你的游戏昵称");
        return;
      }
      setError("");
      localStorage.setItem(PLAYER_KEY, name);
      setLoading(true);
      try {
        const res = await fetch("/api/signups", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activityId, player: name }),
        });
        if (!res.ok) throw new Error();
        setSignups(await res.json());
      } catch {
        setError("报名失败，请重试");
      } finally {
        setLoading(false);
      }
    },
    [player]
  );

  return (
    <div>
      {/* 昵称输入 */}
      <div className="mb-4 rounded-xl border border-ink-700 bg-ink-850 p-3.5">
        <label
          htmlFor="player-name"
          className="text-[11px] text-ink-400"
        >
          你的游戏昵称
        </label>
        <input
          id="player-name"
          value={player}
          onChange={(e) => setPlayer(e.target.value)}
          onBlur={() => {
            const name = player.trim();
            if (name) localStorage.setItem(PLAYER_KEY, name);
          }}
          maxLength={20}
          placeholder="填写后即可报名（如：不过一介凡人）"
          className="mt-1.5 w-full rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-sm text-ink-100 placeholder:text-ink-500 focus:border-gold-500 focus:outline-none"
        />
        {error && <p className="mt-1.5 text-[11px] text-red-400">{error}</p>}
      </div>

      {/* 活动卡片 */}
      <div className="space-y-3">
        {activities.map((a) => {
          const list = signups[a.id] ?? [];
          const mySigned = !!player.trim() && list.includes(player.trim());
          const total = a.joined + list.length;
          const pct = Math.min(100, Math.round((total / a.capacity) * 100));

          return (
            <div
              key={a.id}
              className="overflow-hidden rounded-2xl border border-ink-700 bg-ink-850"
            >
              <div className="flex items-start gap-3 p-4">
                <span
                  className="mt-0.5 h-10 w-1.5 rounded-full"
                  style={{ backgroundColor: a.accent }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-ink-100">
                      {a.name}
                    </h3>
                    <span className="rounded bg-ink-700 px-1.5 py-0.5 text-[10px] text-ink-300">
                      {a.difficulty}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] text-ink-300">{a.desc}</p>
                  <p className="mt-2 text-xs text-ink-400">
                    时间：{a.schedule}
                  </p>
                </div>
              </div>

              {/* 报名进度 + 名单 */}
              <div className="border-t border-ink-700 px-4 py-3">
                <div className="mb-2 flex items-center justify-between text-[11px]">
                  <span className="text-ink-400">已报名</span>
                  <span className="text-ink-200">
                    {total} / {a.capacity} 人
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-700">
                  <div
                    className="h-full rounded-full transition-all duration-200"
                    style={{ width: `${pct}%`, backgroundColor: a.accent }}
                  />
                </div>

                {list.length > 0 && (
                  <div className="mt-2.5 flex flex-wrap gap-1">
                    {list.map((n) => (
                      <span
                        key={n}
                        className="rounded bg-ink-700 px-1.5 py-0.5 text-[10px] text-ink-300"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => toggle(a.id)}
                  disabled={loading}
                  className={`mt-3 w-full rounded-xl py-2.5 text-sm font-medium transition-colors active:opacity-80 disabled:opacity-50 ${
                    mySigned
                      ? "border border-gold-500/50 bg-transparent text-gold-400"
                      : "bg-gold-500 text-ink-950"
                  }`}
                >
                  {mySigned ? "已报名 · 点击取消" : "我要报名"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
