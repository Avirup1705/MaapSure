import axios from "axios";

const API_BASE = "http://localhost:5000/api";

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
