import QRCode from "qrcode";

/**
 * Generates a QR code (as a base64 data URL) that encodes a scan link
 * for the given instrument ID. In production this would point to your
 * real deployed frontend URL; for local dev we use localhost.
 */
export async function generateInstrumentQR(instrumentId) {
  const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const scanUrl = `${baseUrl}/scan/${instrumentId}`;

  try {
    const qrDataUrl = await QRCode.toDataURL(scanUrl);
    return qrDataUrl; // a base64 image string, directly usable in an <img src="">
  } catch (err) {
    console.error("QR generation failed:", err.message);
    return "";
  }
}
