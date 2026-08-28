import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInstrumentStatus, submitFeedback } from "../api/instruments";
import { QrCode } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import StatusStamp from "../components/StatusStamp";

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
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-[var(--slate)] text-sm">
            Loading instrument status...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-sm w-full border border-ink/5">
            <p className="text-4xl mb-3">❌</p>
            <p className="text-[var(--ink)] font-medium">{error}</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-12">
        {/* Digital Passport card */}
        <div className="bg-white rounded-xl shadow-lg border border-ink/5 p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono-data text-[10px] text-[var(--slate)] uppercase tracking-wider">
              Digital Passport
            </span>
            <div className="w-10 h-10 rounded-md bg-[var(--ink)] flex items-center justify-center">
              <QrCode size={17} className="text-white" />
            </div>
          </div>
          <p className="font-mono-data text-lg text-[var(--ink)] font-semibold mb-3">
            {instrument.instrumentId}
          </p>
          <StatusStamp status={instrument.status} size="large" />

          <div className="grid sm:grid-cols-2 gap-y-3 gap-x-6 text-sm mt-6 pt-5 border-t border-ink/10">
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
          </div>

          <p className="text-[10px] text-[var(--slate)] mt-5 pt-3 border-t border-ink/10">
            Sealed record · appended, never overwritten. Anyone can read it,
            only a credentialled officer can add to it.
          </p>
        </div>

        <div className="grid md:grid-cols-5 gap-6">
          {/* History */}
          <div className="md:col-span-3 bg-white rounded-xl shadow-lg border border-ink/5 p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-[var(--ink)] mb-3">
              Verification History
            </h2>
            {instrument.verificationHistory?.length > 0 ? (
              <div className="space-y-2">
                {instrument.verificationHistory.map((entry, i) => (
                  <div
                    key={i}
                    className="text-xs bg-[var(--paper)] rounded-lg p-3 text-[var(--slate)]"
                  >
                    <span className="font-medium text-[var(--ink)]">
                      {entry.result}
                    </span>{" "}
                    by {entry.officerName} on {formatDate(entry.date)}
                    {entry.notes && (
                      <p className="mt-1 text-[var(--slate)]">
                        {entry.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--slate)]">
                No verification history yet.
              </p>
            )}
          </div>

          {/* Feedback */}
          <div className="md:col-span-2">
            <FeedbackForm instrumentId={instrument.instrumentId} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-[var(--slate)] shrink-0">{label}</span>
      <span className="text-[var(--ink)] font-medium text-right">
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
    <div className="bg-white rounded-xl shadow-lg border border-ink/5 p-6 sm:p-8 h-full">
      <h2 className="font-display text-lg font-semibold text-[var(--ink)] mb-1">
        Feedback / Complaint
      </h2>
      <p className="text-sm text-[var(--slate)] mb-5">
        Noticed something off about this instrument? Let us know.
      </p>

      {submitted ? (
        <p className="text-[var(--status-valid)] text-sm font-medium">
          ✅ Thank you — your feedback has been recorded.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Your name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--verify-blue)]"
          />
          <input
            type="text"
            placeholder="Contact number (optional)"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--verify-blue)]"
          />
          <textarea
            placeholder="Describe the issue or feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full border border-ink/15 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--verify-blue)]"
          />
          {error && <p className="text-red-600 text-xs">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[var(--ink)] hover:brightness-125 disabled:opacity-50 text-white font-semibold py-3 rounded-lg text-sm transition"
          >
            {submitting ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      )}
    </div>
  );
}
