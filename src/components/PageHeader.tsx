export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="border-b border-ink-700 px-5 pb-4 pt-6">
      <div className="flex items-center gap-2">
        <span className="h-4 w-[3px] rounded-full bg-gold-500" />
        <h1 className="font-serif text-xl font-bold tracking-wide text-ink-100">
          {title}
        </h1>
      </div>
      {subtitle && (
        <p className="mt-1.5 pl-[11px] text-xs text-ink-400">{subtitle}</p>
      )}
    </header>
  );
}
