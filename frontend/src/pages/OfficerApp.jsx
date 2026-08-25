import { useState } from "react";
import { createInstrument } from "../api/instruments";

const initialForm = {
  instrumentId: "",
  type: "weighing_scale",
  ownerName: "",
  ownerContact: "",
  location: "",
  verificationDate: "",
  expiryDate: "",
  officerName: "",
};

export default function OfficerApp() {
  const [form, setForm] = useState(initialForm);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const data = await createInstrument(form);
      setResult(data);
      setForm(initialForm);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Field Officer — Register Instrument
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Fill in verification details to generate a digital passport.
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-6 space-y-4"
        >
          <Field
            label="Instrument ID"
            name="instrumentId"
            value={form.instrumentId}
            onChange={handleChange}
            placeholder="MS-2026-00002"
          />

          <div>
            <label className="text-sm text-gray-600 block mb-1">
              Instrument Type
            </label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="weighing_scale">Weighing Scale</option>
              <option value="weighbridge">Weighbridge</option>
              <option value="petrol_dispenser">Petrol Dispenser</option>
              <option value="other">Other</option>
            </select>
          </div>

          <Field
            label="Owner Name"
            name="ownerName"
            value={form.ownerName}
            onChange={handleChange}
            placeholder="Sharma General Store"
          />
          <Field
            label="Owner Contact"
            name="ownerContact"
            value={form.ownerContact}
            onChange={handleChange}
            placeholder="9876543210"
          />
          <Field
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="MG Road, Bhubaneswar"
          />
          <Field
            label="Verification Date"
            name="verificationDate"
            type="date"
            value={form.verificationDate}
            onChange={handleChange}
          />
          <Field
            label="Expiry Date"
            name="expiryDate"
            type="date"
            value={form.expiryDate}
            onChange={handleChange}
          />
          <Field
            label="Officer Name"
            name="officerName"
            value={form.officerName}
            onChange={handleChange}
            placeholder="Officer Rakesh"
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition"
          >
            {submitting ? "Registering..." : "Register Instrument"}
          </button>
        </form>

        {result && (
          <div className="bg-white rounded-2xl shadow-sm p-6 mt-4 text-center">
            <p className="text-green-600 font-medium mb-3">
              ✅ Instrument registered successfully
            </p>
            <img
              src={result.qrCodeUrl}
              alt="QR Code"
              className="mx-auto w-40 h-40 border border-gray-100 rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-3">
              Scan this QR or visit{" "}
              <a
                href={`/scan/${result.instrumentId}`}
                className="text-blue-600 underline"
              >
                /scan/{result.instrumentId}
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="text-sm text-gray-600 block mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
