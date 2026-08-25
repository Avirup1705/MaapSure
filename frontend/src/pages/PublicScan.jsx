import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getInstrumentStatus } from "../api/instruments";

// Maps status to color classes and a human-readable label
const statusConfig = {
  valid: {
    label: "VALID",
    bg: "bg-green-100",
    text: "text-green-700",
    ring: "ring-green-500",
    icon: "✅",
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

          <DetailRow label="Instrument Type" value={instrument.type} />
          <DetailRow label="Owner" value={instrument.ownerName} />
          <DetailRow label="Location" value={instrument.location} />
          <DetailRow
            label="Verified On"
            value={new Date(instrument.verificationDate).toLocaleDateString()}
          />
          <DetailRow
            label="Valid Until"
            value={new Date(instrument.expiryDate).toLocaleDateString()}
          />

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
                    {entry.officerName} on{" "}
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Verified via MaapSure — a public trust layer for weighing instruments
        </p>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-gray-800 font-medium">{value}</span>
    </div>
  );
}
