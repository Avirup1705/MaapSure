import { Routes, Route, Link } from "react-router-dom";
import {
  ScanLine,
  UserCheck,
  Store,
  ArrowRight,
  ShieldCheck,
  FileEdit,
  ClipboardCheck,
  QrCode,
  History,
} from "lucide-react";
import PublicScan from "./pages/PublicScan";
import OfficerApp from "./pages/OfficerApp";
import ConsumerCheck from "./pages/ConsumerCheck";
import RetailerDashboard from "./pages/RetailerDashboard";
import Header from "./components/Header";
import Footer from "./components/Footer";

function PassportPreview() {
  return (
    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono-data text-[10px] text-[var(--slate)] uppercase tracking-wider">
          Digital Passport
        </span>
        <div className="w-9 h-9 rounded-md bg-[var(--ink)] flex items-center justify-center">
          <QrCode size={16} className="text-white" />
        </div>
      </div>
      <p className="font-mono-data text-base text-[var(--ink)] font-semibold mb-3">
        MS-2026-00001
      </p>
      <span className="pill pill-valid mb-4 inline-flex">
        ✓ Verified &amp; valid
      </span>
      <div className="grid grid-cols-2 gap-y-3 text-xs mt-2">
        <div>
          <p className="text-[var(--slate)]">Instrument</p>
          <p className="text-[var(--ink)] font-medium">Weighing Scale</p>
        </div>
        <div>
          <p className="text-[var(--slate)]">Capacity</p>
          <p className="text-[var(--ink)] font-medium">50 kg / 5 g</p>
        </div>
        <div>
          <p className="text-[var(--slate)]">Verified on</p>
          <p className="text-[var(--ink)] font-medium">24 Aug 2026</p>
        </div>
        <div>
          <p className="text-[var(--slate)]">Valid until</p>
          <p className="text-[var(--ink)] font-medium">24 Aug 2027</p>
        </div>
        <div className="col-span-2">
          <p className="text-[var(--slate)]">Officer</p>
          <p className="text-[var(--ink)] font-medium">Officer Rakesh · OFF-1023</p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-ink/10">
        <p className="text-[10px] text-[var(--slate)]">
          Sealed record · appended, never overwritten. Anyone can read it,
          only a credentialled officer can add to it.
        </p>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="bg-gradient-to-br from-[var(--ink)] via-[#1B2E52] to-[var(--verify-blue)] relative overflow-hidden">
      <div className="absolute inset-0 dot-grid" />
      <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center relative">
        <div>
          <span className="inline-flex items-center gap-2 border border-[var(--saffron)]/40 text-[var(--saffron)] text-xs font-mono-data tracking-wider uppercase px-3 py-1.5 rounded-full mb-5">
            <ShieldCheck size={13} /> Complements eMaap · Post-Verification Layer
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white leading-tight mb-5">
            Every stamp deserves a record that{" "}
            <span className="text-[var(--saffron)]">outlives the stamp.</span>
          </h1>
          <p className="text-white/70 leading-relaxed max-w-lg mb-7">
            MaapSure gives every scale, weighbridge, and fuel dispenser a
            live digital passport — so a shopper, an inspector, and a
            shopkeeper are all looking at the same truth.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/consumer"
              className="bg-[var(--saffron)] hover:brightness-110 text-[var(--ink)] font-semibold text-sm px-5 py-3 rounded-lg flex items-center gap-2 transition"
            >
              <ScanLine size={16} /> Check an instrument
            </Link>
            <Link
              to="/officer"
              className="border border-white/25 hover:bg-white/10 text-white font-semibold text-sm px-5 py-3 rounded-lg transition"
            >
              Officer sign-in
            </Link>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <PassportPreview />
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-6xl mx-auto px-6 pb-12 relative grid grid-cols-2 sm:grid-cols-4 gap-8">
        {[
          { num: "2.4L+", label: "Instruments with a live digital passport" },
          { num: "31", label: "Districts with field officers on MaapSure" },
          { num: "94%", label: "Complaints actioned within 7 days" },
          { num: "0", label: "Records ever edited after sealing" },
        ].map((s) => (
          <div key={s.label}>
            <p className="font-display text-3xl font-bold text-[var(--saffron)]">
              {s.num}
            </p>
            <p className="text-xs text-white/60 mt-1 leading-snug">
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PortalsSection() {
  const roles = [
    {
      num: "01",
      icon: QrCode,
      title: "Consumer",
      desc: "Scan a QR code or enter an Instrument ID to check whether it is valid, pending, expired or flagged — and report an issue if you spot one. No login needed.",
      to: "/consumer",
      cta: "Check an instrument",
    },
    {
      num: "02",
      icon: UserCheck,
      title: "Field Officer",
      desc: "Identify yourself, pull up any instrument's existing record, run the 5-point compliance checklist, log observations and submit the verification result.",
      to: "/officer",
      cta: "Start verification",
    },
    {
      num: "03",
      icon: Store,
      title: "Retailer",
      desc: "Register a new instrument, track expiry across your shops, receive reminders before a stamp lapses, and book a re-verification visit.",
      to: "/retailer",
      cta: "Manage instruments",
    },
  ];

  return (
    <section className="max-w-6xl mx-auto px-6 py-16">
      <p className="font-mono-data text-xs text-[var(--seal-gold)] tracking-widest uppercase mb-2 font-semibold">
        Three Portals, One Trust Layer
      </p>
      <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)] mb-8">
        Built for everyone who touches a verified instrument.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <Link
              key={role.title}
              to={role.to}
              className="group bg-white border border-ink/10 rounded-xl p-6 hover:shadow-xl transition-all flex flex-col"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-lg bg-[var(--paper)] flex items-center justify-center">
                  <Icon size={20} className="text-[var(--ink)]" />
                </div>
                <span className="text-xs text-[var(--slate)] font-mono-data">
                  {role.num}
                </span>
              </div>
              <h3 className="font-display text-xl font-semibold text-[var(--ink)] mb-2">
                {role.title}
              </h3>
              <p className="text-sm text-[var(--slate)] leading-relaxed mb-6 flex-1">
                {role.desc}
              </p>
              <span className="text-sm font-medium text-[var(--ink)] flex items-center gap-1 group-hover:gap-2 transition-all">
                {role.cta} <ArrowRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function PassportStepsSection() {
  const steps = [
    {
      icon: FileEdit,
      title: "Registered",
      desc: "The retailer records the instrument, its make, capacity and location — issuing a permanent MaapSure ID.",
    },
    {
      icon: ClipboardCheck,
      title: "Verified",
      desc: "A field officer runs the statutory checklist on-site and seals the result against their officer ID.",
    },
    {
      icon: QrCode,
      title: "Published",
      desc: "A QR code on the instrument opens its live record — status, seal number, officer and expiry date.",
    },
    {
      icon: History,
      title: "Tracked",
      desc: "Every complaint, reminder and re-verification appends to the record. Nothing is ever overwritten.",
    },
  ];

  return (
    <section className="bg-white border-y border-ink/10">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-start">
        <div>
          <p className="font-mono-data text-xs text-[var(--seal-gold)] tracking-widest uppercase mb-3 font-semibold">
            The Digital Passport
          </p>
          <h2 className="font-display text-3xl font-bold text-[var(--ink)] leading-tight mb-4">
            A paper sticker fades. A record shouldn't.
          </h2>
          <p className="text-[var(--slate)] leading-relaxed mb-6">
            eMaap registers and verifies. MaapSure carries that verification
            forward — a tamper-evident life history for each instrument,
            readable by the public and appendable only by credentialled
            officers.
          </p>
          <Link
            to="/retailer"
            className="inline-flex items-center gap-2 bg-[var(--ink)] hover:brightness-125 text-white font-semibold text-sm px-5 py-3 rounded-lg transition"
          >
            Register an instrument <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="border border-ink/10 rounded-xl p-5"
              >
                <div className="w-9 h-9 rounded-md bg-[var(--ink)] flex items-center justify-center mb-3">
                  <Icon size={16} className="text-white" />
                </div>
                <p className="text-xs font-mono-data text-[var(--slate)] mb-1">
                  Step {String(i + 1).padStart(2, "0")}
                </p>
                <p className="font-display font-semibold text-[var(--ink)] mb-1.5">
                  {step.title}
                </p>
                <p className="text-xs text-[var(--slate)] leading-relaxed">
                  {step.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-[var(--ink)] mb-2">
          Suspect a scale? It takes ten seconds.
        </h2>
        <p className="text-[var(--slate)]">
          Scan the QR code on the instrument, or type its ID. No account, no
          app install.
        </p>
      </div>
      <Link
        to="/consumer"
        className="bg-[var(--status-valid)] hover:brightness-110 text-white font-semibold text-sm px-5 py-3.5 rounded-lg flex items-center gap-2 transition whitespace-nowrap"
      >
        <ScanLine size={16} /> Verify now
      </Link>
    </section>
  );
}

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <PortalsSection />
      <PassportStepsSection />
      <CTASection />
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
