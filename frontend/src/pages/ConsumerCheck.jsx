import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ScanLine, Search, X } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function ConsumerCheck() {
  const [instrumentId, setInstrumentId] = useState("");
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();
  const scannerRef = useRef(null);

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 10, qrbox: { width: 240, height: 240 } },
      false
    );
    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        const parts = decodedText.split("/scan/");
        const id = parts.length > 1 ? parts[1] : decodedText;
        scanner.clear().catch(() => {});
        navigate(`/scan/${id}`);
      },
      () => {}
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
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(180deg, var(--paper) 0%, #E3E9F3 100%)",
      }}
    >
      <Header />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-[var(--verify-blue)]/10 flex items-center justify-center mx-auto mb-4">
              <ScanLine size={26} className="text-[var(--verify-blue)]" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[var(--ink)] mb-2">
              Check Instrument Status
            </h1>
            <p className="text-sm text-[var(--slate)]">
              Scan the QR code or enter the Instrument ID printed on it.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl border border-ink/5 p-8">
            {!scanning ? (
              <div className="space-y-4">
                <button
                  onClick={() => setScanning(true)}
                  className="w-full bg-[var(--verify-blue)] hover:brightness-110 text-white font-semibold py-3.5 rounded-lg text-sm transition flex items-center justify-center gap-2"
                >
                  <ScanLine size={17} /> Scan QR Code
                </button>

                <div className="flex items-center gap-3 text-xs text-[var(--slate)] py-1">
                  <div className="flex-1 h-px bg-ink/10" />
                  OR
                  <div className="flex-1 h-px bg-ink/10" />
                </div>

                <form onSubmit={handleManualSubmit} className="space-y-3">
                  <input
                    type="text"
                    value={instrumentId}
                    onChange={(e) => setInstrumentId(e.target.value)}
                    placeholder="e.g. MS-2026-00001"
                    className="w-full border border-ink/15 rounded-lg px-4 py-3 text-sm font-mono-data focus:outline-none focus:ring-2 focus:ring-[var(--verify-blue)]"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[var(--paper)] hover:bg-ink/5 text-[var(--ink)] font-semibold py-3.5 rounded-lg text-sm transition flex items-center justify-center gap-2 border border-ink/10"
                  >
                    <Search size={16} /> Check by ID
                  </button>
                </form>
              </div>
            ) : (
              <div>
                <div
                  id="qr-reader"
                  className="rounded-lg overflow-hidden border border-ink/10"
                />
                <button
                  onClick={() => setScanning(false)}
                  className="w-full mt-4 text-sm text-[var(--slate)] hover:text-[var(--ink)] flex items-center justify-center gap-1.5"
                >
                  <X size={14} /> Cancel scan
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
