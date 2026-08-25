import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ConsumerCheck() {
  const [instrumentId, setInstrumentId] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (instrumentId.trim()) {
      navigate(`/scan/${instrumentId.trim()}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          Check Instrument Status
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Enter the Instrument ID printed near the QR code.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={instrumentId}
            onChange={(e) => setInstrumentId(e.target.value)}
            placeholder="e.g. MS-2026-00001"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
          >
            Check Status
          </button>
        </form>
      </div>
    </div>
  );
}
