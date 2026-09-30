import { useToast } from "../context/ToastContext.jsx";

export function GlowBtn({ onClick, children, variant = "primary", disabled = false, full = true, loading = false, type = "button" }) {
  const base = {
    width: full ? "100%" : "auto",
    padding: "11px 20px",
    borderRadius: 8,
    fontWeight: 600,
    fontSize: 14,
    cursor: disabled || loading ? "not-allowed" : "pointer",
    transition: "background 0.15s, opacity 0.15s",
    letterSpacing: "-0.01em",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    border: "none",
    outline: "none",
    opacity: disabled ? 0.45 : 1,
  };

  const variants = {
    primary: {
      background: "#4F46E5",
      color: "#FFFFFF",
    },
    danger: {
      background: "#DC2626",
      color: "#FFFFFF",
    },
    ghost: {
      background: "transparent",
      color: "#0F172A",
      border: "1px solid #E2E8F0",
    },
    outline: {
      background: "transparent",
      color: "#4F46E5",
      border: "1px solid #C7D2FE",
    },
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...base, ...variants[variant] }}
      onMouseEnter={(e) => {
        if (disabled || loading) return;
        if (variant === "primary") e.currentTarget.style.background = "#4338CA";
        if (variant === "danger") e.currentTarget.style.background = "#B91C1C";
        if (variant === "ghost") e.currentTarget.style.background = "#F8FAFC";
        if (variant === "outline") e.currentTarget.style.background = "#EEF2FF";
      }}
      onMouseLeave={(e) => {
        if (variant === "primary") e.currentTarget.style.background = "#4F46E5";
        if (variant === "danger") e.currentTarget.style.background = "#DC2626";
        if (variant === "ghost") e.currentTarget.style.background = "transparent";
        if (variant === "outline") e.currentTarget.style.background = "transparent";
      }}
    >
      {loading ? (
        <>
          <span
            style={{
              width: 14,
              height: 14,
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
              flexShrink: 0,
            }}
          />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function SocialBtn({ icon, label }) {
  const { addToast } = useToast();
  return (
    <button
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "10px 8px",
        borderRadius: 8,
        background: "#FFFFFF",
        border: "1px solid #E2E8F0",
        color: "#374151",
        fontSize: 13,
        cursor: "pointer",
        transition: "background 0.15s",
        fontWeight: 500,
        letterSpacing: "-0.01em",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F9FAFB")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
      onClick={() => addToast(`${label} login coming soon.`, "info")}
    >
      <span style={{ fontSize: 14, fontWeight: 700 }}>{icon}</span>
      {label}
    </button>
  );
}

export function FormCard({ children, title, subtitle }) {
  return (
    <div style={{ width: "100%" }}>
      {title && (
        <div style={{ marginBottom: 28 }}>
          <h2
            style={{
              margin: "0 0 6px",
              fontSize: 24,
              fontWeight: 700,
              color: "#0F172A",
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
            }}
          >
            {title}
          </h2>
          {subtitle && (
            <p style={{ margin: 0, color: "#64748B", fontSize: 14, lineHeight: 1.5 }}>{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}
