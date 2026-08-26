import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInstrumentStatus, submitFeedback } from "../api/instruments";

// Maps status to color classes and a human-readable label
const statusConfig = {
  valid: {
    label: "VALID",
    bg: "bg-green-100",
    text: "text-green-700",
    ring: "ring-green-500",
    icon: "✅",
  },
  pending: {
    label: "PENDING VERIFICATION",
    bg: "bg-blue-100",
    text: "text-blue-700",
    ring: "ring-blue-500",
    icon: "⏳",
  },
  expired: {
    label: "EXPIRED",
    bg: "bg-orange-100",
    text: "text-orange-700",
    ring: "ring-orange-500",
    icon: "⚠️",
  },
  flagged: {
    label: "FLAGGED",
    bg: "bg-red-100",
    text: "text-red-700",
    ring: "ring-red-500",
    icon: "🚩",
  },
  tampered: {
    label: "TAMPERED",
    bg: "bg-red-100",
    text: "text-red-700",
    ring: "ring-red-500",
    icon: "🚨",
  },
};

function formatDate(d) {
  return d ? new Date(d).toLocaleDateString() : "—";
}

export default function PublicScan() {
  const { instrumentId } = useParams();
  const [instrument, setInstrument] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getInstrumentStatus(instrumentId);
        setInstrument(data);
      } catch (err) {
        setError("Instrument not found. This QR code may be invalid.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [instrumentId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading instrument status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white rounded-2xl shadow-md p-8 text-center max-w-sm w-full">
          <p className="text-4xl mb-3">❌</p>
          <p className="text-gray-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  const cfg = statusConfig[instrument.status] || statusConfig.valid;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Status Banner */}
        <div
          className={`rounded-2xl ${cfg.bg} ring-2 ${cfg.ring} p-6 text-center mb-4 shadow-sm`}
        >
          <p className="text-5xl mb-2">{cfg.icon}</p>
          <p className={`text-2xl font-bold ${cfg.text}`}>{cfg.label}</p>
          <p className="text-sm text-gray-600 mt-1">
            Instrument ID: {instrument.instrumentId}
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Verification Details
          </h2>

          <DetailRow
            label="Instrument Type"
            value={instrument.type?.replace("_", " ")}
          />
          <DetailRow label="Retailer / Owner" value={instrument.ownerName} />
          <DetailRow label="Contact" value={instrument.ownerContact} />
          <DetailRow label="Location" value={instrument.location} />

          {instrument.status === "pending" ? (
            <DetailRow
              label="Expected Officer Visit"
              value={formatDate(instrument.expectedVerificationDate)}
            />
          ) : (
            <>
              <DetailRow
                label="Verified On"
                value={formatDate(instrument.verificationDate)}
              />
              <DetailRow
                label="Valid Until"
                value={formatDate(instrument.expiryDate)}
              />
            </>
          )}

          {instrument.verificationHistory?.length > 0 && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-2">
                Verification History
              </p>
              <div className="space-y-2">
                {instrument.verificationHistory.map((entry, i) => (
                  <div
                    key={i}
                    className="text-xs bg-gray-50 rounded-lg p-2 text-gray-600"
                  >
                    <span className="font-medium">{entry.result}</span> by{" "}
                    {entry.officerName} on {formatDate(entry.date)}
                    {entry.notes && (
                      <p className="mt-1 text-gray-500">{entry.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <FeedbackForm instrumentId={instrument.instrumentId} />

        <p className="text-center text-xs text-gray-400 mt-4">
          Verified via MaapSure — a public trust layer for weighing instruments
        </p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm gap-4">
      <span className="text-gray-500 shrink-0">{label}</span>
      <span className="text-gray-800 font-medium text-right">
        {value || "—"}
      </span>
    </div>
  );
}

function FeedbackForm({ instrumentId }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await submitFeedback(instrumentId, { name, contact, message });
      setSubmitted(true);
      setName("");
      setContact("");
      setMessage("");
    } catch (err) {
      setError("Could not submit feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 mt-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        Feedback / Complaint
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Noticed something off about this instrument? Let us know.
      </p>

      {submitted ? (
        <p className="text-green-600 text-sm font-medium">
          ✅ Thank you — your feedback has been recorded.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="text"
            placeholder="Contact number (optional)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            placeholder="Describe the issue or feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-gray-800 hover:bg-gray-900 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      )}
    </div>
  );
}
