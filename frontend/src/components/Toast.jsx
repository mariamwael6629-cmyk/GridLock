import { useToast } from "../context/ToastContext.jsx";

export default function Toast() {
  const { toasts } = useToast();
  return (
    <div
      style={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 16px",
            background:
              t.type === "success"
                ? "rgba(16,185,129,0.15)"
                : t.type === "error"
                ? "rgba(239,68,68,0.15)"
                : "rgba(59,130,246,0.15)",
            border: `1px solid ${
              t.type === "success" ? "rgba(16,185,129,0.4)" : t.type === "error" ? "rgba(239,68,68,0.4)" : "rgba(59,130,246,0.4)"
            }`,
            borderRadius: 12,
            backdropFilter: "blur(16px)",
            color: "#f1f5f9",
            fontSize: 14,
            fontWeight: 500,
            minWidth: 280,
            pointerEvents: "all",
            animation: "slideIn 0.3s ease",
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <span style={{ fontSize: 18 }}>{t.type === "success" ? "✓" : t.type === "error" ? "✕" : "ℹ"}</span>
          {t.message}
        </div>
      ))}
    </div>
  );
}
