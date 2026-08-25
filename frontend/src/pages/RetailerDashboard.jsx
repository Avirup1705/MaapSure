import { useEffect, useState } from "react";
import { getAllInstruments } from "../api/instruments";

const statusStyles = {
  valid: "bg-green-100 text-green-700",
  expired: "bg-orange-100 text-orange-700",
  flagged: "bg-red-100 text-red-700",
  tampered: "bg-red-100 text-red-700",
};

function daysUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default function RetailerDashboard() {
  const [instruments, setInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getAllInstruments();
        setInstruments(data);
      } catch (err) {
        setError("Could not load instruments.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Retailer Dashboard
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Track your instruments and upcoming renewals.
        </p>

        {loading && <p className="text-gray-500 text-sm">Loading...</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}

        {!loading && !error && instruments.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500 text-sm">
            No instruments registered yet.
          </div>
        )}

        {!loading && instruments.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
                <tr>
                  <th className="text-left px-4 py-3">Instrument ID</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Location</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="text-left px-4 py-3">Expiry</th>
                  <th className="text-left px-4 py-3">Days Left</th>
                </tr>
              </thead>
              <tbody>
                {instruments.map((inst) => {
                  const days = daysUntil(inst.expiryDate);
                  return (
                    <tr
                      key={inst._id}
                      className="border-t border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 font-medium text-gray-800">
                        {inst.instrumentId}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {inst.type.replace("_", " ")}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {inst.location}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusStyles[inst.status] || ""
                          }`}
                        >
                          {inst.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {new Date(inst.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        {days < 0 ? (
                          <span className="text-red-600 font-medium">
                            Expired
                          </span>
                        ) : days <= 30 ? (
                          <span className="text-orange-600 font-medium">
                            {days} days
                          </span>
                        ) : (
                          <span className="text-gray-600">{days} days</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
