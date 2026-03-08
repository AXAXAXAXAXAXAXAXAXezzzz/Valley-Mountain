export default function EmptyState({ title, description }) {
  return (
    <div className="glass-card p-10 text-center">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  );
}
