import { useToast } from "../context/ToastContext.jsx";

export function GlowBtn({ onClick, children, variant = "primary", disabled = false, full = true, loading = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        width: full ? "100%" : "auto",
        padding: "14px 24px",
        borderRadius: 12,
        fontWeight: 700,
        fontSize: 15,
        cursor: disabled || loading ? "not-allowed" : "pointer",
        border: variant === "ghost" ? "1px solid rgba(255,255,255,0.1)" : "none",
        background:
          variant === "primary"
            ? "linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#3b82f6 100%)"
            : variant === "danger"
            ? "linear-gradient(135deg,#ef4444,#dc2626)"
            : "rgba(255,255,255,0.05)",
        color: "#fff",
        opacity: disabled ? 0.5 : 1,
        transition: "all 0.2s",
        boxShadow: variant === "primary" ? "0 4px 24px rgba(99,102,241,0.4)" : "none",
        letterSpacing: "0.02em",
      }}
    >
      {loading && variant === "primary" ? (
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span
            style={{
              width: 16,
              height: 16,
              border: "2px solid rgba(255,255,255,0.3)",
              borderTopColor: "#fff",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
              display: "inline-block",
            }}
          />
          {children}
        </span>
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
        padding: "11px 8px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#cbd5e1",
        fontSize: 13,
        cursor: "pointer",
        transition: "all 0.2s",
        fontWeight: 500,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.08)")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.04)")}
      onClick={() => addToast(`${label} login coming soon.`, "info")}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  );
}

export function FormCard({ children, title, subtitle }) {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      {title && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <div style={{ width: 32, height: 3, borderRadius: 99, background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }} />
            <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#f1f5f9", letterSpacing: "-0.02em" }}>{title}</h2>
          </div>
          {subtitle && <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
}
