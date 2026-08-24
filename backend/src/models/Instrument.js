import mongoose from "mongoose";

// A single verification/inspection event — stored as history inside each instrument
const verificationEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    officerName: { type: String, required: true },
    result: {
      type: String,
      enum: ["verified", "flagged", "tampered", "re-verified"],
      required: true,
    },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const instrumentSchema = new mongoose.Schema(
  {
    instrumentId: {
      type: String,
      required: true,
      unique: true, // this is what gets encoded in the QR code
    },
    type: {
      type: String,
      enum: ["weighing_scale", "weighbridge", "petrol_dispenser", "other"],
      required: true,
    },
    ownerName: { type: String, required: true },
    ownerContact: { type: String, required: true },
    location: { type: String, required: true },

    verificationDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },

    status: {
      type: String,
      enum: ["valid", "expired", "flagged", "tampered"],
      default: "valid",
    },

    verificationHistory: [verificationEntrySchema],

    // Fields the risk engine will use later
    complaintCount: { type: Number, default: 0 },
    tamperFlags: { type: Number, default: 0 },
    riskScore: { type: Number, default: 0 },

    qrCodeUrl: { type: String, default: "" },
  },
  { timestamps: true } // auto-adds createdAt / updatedAt
);

const Instrument = mongoose.model("Instrument", instrumentSchema);

export default Instrument;
