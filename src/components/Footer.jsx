export default function Footer({ compact = false }) {
  return (
    <footer className={`${compact ? "mt-6" : "mt-16"} border-t border-zinc-200/70 py-10 shadow-none dark:border-zinc-800`}>
      <div className="shell grid grid-cols-3 gap-3 sm:gap-6 md:gap-8">
        <div>
          <div className="flex items-center gap-2 sm:gap-3">
            <img src="/logo.png" alt="Valley Mountain logo" className="h-10 w-auto bg-transparent object-contain sm:h-12 dark:hidden" />
            <img src="/logo2.png" alt="Valley Mountain logo" className="hidden h-10 w-auto bg-transparent object-contain sm:h-12 dark:block" />
            <h3 className="font-serif text-lg leading-[0.9] sm:text-3xl">
              <span className="block">Valley</span>
              <span className="block">Mountain</span>
            </h3>
          </div>
        </div>
        <div>
          <p className="text-[11px] font-semibold sm:text-sm">Support</p>
          <p className="mt-2 text-[11px] sm:text-sm text-zinc-500 dark:text-zinc-400">support@velor.shop</p>
          <p className="text-[11px] sm:text-sm text-zinc-500 dark:text-zinc-400">+1 (555) 014-8821</p>
        </div>
        <div>
          <p className="text-[11px] font-semibold sm:text-sm">Address</p>
          <p className="mt-2 text-[11px] sm:text-sm text-zinc-500 dark:text-zinc-400">77 Mercer St, New York, NY</p>
        </div>
      </div>
    </footer>
  );
}

