const STAMP_CONFIG = {
  valid: { label: "Valid", icon: "✓", className: "stamp-valid" },
  pending: { label: "Pending", icon: "◷", className: "stamp-pending" },
  expired: { label: "Expired", icon: "!", className: "stamp-pending" },
  flagged: { label: "Flagged", icon: "⚑", className: "stamp-flagged" },
  tampered: { label: "Tampered", icon: "⚠", className: "stamp-tampered" },
};

export default function StatusStamp({ status, size = "normal" }) {
  const cfg = STAMP_CONFIG[status] || STAMP_CONFIG.valid;
  const sizeClass = size === "large" ? "text-sm px-4 py-2" : "";

  return (
    <span className={`stamp ${cfg.className} ${sizeClass}`}>
      <span>{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
