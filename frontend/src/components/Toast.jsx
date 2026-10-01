import { useToast } from "../context/ToastContext.jsx";

const TYPE_CONFIG = {
  success: { border: "#059669", icon: "✓", iconBg: "#059669", label: "Success" },
  error: { border: "#DC2626", icon: "✕", iconBg: "#DC2626", label: "Error" },
  info: { border: "#4F46E5", icon: "i", iconBg: "#4F46E5", label: "Info" },
};

export default function Toast() {
  const { toasts } = useToast();

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        pointerEvents: "none",
      }}
    >
      {toasts.map((t) => {
        const cfg = TYPE_CONFIG[t.type] || TYPE_CONFIG.info;
        return (
          <div
            key={t.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 16px",
              background: "#FFFFFF",
              border: "1px solid #E2E8F0",
              borderLeft: `3px solid ${cfg.border}`,
              borderRadius: 8,
              minWidth: 280,
              maxWidth: 360,
              pointerEvents: "all",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
              animation: "fadeUp 0.2s ease",
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: cfg.iconBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 10,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {cfg.icon}
            </div>
            <span style={{ fontSize: 13, color: "#1E293B", fontWeight: 500, lineHeight: 1.4 }}>{t.message}</span>
          </div>
        );
      })}
    </div>
  );
}
