export default function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-white/70 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-white/10 flex items-center justify-center font-display font-bold text-sm">
            M
          </div>
          <span className="font-display font-semibold text-white">
            MaapSure
          </span>
        </div>
        <span className="text-xs">
          Built to complement eMaap, not replace it — a field verification
          layer for the Legal Metrology Act, 2009.
        </span>
      </div>
    </footer>
  );
}
