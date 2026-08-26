import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function ConsumerCheck() {
  const [instrumentId, setInstrumentId] = useState("");
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 220, height: 220 } },
      false
    );
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        // The QR encodes a full URL like http://<host>:5173/scan/MS-2026-00001
        // Extract just the instrument ID from the end of that URL.
        const parts = decodedText.split("/scan/");
        const id = parts.length > 1 ? parts[1] : decodedText;
        scanner.clear().catch(() => {});
        navigate(`/scan/${id}`);
      },
      () => {
        // fires continuously while no QR is found — ignore, not a real error
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [scanning, navigate]);

  function handleManualSubmit(e) {
    e.preventDefault();
    if (instrumentId.trim()) {
      navigate(`/scan/${instrumentId.trim()}`);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="max-w-sm w-full bg-white rounded-2xl shadow-sm p-6">
        <h1 className="text-xl font-bold text-gray-800 mb-1">
          Check Instrument Status
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Scan the QR code or enter the Instrument ID printed on it.
        </p>

        {!scanning ? (
          <div className="space-y-3">
            <button
              onClick={() => setScanning(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition"
            >
              📷 Scan QR Code
            </button>

            <div className="flex items-center gap-2 text-xs text-gray-400 py-1">
              <div className="flex-1 h-px bg-gray-200" />
              OR
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <form onSubmit={handleManualSubmit} className="space-y-3">
              <input
                type="text"
                value={instrumentId}
                onChange={(e) => setInstrumentId(e.target.value)}
                placeholder="e.g. MS-2026-00001"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="submit"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg text-sm transition"
              >
                Check by ID
              </button>
            </form>
          </div>
        ) : (
          <div>
            <div id="qr-reader" className="rounded-lg overflow-hidden" />
            {scanError && (
              <p className="text-red-600 text-xs mt-2">{scanError}</p>
            )}
            <button
              onClick={() => setScanning(false)}
              className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel scan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
