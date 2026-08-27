import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-white border-b border-ink/10 sticky top-0 z-20">
      <div className="bg-[var(--ink)] text-white/80 text-xs">
        <div className="max-w-6xl mx-auto px-6 py-1.5">
          <span>A PUBLIC TRUST LAYER FOR THE LEGAL METROLOGY ACT, 2009</span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-gradient-to-br from-[var(--ink)] to-[var(--verify-blue)] text-white font-display font-bold flex items-center justify-center text-base">
            M
          </div>
          <span className="font-display font-bold text-xl text-[var(--ink)]">
            MaapSure
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--ink)]">
          <Link to="/consumer" className="hover:text-[var(--verify-blue)]">
            Consumer
          </Link>
          <Link to="/officer" className="hover:text-[var(--verify-blue)]">
            Field Officer
          </Link>
          <Link to="/retailer" className="hover:text-[var(--verify-blue)]">
            Retailer
          </Link>
        </nav>
        <span className="stamp stamp-valid">✓ Verified</span>
      </div>
    </header>
  );
}
