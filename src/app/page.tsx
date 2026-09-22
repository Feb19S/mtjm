import Link from "next/link";
import GalaceanHero from "@/components/GalaceanHero";
import GalaxyGrid from "@/components/GalaxyGrid";
import { clan, members } from "@/lib/data";

export default function HomePage() {
  const leader = members.find((m) => m.role === "大哥") ?? members[0];
  const others = members.filter((m) => m.id !== leader.id);

  return (
    <div className="px-5 pt-8">
      <header className="relative overflow-hidden rounded-2xl border border-ink-700 bg-ink-900 p-6">
        <GalaceanHero />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold-500/10 via-transparent to-ink-950/40" />
        <div className="relative z-10">
          <p className="text-xs tracking-[0.2em] text-gold-500">
            {clan.subtitle}
          </p>
          <h1 className="mt-2 font-serif text-3xl font-bold tracking-wide text-ink-100">
            {clan.name}
          </h1>
          <p className="mt-2 text-sm text-ink-300">{clan.slogan}</p>
        </div>
      </header>

      <GalaxyGrid leader={leader} others={others} />

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
