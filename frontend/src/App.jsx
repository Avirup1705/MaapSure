import { Routes, Route } from "react-router-dom";
import PublicScan from "./pages/PublicScan";

function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800">MaapSure</h1>
        <p className="text-gray-500 mt-2">
          Scan a QR code on a verified instrument to check its status.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scan/:instrumentId" element={<PublicScan />} />
    </Routes>
  );
}
