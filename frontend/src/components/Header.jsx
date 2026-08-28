import { Link } from "react-router-dom";
import { ScanLine, CheckCircle2 } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-ink/10 sticky top-0 z-20">
      <div className="bg-[var(--ink)] text-white/80 text-xs">
        <div className="max-w-6xl mx-auto px-6 py-1.5 flex items-center justify-center gap-2">
          <CheckCircle2 size={12} className="text-[var(--saffron)]" />
          <span>A PUBLIC TRUST LAYER FOR THE LEGAL METROLOGY ACT, 2009</span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-[var(--ink)] text-white flex items-center justify-center">
            <ScanLine size={20} />
          </div>
          <div>
            <p className="font-display font-bold text-lg text-[var(--ink)] leading-tight">
              MaapSure
            </p>
            <p className="text-xs text-[var(--slate)] leading-tight">
              Digital passports for measuring instruments
            </p>
          </div>
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
        <Link
          to="/consumer"
          className="bg-[var(--status-valid)] hover:brightness-110 text-white text-sm font-semibold px-4 py-2.5 rounded-lg flex items-center gap-2 transition"
        >
          <ScanLine size={15} /> Verify an instrument
        </Link>
      </div>
    </header>
  );
}
