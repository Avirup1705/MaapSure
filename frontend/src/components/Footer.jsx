import { Link } from "react-router-dom";
import { ScanLine } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--ink)] text-white/70 mt-auto">
      <div className="max-w-6xl mx-auto px-6 py-12 grid sm:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded bg-white/10 flex items-center justify-center">
              <ScanLine size={16} />
            </div>
            <span className="font-display font-bold text-white">
              MaapSure
            </span>
          </div>
          <p className="text-sm max-w-sm leading-relaxed">
            MaapSure complements the government's eMaap platform by tracking
            what happens after an instrument is verified — giving every
            scale, weighbridge and dispenser a live digital passport.
          </p>
        </div>
        <div className="sm:text-right">
          <p className="font-mono-data text-xs text-[var(--saffron)] tracking-widest uppercase mb-3">
            Portals
          </p>
          <div className="flex sm:flex-col gap-2 sm:gap-1.5 text-sm">
            <Link to="/consumer" className="hover:text-white">
              Consumer check
            </Link>
            <Link to="/officer" className="hover:text-white">
              Officer verification
            </Link>
            <Link to="/retailer" className="hover:text-white">
              Retailer portal
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6 py-4 text-xs text-white/50">
          Demonstration interface. Records shown are sample data under the
          Legal Metrology Act, 2009.
        </div>
      </div>
    </footer>
  );
}
