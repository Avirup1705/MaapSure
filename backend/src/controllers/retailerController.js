import bcrypt from "bcryptjs";
import Instrument from "../models/Instrument.js";
import { generateInstrumentQR } from "../utils/generateQR.js";

// POST /api/retailer/register
// A retailer registers a new instrument themselves — starts as "pending"
// until a field officer visits and completes the compliance checklist.
export async function registerInstrument(req, res) {
  try {
    const {
      instrumentId,
      type,
      ownerName,
      ownerContact,
      location,
      expectedVerificationDate,
      password,
    } = req.body;

    if (
      !instrumentId ||
      !type ||
      !ownerName ||
      !ownerContact ||
      !location ||
      !expectedVerificationDate ||
      !password
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const existing = await Instrument.findOne({ instrumentId });
    if (existing) {
      return res.status(409).json({ error: "Instrument ID already exists" });
    }

    const retailerPasswordHash = await bcrypt.hash(password, 10);
    const qrCodeUrl = await generateInstrumentQR(instrumentId);

    const instrument = new Instrument({
      instrumentId,
      type,
      ownerName,
      ownerContact,
      location,
      expectedVerificationDate,
      retailerPasswordHash,
      registeredBy: "retailer",
      status: "pending",
      qrCodeUrl,
    });

    await instrument.save();

    const response = instrument.toObject();
    delete response.retailerPasswordHash;
    res.status(201).json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error registering instrument" });
  }
}

// POST /api/retailer/login
// Existing retailer looks up their instrument with phone + instrument ID + password
export async function loginRetailer(req, res) {
  try {
    const { instrumentId, phone, password } = req.body;

    if (!instrumentId || !phone || !password) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const instrument = await Instrument.findOne({ instrumentId });
    if (!instrument) {
      return res.status(404).json({ error: "Instrument not found" });
    }

    if (instrument.ownerContact.trim() !== phone.trim()) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    if (!instrument.retailerPasswordHash) {
      return res.status(401).json({
        error:
          "This instrument has no retailer login set up (registered by an officer).",
      });
    }

    const match = await bcrypt.compare(
      password,
      instrument.retailerPasswordHash
    );
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const response = instrument.toObject();
    delete response.retailerPasswordHash;
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error logging in" });
  }
}

// POST /api/retailer/:instrumentId/book-verification
// Retailer requests an officer visit for re-verification
export async function bookVerification(req, res) {
  try {
    const { instrumentId } = req.params;
    const { requestedDate } = req.body;

    if (!requestedDate) {
      return res.status(400).json({ error: "Requested date is required" });
    }

    const instrument = await Instrument.findOne({ instrumentId });
    if (!instrument) {
      return res.status(404).json({ error: "Instrument not found" });
    }

    instrument.expectedVerificationDate = requestedDate;
    instrument.reverificationRequested = true;
    await instrument.save();

    const response = instrument.toObject();
    delete response.retailerPasswordHash;
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error booking verification" });
  }
}
