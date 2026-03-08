export default function Footer({ compact = false }) {
  return (
    <footer className={`${compact ? "mt-6" : "mt-16"} border-t border-zinc-200/70 py-10 shadow-none dark:border-zinc-800`}>
      <div className="shell grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Valley Mountain logo" className="h-12 w-auto bg-transparent object-contain dark:hidden" />
            <img src="/logo2.png" alt="Valley Mountain logo" className="hidden h-12 w-auto bg-transparent object-contain dark:block" />
            <h3 className="font-serif text-3xl">Valley Mountain</h3>
          </div>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Premium wardrobe essentials for modern city life.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Support</p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">support@velor.shop</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">+1 (555) 014-8821</p>
        </div>
        <div>
          <p className="text-sm font-semibold">Address</p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">77 Mercer St, New York, NY</p>
        </div>
      </div>
    </footer>
  );
}

