import Instrument from "../models/Instrument.js";
import { generateInstrumentQR } from "../utils/generateQR.js";

// POST /api/instruments
// Used by field officers to register a newly verified instrument
export async function createInstrument(req, res) {
  try {
    const {
      instrumentId,
      type,
      ownerName,
      ownerContact,
      location,
      verificationDate,
      expiryDate,
      officerName,
    } = req.body;

    // Basic validation — all core fields are required
    if (
      !instrumentId ||
      !type ||
      !ownerName ||
      !ownerContact ||
      !location ||
      !verificationDate ||
      !expiryDate ||
      !officerName
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check for duplicate instrument ID
    const existing = await Instrument.findOne({ instrumentId });
    if (existing) {
      return res.status(409).json({ error: "Instrument ID already exists" });
    }

    const qrCodeUrl = await generateInstrumentQR(instrumentId);

    const instrument = new Instrument({
      instrumentId,
      type,
      ownerName,
      ownerContact,
      location,
      verificationDate,
      expiryDate,
      status: "valid",
      qrCodeUrl,
      verificationHistory: [
        {
          date: verificationDate,
          officerName,
          result: "verified",
          notes: "Initial verification",
        },
      ],
    });

    await instrument.save();
    res.status(201).json(instrument);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error creating instrument" });
  }
}

// GET /api/instruments/:instrumentId
// Public scan endpoint — no login required, this is what the QR code links to
export async function getInstrumentById(req, res) {
  try {
    const { instrumentId } = req.params;
    const instrument = await Instrument.findOne({ instrumentId });

    if (!instrument) {
      return res.status(404).json({ error: "Instrument not found" });
    }

    // Auto-check expiry on every scan — keeps status accurate without a cron job
    if (
      instrument.status === "valid" &&
      new Date(instrument.expiryDate) < new Date()
    ) {
      instrument.status = "expired";
      await instrument.save();
    }

    res.json(instrument);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching instrument" });
  }
}

// GET /api/instruments
// Lists all instruments — powers retailer dashboard and risk dashboard
export async function getAllInstruments(req, res) {
  try {
    const instruments = await Instrument.find().sort({ createdAt: -1 });
    res.json(instruments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching instruments" });
  }
}
