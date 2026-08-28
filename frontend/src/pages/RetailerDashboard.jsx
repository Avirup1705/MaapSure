import { useState } from "react";
import { Link } from "react-router-dom";
import {
  registerRetailerInstrument,
  loginRetailer,
  bookVerification,
} from "../api/instruments";
import {
  Store,
  PlusCircle,
  KeyRound,
  CalendarClock,
  AlertTriangle,
  Eye,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatusStamp from "../components/StatusStamp";

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function RetailerHero({ title, subtitle }) {
  return (
    <section className="bg-gradient-to-br from-[var(--ink)] via-[#1B2E52] to-[var(--verify-blue)] relative overflow-hidden">
      <div className="absolute inset-0 dot-grid" />
      <div className="max-w-4xl mx-auto px-6 py-14 relative">
        <p className="font-mono-data text-xs text-[var(--saffron)] tracking-widest uppercase mb-3 font-semibold">
          Retailer Portal
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-2">
          {title}
        </h1>
        {subtitle && <p className="text-white/70">{subtitle}</p>}
      </div>
    </section>
  );
}

export default function RetailerDashboard() {
  const [step, setStep] = useState("choice");

  if (step === "choice") {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <RetailerHero title="Register, track, and re-verify your instruments." />
        <main className="flex-1 max-w-2xl w-full mx-auto px-6 -mt-6 pb-16 relative">
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => setStep("new")}
              className="bg-white hover:shadow-xl transition rounded-xl shadow-lg p-6 text-left border border-ink/5"
            >
              <div className="w-11 h-11 rounded-lg bg-[var(--paper)] flex items-center justify-center mb-3">
                <PlusCircle size={20} className="text-[var(--verify-blue)]" />
              </div>
              <p className="font-display font-semibold text-[var(--ink)]">
                Register New
              </p>
              <p className="text-xs text-[var(--slate)] mt-1">
                Add a new instrument for verification.
              </p>
            </button>
            <button
              onClick={() => setStep("login")}
              className="bg-white hover:shadow-xl transition rounded-xl shadow-lg p-6 text-left border border-ink/5"
            >
              <div className="w-11 h-11 rounded-lg bg-[var(--paper)] flex items-center justify-center mb-3">
                <KeyRound size={20} className="text-[var(--saffron)]" />
              </div>
              <p className="font-display font-semibold text-[var(--ink)]">
                My Instruments
              </p>
              <p className="text-xs text-[var(--slate)] mt-1">
                Sign in to view status, expiry, and book re-verification.
              </p>
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (step === "new") {
    return <NewInstrumentForm onBack={() => setStep("choice")} />;
  }

  if (step === "login") {
    return <ExistingLogin onBack={() => setStep("choice")} />;
  }

  return null;
}

function NewInstrumentForm({ onBack }) {
  const [form, setForm] = useState({
    instrumentId: "",
    type: "weighing_scale",
    ownerName: "",
    ownerContact: "",
    location: "",
    expectedVerificationDate: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 4) {
      setError("Password should be at least 4 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const { confirmPassword, ...payload } = form;
      const data = await registerRetailerInstrument(payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <RetailerHero title="Instrument registered." />
        <main className="flex-1 max-w-md w-full mx-auto px-6 -mt-6 pb-16 relative">
          <div className="bg-white rounded-xl shadow-lg border border-ink/5 p-8 text-center">
            <StatusStamp status="pending" size="large" />
            <p className="text-sm text-[var(--slate)] mt-4 mb-4">
              An officer will visit around{" "}
              {new Date(result.expectedVerificationDate).toLocaleDateString()}.
            </p>
            {result.qrCodeUrl && (
              <img
                src={result.qrCodeUrl}
                alt="QR Code"
                className="mx-auto w-40 h-40 border border-ink/10 rounded-lg mb-3"
              />
            )}
            <p className="text-xs font-mono-data text-[var(--slate)]">
              {result.instrumentId}
            </p>
            <button
              onClick={onBack}
              className="w-full mt-5 bg-[var(--paper)] hover:bg-ink/5 border border-ink/10 text-[var(--ink)] font-semibold py-3 rounded-lg text-sm transition"
            >
              Back to Retailer Portal
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
      <RetailerHero title="Register a new instrument" />
      <main className="flex-1 max-w-2xl w-full mx-auto px-6 -mt-6 pb-16 relative">
        <button
          onClick={onBack}
          className="text-sm text-white/80 hover:text-white mb-4"
        >
          ← Back
        </button>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-lg border border-ink/5 p-6 sm:p-8 space-y-4"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[var(--ink)] flex items-center justify-center">
              <PlusCircle size={18} className="text-white" />
            </div>
            <p className="font-display font-semibold text-[var(--ink)]">
              Register a new instrument
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Instrument ID"
              name="instrumentId"
              value={form.instrumentId}
              onChange={handleChange}
              placeholder="MS-2026-00010"
              mono
            />
            <div>
              <label className="text-sm text-[var(--slate)] block mb-1.5">
                Instrument Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-ink/15 rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--verify-blue)]"
              >
                <option value="weighing_scale">Weighing Scale</option>
                <option value="weighbridge">Weighbridge</option>
                <option value="petrol_dispenser">Petrol Dispenser</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <Field
            label="Owner / Retailer Name"
            name="ownerName"
            value={form.ownerName}
            onChange={handleChange}
            placeholder="Sharma General Store"
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Phone Number"
              name="ownerContact"
              value={form.ownerContact}
              onChange={handleChange}
              placeholder="9876543210"
            />
            <Field
              label="Location"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="MG Road, Bhubaneswar"
            />
          </div>
          <Field
            label="Expected Officer Visit Date"
            name="expectedVerificationDate"
            type="date"
            value={form.expectedVerificationDate}
            onChange={handleChange}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Field
              label="Set Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 4 characters"
            />
            <Field
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[var(--status-valid)] hover:brightness-110 disabled:opacity-50 text-white font-semibold py-3.5 rounded-lg text-sm transition"
          >
            {submitting ? "Registering..." : "Register instrument"}
          </button>
          <p className="text-xs text-[var(--slate)] text-center">
            A MaapSure ID and QR code are issued immediately; the instrument
            stays "pending" until an officer verifies it.
          </p>
        </form>
      </main>
      <Footer />
    </div>
  );
}

function ExistingLogin({ onBack }) {
  const [form, setForm] = useState({
    instrumentId: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [instrument, setInstrument] = useState(null);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await loginRetailer(form);
      setInstrument(data);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  if (instrument) {
    return <RetailerInstrumentView instrument={instrument} onBack={onBack} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <RetailerHero title="Sign in to your instrument" />
      <main className="flex-1 max-w-md w-full mx-auto px-6 -mt-6 pb-16 relative">
        <button
          onClick={onBack}
          className="text-sm text-white/80 hover:text-white mb-4"
        >
          ← Back
        </button>
        <div className="bg-white rounded-xl shadow-lg border border-ink/5 p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field
              label="Instrument ID"
              name="instrumentId"
              value={form.instrumentId}
              onChange={handleChange}
              placeholder="MS-2026-00010"
              mono
            />
            <Field
              label="Phone Number"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="9876543210"
            />
            <Field
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[var(--saffron)] hover:brightness-110 disabled:opacity-50 text-[var(--ink)] font-semibold py-3.5 rounded-lg text-sm transition"
            >
              {submitting ? "Checking..." : "View Instrument"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function RetailerInstrumentView({ instrument, onBack }) {
  const [current, setCurrent] = useState(instrument);
  const [booking, setBooking] = useState(false);
  const [bookDate, setBookDate] = useState("");
  const [showBookForm, setShowBookForm] = useState(false);
  const [message, setMessage] = useState("");

  const relevantDate = current.expiryDate || current.expectedVerificationDate;
  const days = daysUntil(relevantDate);
  const showAlert = days !== null && days <= 30;

  async function handleBook(e) {
    e.preventDefault();
    setBooking(true);
    try {
      const updated = await bookVerification(current.instrumentId, bookDate);
      setCurrent(updated);
      setMessage("Verification request booked successfully.");
      setShowBookForm(false);
    } catch (err) {
      setMessage("Could not book verification. Please try again.");
    } finally {
      setBooking(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <RetailerHero
        title={current.ownerName}
        subtitle={`${current.instrumentId} · ${current.location}`}
      />
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 -mt-6 pb-16 relative">
        <button
          onClick={onBack}
          className="text-sm text-white/80 hover:text-white mb-4"
        >
          ← Back
        </button>

        {showAlert && (
          <div className="bg-white border-l-4 border-[var(--status-pending)] rounded-lg p-4 text-sm mb-6 shadow-lg flex items-start gap-3">
            <AlertTriangle
              size={18}
              className="text-[var(--status-pending)] shrink-0 mt-0.5"
            />
            <span className="text-[var(--ink)]">
              {days < 0
                ? "Verification has expired."
                : `Verification is due in ${days} day(s).`}{" "}
              Consider booking re-verification soon.
            </span>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg border border-ink/5 p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <p className="font-mono-data text-sm text-[var(--slate)]">
              {current.instrumentId}
            </p>
            <StatusStamp status={current.status} />
          </div>
          <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm">
            <Row label="Type" value={current.type?.replace("_", " ")} />
            <Row label="Location" value={current.location} />
            {current.status === "pending" ? (
              <Row
                label="Expected Officer Visit"
                value={
                  current.expectedVerificationDate
                    ? new Date(
                        current.expectedVerificationDate
                      ).toLocaleDateString()
                    : "—"
                }
              />
            ) : (
              <>
                <Row
                  label="Last Verified"
                  value={
                    current.verificationDate
                      ? new Date(current.verificationDate).toLocaleDateString()
                      : "—"
                  }
                />
                <Row
                  label="Expiry Date"
                  value={
                    current.expiryDate
                      ? new Date(current.expiryDate).toLocaleDateString()
                      : "—"
                  }
                />
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to={`/scan/${current.instrumentId}`}
            className="bg-white border border-ink/10 hover:shadow-lg text-[var(--ink)] font-semibold text-sm px-5 py-3 rounded-lg transition flex items-center gap-2"
          >
            <Eye size={16} /> View record
          </Link>
          {!showBookForm ? (
            <button
              onClick={() => setShowBookForm(true)}
              className="bg-[var(--ink)] hover:brightness-125 text-white font-semibold text-sm px-5 py-3 rounded-lg transition flex items-center gap-2"
            >
              <CalendarClock size={16} /> Book re-verification
            </button>
          ) : (
            <form
              onSubmit={handleBook}
              className="bg-white rounded-lg border border-ink/10 p-3 flex flex-col sm:flex-row gap-2 items-stretch"
            >
              <input
                type="date"
                value={bookDate}
                onChange={(e) => setBookDate(e.target.value)}
                required
                className="border border-ink/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--verify-blue)]"
              />
              <button
                type="submit"
                disabled={booking}
                className="bg-[var(--verify-blue)] hover:brightness-110 disabled:opacity-50 text-white font-semibold px-4 py-2 rounded-lg text-sm transition"
              >
                {booking ? "Booking..." : "Confirm"}
              </button>
            </form>
          )}
        </div>
        {message && (
          <p className="text-sm text-[var(--status-valid)] mt-3">{message}</p>
        )}
      </main>
      <Footer />
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, type = "text", mono }) {
  return (
    <div>
      <label className="text-sm text-[var(--slate)] block mb-1.5">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
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
    <div className="flex justify-between">
      <span className="text-[var(--slate)]">{label}</span>
      <span className="text-[var(--ink)] font-medium">{value || "—"}</span>
    </div>
  );
}
