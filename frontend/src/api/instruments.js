import axios from "axios";

// Automatically uses whatever host the page was loaded from —
// works correctly whether accessed via localhost or a network IP (e.g. from a phone)
const API_BASE = `http://${window.location.hostname}:5000/api`;

// Fetches a single instrument's live status — used by the public scan page
export async function getInstrumentStatus(instrumentId) {
  const res = await axios.get(`${API_BASE}/instruments/${instrumentId}`);
  return res.data;
}

// Fetches all instruments — used by dashboards later
export async function getAllInstruments() {
  const res = await axios.get(`${API_BASE}/instruments`);
  return res.data;
}

// Registers a newly verified instrument — used by the officer form
export async function createInstrument(payload) {
  const res = await axios.post(`${API_BASE}/instruments`, payload);
  return res.data;
}

// Fetches instruments ranked by inspection risk — used by the risk dashboard
export async function getRiskRanked() {
  const res = await axios.get(`${API_BASE}/risk/ranked`);
  return res.data;
}

// Submits consumer feedback/complaint for an instrument
export async function submitFeedback(instrumentId, payload) {
  const res = await axios.post(
    `${API_BASE}/instruments/${instrumentId}/feedback`,
    payload
  );
  return res.data;
}

// Officer submits compliance checklist + comment + new expiry date
export async function verifyInstrument(instrumentId, payload) {
  const res = await axios.post(
    `${API_BASE}/instruments/${instrumentId}/verify`,
    payload
  );
  return res.data;
}
