import mongoose from "mongoose";

// A single verification/inspection event — stored as history inside each instrument
const verificationEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    officerName: { type: String, required: true },
    officerId: { type: String, default: "" },
    result: {
      type: String,
      enum: ["verified", "flagged", "tampered", "re-verified"],
      required: true,
    },
    notes: { type: String, default: "" },
    checklist: [
      {
        condition: String,
        passed: Boolean,
      },
    ],
  },
  { _id: false }
);

// A consumer complaint/feedback entry
const feedbackEntrySchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    name: { type: String, default: "Anonymous" },
    contact: { type: String, default: "" },
    message: { type: String, required: true },
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

    // Set by retailer at registration — used for "Existing Retailer" login,
    // stored as a bcrypt hash, never plain text
    retailerPasswordHash: { type: String, default: "" },

    // Who created this record — affects initial status
    registeredBy: {
      type: String,
      enum: ["officer", "retailer"],
      default: "officer",
    },

    // Only relevant when registeredBy === "retailer" and status === "pending"
    expectedVerificationDate: { type: Date },

    verificationDate: { type: Date }, // set once an officer actually verifies
    expiryDate: { type: Date },

    status: {
      type: String,
      enum: ["pending", "valid", "expired", "flagged", "tampered"],
      default: "valid",
    },

    verificationHistory: [verificationEntrySchema],
    feedbackList: [feedbackEntrySchema],

    // Fields the risk engine uses
    complaintCount: { type: Number, default: 0 },
    tamperFlags: { type: Number, default: 0 },
    riskScore: { type: Number, default: 0 },

    qrCodeUrl: { type: String, default: "" },
  },
  { timestamps: true } // auto-adds createdAt / updatedAt
);

const Instrument = mongoose.model("Instrument", instrumentSchema);

export default Instrument;
