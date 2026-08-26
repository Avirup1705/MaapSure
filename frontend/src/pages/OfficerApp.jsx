import { useState } from "react";
import { getInstrumentStatus, verifyInstrument } from "../api/instruments";

const CHECKLIST_CONDITIONS = [
  "Seal intact",
  "Calibration accurate",
  "Display functional",
  "No physical damage",
  "Location matches registration",
];

export default function OfficerApp() {
  const [step, setStep] = useState("identity"); // identity -> search -> verify -> done
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

  if (step === "identity") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm p-6">
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Officer Identity
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Confirm your identity before accessing instrument records.
          </p>
          <form onSubmit={handleIdentitySubmit} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Officer Name
              </label>
              <input
                type="text"
                value={officer.name}
                onChange={(e) =>
                  setOfficer({ ...officer, name: e.target.value })
                }
                placeholder="Officer Rakesh"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1">
                Officer ID
              </label>
              <input
                type="text"
                value={officer.id}
                onChange={(e) =>
                  setOfficer({ ...officer, id: e.target.value })
                }
                placeholder="OFF-1023"
                required
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (step === "search") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm p-6">
          <p className="text-xs text-gray-400 mb-1">
            Signed in as {officer.name} ({officer.id})
          </p>
          <h1 className="text-xl font-bold text-gray-800 mb-1">
            Find Instrument
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Enter the Instrument ID to begin verification.
          </p>
          <form onSubmit={handleSearchSubmit} className="space-y-3">
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              placeholder="e.g. MS-2026-00001"
              required
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {error && <p className="text-red-600 text-xs">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              {loading ? "Searching..." : "Find Instrument"}
            </button>
          </form>
        </div>
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm p-6 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-semibold text-gray-800 mb-1">
            Verification submitted
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {instrument.instrumentId} has been updated.
          </p>
          <button
            onClick={onDone}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
          >
            Verify Another Instrument
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <p className="text-xs text-gray-400 mb-1">
          Officer: {officer.name} ({officer.id})
        </p>
        <h1 className="text-xl font-bold text-gray-800 mb-4">
          {instrument.instrumentId}
        </h1>

        <div className="bg-white rounded-2xl shadow-sm p-5 mb-4 space-y-1 text-sm">
          <Row label="Type" value={instrument.type?.replace("_", " ")} />
          <Row label="Owner" value={instrument.ownerName} />
          <Row label="Location" value={instrument.location} />
          <Row label="Current Status" value={instrument.status} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-5 space-y-4"
        >
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Compliance Checklist
            </p>
            <div className="space-y-2">
              {checklist.map((item, i) => (
                <label
                  key={item.condition}
                  className="flex items-center gap-2 text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={item.passed}
                    onChange={() => toggleCondition(i)}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  {item.condition}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Next Verification Expiry Date
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Comment (required if any condition failed)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Note any issues found during inspection..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && <p className="text-red-600 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition"
          >
            {submitting ? "Submitting..." : "Submit Verification"}
          </button>
        </form>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium">{value || "—"}</span>
    </div>
  );
}
