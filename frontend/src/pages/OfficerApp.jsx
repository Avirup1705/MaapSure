import { useState } from "react";
import { getInstrumentStatus, verifyInstrument } from "../api/instruments";
import { UserCheck, ScanLine, CheckCircle2, IdCard } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatusStamp from "../components/StatusStamp";

const CHECKLIST_CONDITIONS = [
  "Seal intact",
  "Calibration accurate",
  "Display functional",
  "No physical damage",
  "Location matches registration",
];

function OfficerHero() {
  return (
    <section className="bg-gradient-to-br from-[var(--ink)] via-[#1B2E52] to-[var(--verify-blue)] relative overflow-hidden">
      <div className="absolute inset-0 dot-grid" />
      <div className="max-w-4xl mx-auto px-6 py-14 relative">
        <p className="font-mono-data text-xs text-[var(--saffron)] tracking-widest uppercase mb-3 font-semibold">
          Field Officer
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
          On-site verification console
        </h1>
        <p className="text-white/70 max-w-xl">
          Every entry is sealed against your officer ID and appended to the
          instrument's permanent record.
        </p>
      </div>
    </section>
  );
}

export default function OfficerApp() {
  const [step, setStep] = useState("identity");
  const [officer, setOfficer] = useState({ name: "", id: "" });
  const [searchId, setSearchId] = useState("");
  const [instrument, setInstrument] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleIdentitySubmit(e) {
    e.preventDefault();
    if (officer.name.trim() && officer.id.trim()) {
      setStep("search");
    }
  }

  async function handleSearchSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await getInstrumentStatus(searchId.trim());
      setInstrument(data);
      setStep("verify");
    } catch (err) {
      setError("Instrument not found. Check the ID and try again.");
    } finally {
      setLoading(false);
    }
  }

  if (step === "identity" || step === "search") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <OfficerHero />
        <main className="flex-1 max-w-2xl w-full mx-auto px-6 -mt-6 pb-16 space-y-4 relative">
          {/* Step 01 */}
          <div className="bg-white rounded-xl shadow-lg border border-ink/5 p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-lg bg-[var(--ink)] flex items-center justify-center shrink-0">
                <IdCard size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-mono-data text-[var(--slate)]">
                  Step 01
                </p>
                <p className="font-display font-semibold text-[var(--ink)]">
                  Identify yourself
                </p>
              </div>
            </div>
            <form
              onSubmit={handleIdentitySubmit}
              className="grid sm:grid-cols-2 gap-4 items-end"
            >
              <Field
                label="Officer name"
                value={officer.name}
                onChange={(v) => setOfficer({ ...officer, name: v })}
                placeholder="R. Deshpande"
              />
              <div className="flex gap-2">
                <div className="flex-1">
                  <Field
                    label="Officer ID"
                    value={officer.id}
                    onChange={(v) => setOfficer({ ...officer, id: v })}
                    placeholder="LM-KA-0471"
                    mono
                  />
                </div>
                <button
                  type="submit"
                  className="bg-[var(--ink)] hover:brightness-125 text-white font-semibold text-sm px-5 py-3 rounded-lg transition h-fit"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>

          {/* Step 02 */}
          <div
            className={`bg-white rounded-xl shadow-lg border border-ink/5 p-6 sm:p-8 ${
              step !== "search" ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-lg bg-[var(--ink)] flex items-center justify-center shrink-0">
                <ScanLine size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-mono-data text-[var(--slate)]">
                  Step 02
                </p>
                <p className="font-display font-semibold text-[var(--ink)]">
                  Scan or enter instrument
                </p>
              </div>
            </div>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="MS-2026-00001"
                disabled={step !== "search"}
                className="flex-1 border border-ink/15 rounded-lg px-4 py-3 text-sm font-mono-data focus:outline-none focus:ring-2 focus:ring-[var(--verify-blue)]"
              />
              <button
                type="submit"
                disabled={loading || step !== "search"}
                className="bg-[var(--saffron)] hover:brightness-110 disabled:opacity-50 text-[var(--ink)] font-semibold text-sm px-5 py-3 rounded-lg transition whitespace-nowrap"
              >
                {loading ? "Searching..." : "Pull record"}
              </button>
            </form>
            {error && <p className="text-red-600 text-xs mt-2">{error}</p>}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (step === "verify") {
    return (
      <VerifyStep
        officer={officer}
        instrument={instrument}
        onDone={() => {
          setStep("search");
          setSearchId("");
          setInstrument(null);
        }}
      />
    );
  }

  return null;
}

function VerifyStep({ officer, instrument, onDone }) {
  const [checklist, setChecklist] = useState(
    CHECKLIST_CONDITIONS.map((condition) => ({ condition, passed: false }))
  );
  const [comment, setComment] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function toggleCondition(index) {
    setChecklist((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, passed: !item.passed } : item
      )
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const allPassed = checklist.every((c) => c.passed);
    if (!allPassed && !comment.trim()) {
      setError("Please add a comment explaining the failed condition(s).");
      return;
    }
    if (!expiryDate) {
      setError("Please set the next verification expiry date.");
      return;
    }

    setSubmitting(true);
    try {
      await verifyInstrument(instrument.instrumentId, {
        officerName: officer.name,
        officerId: officer.id,
        checklist,
        comment,
        expiryDate,
      });
      setSuccess(true);
    } catch (err) {
      setError("Something went wrong submitting the verification.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <OfficerHero />
        <main className="flex-1 max-w-md w-full mx-auto px-6 -mt-6 pb-16 relative">
          <div className="bg-white rounded-xl shadow-lg border border-ink/5 p-8 text-center">
            <CheckCircle2
              size={44}
              className="text-[var(--status-valid)] mx-auto mb-3"
            />
            <p className="font-display font-semibold text-lg text-[var(--ink)] mb-1">
              Verification submitted
            </p>
            <p className="text-sm text-[var(--slate)] mb-6">
              {instrument.instrumentId} has been updated.
            </p>
            <button
              onClick={onDone}
              className="w-full bg-[var(--verify-blue)] hover:brightness-110 text-white font-semibold py-3.5 rounded-lg text-sm transition"
            >
              Verify Another Instrument
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <OfficerHero />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 -mt-6 pb-16 relative">
        <p className="text-xs font-mono-data text-white/80 mb-2">
          Officer: {officer.name} ({officer.id})
        </p>

        <div className="bg-white rounded-xl shadow-lg border border-ink/5 p-8 text-center mb-6">
          <StatusStamp status={instrument.status} size="large" />
          <p className="font-mono-data text-lg text-[var(--ink)] font-semibold mt-4">
            {instrument.instrumentId}
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          <div className="md:col-span-2 bg-white rounded-xl shadow-lg border border-ink/5 p-6 sm:p-8 space-y-3 h-fit">
            <h2 className="font-display text-lg font-semibold text-[var(--ink)] mb-2">
              Instrument
            </h2>
            <Row label="Type" value={instrument.type?.replace("_", " ")} />
            <Row label="Owner" value={instrument.ownerName} />
            <Row label="Location" value={instrument.location} />
          </div>

          <form
            onSubmit={handleSubmit}
            className="md:col-span-3 bg-white rounded-xl shadow-lg border border-ink/5 p-6 sm:p-8 space-y-5"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--ink)] mb-3">
                Compliance Checklist
              </p>
              <div className="space-y-2.5">
                {checklist.map((item, i) => (
                  <label
                    key={item.condition}
                    className="flex items-center gap-2.5 text-sm text-[var(--ink)] bg-[var(--paper)] rounded-lg px-3 py-2.5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={item.passed}
                      onChange={() => toggleCondition(i)}
                      className="w-4 h-4 rounded border-gray-300 accent-[var(--verify-blue)]"
                    />
                    {item.condition}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-[var(--slate)] block mb-1.5">
                Next Verification Expiry Date
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--verify-blue)]"
              />
            </div>

            <div>
              <label className="text-sm text-[var(--slate)] block mb-1.5">
                Comment (required if any condition failed)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Note any issues found during inspection..."
                className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--verify-blue)]"
              />
            </div>

            {error && <p className="text-red-600 text-xs">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--verify-blue)] hover:brightness-110 disabled:opacity-50 text-white font-semibold py-3.5 rounded-lg text-sm transition"
            >
              {submitting ? "Submitting..." : "Submit Verification"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, value, onChange, placeholder, mono }) {
  return (
    <div>
      <label className="text-sm text-[var(--slate)] block mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required
        className={`w-full border border-ink/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--verify-blue)] ${
          mono ? "font-mono-data" : ""
        }`}
      />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[var(--slate)]">{label}</span>
      <span className="text-[var(--ink)] font-medium">{value || "—"}</span>
    </div>
  );
}
