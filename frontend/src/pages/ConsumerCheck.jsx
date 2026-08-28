import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Html5QrcodeScanner } from "html5-qrcode";
import { ScanLine, Search, X } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const SAMPLE_IDS = ["MS-2026-00001", "MS-2026-00002", "MS-2026-00003"];

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
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="bg-gradient-to-br from-[var(--ink)] via-[#1B2E52] to-[var(--verify-blue)] relative overflow-hidden flex-1">
        <div className="absolute inset-0 dot-grid" />
        <div className="max-w-2xl mx-auto px-6 py-20 relative text-center">
          <p className="font-mono-data text-xs text-[var(--saffron)] tracking-widest uppercase mb-4 font-semibold">
            Consumer Check
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
            Is this instrument still verified?
          </h1>
          <p className="text-white/70 mb-8">
            Scan the QR code on the scale, or type the Instrument ID printed
            beside it.
          </p>

          {!scanning ? (
            <div className="bg-white/5 border border-[var(--saffron)]/30 rounded-xl p-2 max-w-lg mx-auto">
              <form
                onSubmit={handleManualSubmit}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  value={instrumentId}
                  onChange={(e) => setInstrumentId(e.target.value)}
                  placeholder="e.g. MS-2026-00001"
                  className="flex-1 bg-white/95 rounded-lg px-4 py-3 text-sm font-mono-data focus:outline-none focus:ring-2 focus:ring-[var(--saffron)]"
                />
                <button
                  type="submit"
                  className="bg-[var(--saffron)] hover:brightness-110 text-[var(--ink)] font-semibold text-sm px-5 py-3 rounded-lg flex items-center justify-center gap-2 transition whitespace-nowrap"
                >
                  <Search size={15} /> Check
                </button>
              </form>
            </div>
          ) : (
            <div className="max-w-md mx-auto bg-white rounded-xl p-3">
              <div
                id="qr-reader"
                className="rounded-lg overflow-hidden"
              />
            </div>
          )}

          <button
            onClick={() => setScanning((s) => !s)}
            className="mt-5 text-white/80 hover:text-white text-sm inline-flex items-center gap-1.5"
          >
            {scanning ? (
              <>
                <X size={14} /> Cancel scan
              </>
            ) : (
              <>
                <ScanLine size={14} /> Scan QR code instead
              </>
            )}
          </button>

          {!scanning && (
            <p className="text-white/40 text-xs mt-8">
              Try a sample:{" "}
              {SAMPLE_IDS.map((id, i) => (
                <span key={id}>
                  <button
                    onClick={() => navigate(`/scan/${id}`)}
                    className="underline hover:text-[var(--saffron)]"
                  >
                    {id}
                  </button>
                  {i < SAMPLE_IDS.length - 1 ? "  " : ""}
                </span>
              ))}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
