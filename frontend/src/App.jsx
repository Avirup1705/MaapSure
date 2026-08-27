import { Routes, Route, Link } from "react-router-dom";
import {
  ScanLine,
  ShieldCheck,
  Store,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import PublicScan from "./pages/PublicScan";
import OfficerApp from "./pages/OfficerApp";
import ConsumerCheck from "./pages/ConsumerCheck";
import RetailerDashboard from "./pages/RetailerDashboard";

function UtilityBar() {
  return (
    <div className="bg-[var(--ink)] text-white/80 text-xs">
      <div className="max-w-6xl mx-auto px-6 py-1.5">
        <span>A PUBLIC TRUST LAYER FOR THE LEGAL METROLOGY ACT, 2009</span>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white border-b border-ink/10 sticky top-0 z-20">
      <UtilityBar />
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

function Footer() {
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

function Hero() {
  return (
    <section className="bg-gradient-to-br from-[var(--ink)] via-[#1B2E52] to-[var(--verify-blue)] relative overflow-hidden">
      <div className="absolute inset-0 tick-rule opacity-20" style={{ height: "100%" }} />
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 relative">
        <div className="max-w-2xl">
          <p className="font-mono-data text-xs text-[var(--saffron)] tracking-widest uppercase mb-4 font-semibold">
            Digital Passport for Weighing &amp; Measuring Instruments
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            Every stamp deserves a record that outlives the stamp.
          </h1>
          <p className="text-white/70 leading-relaxed max-w-lg">
            MaapSure complements the government's eMaap platform by tracking
            what happens after an instrument is verified — giving every
            scale, weighbridge, and dispenser a live digital passport.
          </p>
        </div>
      </div>
    </section>
  );
}

function QuickAccessRow() {
  const items = [
    { icon: ScanLine, label: "Consumer Check", to: "/consumer", color: "var(--verify-blue)" },
    { icon: ShieldCheck, label: "Officer Verification", to: "/officer", color: "var(--saffron)" },
    { icon: Store, label: "Retailer Portal", to: "/retailer", color: "var(--status-valid)" },
  ];
  return (
    <section className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.to}
              className="bg-white rounded-lg shadow-lg border border-ink/5 p-4 sm:p-5 flex flex-col items-center text-center gap-2 hover:-translate-y-1 transition-transform"
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <Icon size={20} style={{ color: item.color }} />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-[var(--ink)]">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function RoleDetails() {
  const roles = [
    {
      num: "01",
      icon: ScanLine,
      title: "Consumer",
      color: "var(--verify-blue)",
      desc: "Scan a QR code or enter an Instrument ID to check whether it's valid, pending, expired, or flagged — and report an issue if you spot one.",
      to: "/consumer",
      cta: "Check an instrument",
    },
    {
      num: "02",
      icon: ShieldCheck,
      title: "Field Officer",
      color: "var(--saffron)",
      desc: "Verify your identity, then run any instrument through the 5-point compliance checklist and log the result.",
      to: "/officer",
      cta: "Start verification",
    },
    {
      num: "03",
      icon: Store,
      title: "Retailer",
      color: "var(--status-valid)",
      desc: "Register a new instrument for verification, or log in to track expiry and book your next re-verification visit.",
      to: "/retailer",
      cta: "Manage instruments",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <p className="font-mono-data text-xs text-[var(--seal-gold)] tracking-widest uppercase mb-2 font-semibold">
        Three Portals, One Trust Layer
      </p>
      <h2 className="font-display text-2xl font-bold text-[var(--ink)] mb-8">
        Built for everyone who touches a verified instrument.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Link
              key={role.title}
              to={role.to}
              className="group relative bg-white border border-ink/10 rounded-lg p-6 hover:shadow-xl transition-all flex flex-col overflow-hidden"
              style={{ borderTopWidth: "3px", borderTopColor: role.color }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: `${role.color}15` }}
                >
                  <Icon size={18} style={{ color: role.color }} />
                </div>
                <span className="font-mono-data text-xs text-[var(--slate)] font-semibold">
                  {role.num}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold text-[var(--ink)] mb-2">
                {role.title}
              </h3>
              <p className="text-sm text-[var(--slate)] leading-relaxed mb-6 flex-1">
                {role.desc}
              </p>
              <span
                className="text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all"
                style={{ color: role.color }}
              >
                {role.cta} <ArrowRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <QuickAccessRow />
      <RoleDetails />
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scan/:instrumentId" element={<PublicScan />} />
      <Route path="/officer" element={<OfficerApp />} />
      <Route path="/consumer" element={<ConsumerCheck />} />
      <Route path="/retailer" element={<RetailerDashboard />} />
    </Routes>
  );
}
