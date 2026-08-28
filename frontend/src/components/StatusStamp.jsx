const STAMP_CONFIG = {
  valid: { label: "Verified & valid", icon: "✓", className: "pill-valid" },
  pending: { label: "Awaiting verification", icon: "◷", className: "pill-pending" },
  expired: { label: "Verification expired", icon: "!", className: "pill-flagged" },
  flagged: { label: "Flagged by consumers", icon: "⚑", className: "pill-flagged" },
  tampered: { label: "Tampered — under review", icon: "⚠", className: "pill-flagged" },
};

export default function StatusStamp({ status, size = "normal" }) {
  const cfg = STAMP_CONFIG[status] || STAMP_CONFIG.valid;
  const sizeClass = size === "large" ? "text-sm px-4 py-1.5" : "";

  return (
    <span className={`pill ${cfg.className} ${sizeClass}`}>
      <span>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
