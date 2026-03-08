export default function SkeletonCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, idx) => (
        <div key={idx} className="glass-card animate-pulse overflow-hidden">
          <div className="h-64 w-full bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-16 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-32 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </div>
      ))}
    </div>
  );
}
