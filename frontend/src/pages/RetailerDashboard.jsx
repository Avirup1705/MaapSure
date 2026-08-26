import { useState } from "react";
import {
  registerRetailerInstrument,
  loginRetailer,
  bookVerification,
} from "../api/instruments";

function daysUntil(dateStr) {
  if (!dateStr) return null;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function RetailerDashboard() {
  const [step, setStep] = useState("choice");

  if (step === "choice") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full">
          <h1 className="text-xl font-bold text-gray-800 text-center mb-1">
            Retailer Portal
          </h1>
          <p className="text-sm text-gray-500 text-center mb-6">
            Are you registering a new instrument or checking an existing one?
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setStep("new")}
              className="w-full bg-white hover:shadow-md transition rounded-2xl shadow-sm p-5 text-left border border-gray-100"
            >
              <p className="font-semibold text-gray-800">
                🆕 New Instrument
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Register a new instrument for verification.
              </p>
            </button>
            <button
              onClick={() => setStep("login")}
              className="w-full bg-white hover:shadow-md transition rounded-2xl shadow-sm p-5 text-left border border-gray-100"
            >
              <p className="font-semibold text-gray-800">
                🔑 Existing Instrument
              </p>
              <p className="text-xs text-gray-500 mt-1">
                View status, expiry, and book re-verification.
              </p>
            </button>
          </div>
        </div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm p-6 text-center">
          <p className="text-4xl mb-3">⏳</p>
          <p className="font-semibold text-gray-800 mb-1">
            Instrument registered — pending verification
          </p>
          <p className="text-sm text-gray-500 mb-4">
            An officer will visit around{" "}
            {new Date(result.expectedVerificationDate).toLocaleDateString()}.
          </p>
          {result.qrCodeUrl && (
            <img
              src={result.qrCodeUrl}
              alt="QR Code"
              className="mx-auto w-40 h-40 border border-gray-100 rounded-lg mb-3"
            />
          )}
          <p className="text-xs text-gray-400">
            Instrument ID: {result.instrumentId}
          </p>
          <button
            onClick={onBack}
            className="w-full mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition"
          >
            Back to Retailer Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          Register New Instrument
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          This instrument will be marked pending until an officer verifies it.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
        >
          <Field
            label="Instrument ID"
            name="instrumentId"
            value={form.instrumentId}
            onChange={handleChange}
            placeholder="MS-2026-00010"
          />
          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Instrument Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="weighing_scale">Weighing Scale</option>
              <option value="weighbridge">Weighbridge</option>
              <option value="petrol_dispenser">Petrol Dispenser</option>
              <option value="other">Other</option>
            </select>
          </div>
          <Field
            label="Owner / Retailer Name"
            name="ownerName"
            value={form.ownerName}
            onChange={handleChange}
            placeholder="Sharma General Store"
          />
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
          <Field
            label="Expected Officer Visit Date"
            name="expectedVerificationDate"
            type="date"
            value={form.expectedVerificationDate}
            onChange={handleChange}
          />
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

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition"
          >
            {submitting ? "Registering..." : "Register Instrument"}
          </button>
        </form>
      </div>
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
    return (
      <RetailerInstrumentView instrument={instrument} onBack={onBack} />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          ← Back
        </button>
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Existing Instrument
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Enter your details to view your instrument.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <Field
              label="Instrument ID"
              name="instrumentId"
              value={form.instrumentId}
              onChange={handleChange}
              placeholder="MS-2026-00010"
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
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              {submitting ? "Checking..." : "View Instrument"}
            </button>
          </form>
        </div>
      </div>
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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <button
          onClick={onBack}
          className="text-sm text-gray-500 hover:text-gray-700 mb-3"
        >
          ← Back
        </button>

        {showAlert && (
          <div className="bg-orange-100 text-orange-700 rounded-xl p-3 text-sm mb-4">
            ⚠️{" "}
            {days < 0
              ? "Verification has expired."
              : `Verification is due in ${days} day(s).`}{" "}
            Consider booking re-verification soon.
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
          <h1 className="text-lg font-bold text-gray-800 mb-1">
            {current.instrumentId}
          </h1>
          <Row label="Status" value={current.status} />
          <Row label="Type" value={current.type?.replace("_", " ")} />
          <Row label="Owner" value={current.ownerName} />
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

        <div className="bg-white rounded-2xl shadow-sm p-6 mt-4">
          {!showBookForm ? (
            <button
              onClick={() => setShowBookForm(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              📅 Book Officer Verification
            </button>
          ) : (
            <form onSubmit={handleBook} className="space-y-3">
              <label className="text-sm text-gray-600 block mb-1">
                Preferred Verification Date
              </label>
              <input
                type="date"
                value={bookDate}
                onChange={(e) => setBookDate(e.target.value)}
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                disabled={booking}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition"
              >
                {booking ? "Booking..." : "Confirm Booking"}
              </button>
            </form>
          )}
          {message && (
            <p className="text-sm text-green-600 mt-3 text-center">
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-600 block mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium">{value || "—"}</span>
    </div>
  );
}
