import { Routes, Route, Link } from "react-router-dom";
import PublicScan from "./pages/PublicScan";
import OfficerApp from "./pages/OfficerApp";
import ConsumerCheck from "./pages/ConsumerCheck";
import RetailerDashboard from "./pages/RetailerDashboard";

function Home() {
  const roles = [
    {
      title: "Consumer",
      desc: "Check if an instrument is valid, expired, or flagged.",
      icon: "🔍",
      to: "/consumer",
    },
    {
      title: "Field Officer",
      desc: "Register or re-verify an instrument in the field.",
      icon: "🧑‍🔧",
      to: "/officer",
    },
    {
      title: "Retailer",
      desc: "Track your instruments and renewal alerts.",
      icon: "🏪",
      to: "/retailer",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-3">MaapSure</h1>
      <p className="text-gray-600 mb-8 text-center max-w-xl leading-relaxed">
        MaapSure is a real-time field verification and public trust layer for
        weighing and measuring instruments. It complements the government's
        eMaap platform by tracking what happens{" "}
        <span className="font-medium text-gray-800">after</span> an
        instrument is officially verified — giving every instrument a digital
        passport that consumers can check instantly, officers can re-verify
        in the field, and retailers can track for upcoming renewals.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        {roles.map((role) => (
          <Link
            key={role.title}
            to={role.to}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md transition p-6 text-center border border-gray-100"
          >
            <p className="text-4xl mb-3">{role.icon}</p>
            <p className="font-semibold text-gray-800">{role.title}</p>
            <p className="text-xs text-gray-500 mt-1">{role.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scan/:instrumentId" element={<PublicScan />} />
      <Route path="/officer" element={<OfficerApp />} />
      <Route path="/consumer" element={<ConsumerCheck />} />
      <Route path="/retailer" element={<RetailerDashboard />} />
    </Routes>
  );
}
