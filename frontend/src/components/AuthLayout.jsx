import Toast from "./Toast.jsx";

const FEATURES = [
  {
    icon: "01",
    title: "Zero-Trust Architecture",
    desc: "Every request authenticated and verified end-to-end.",
  },
  {
    icon: "02",
    title: "AES-256 Encryption",
    desc: "Industry-standard bcrypt hashing and token security.",
  },
  {
    icon: "03",
    title: "Real-Time Threat Detection",
    desc: "Anomaly detection and account lockout policies.",
  },
];

export default function AuthLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        .auth-left { flex: 0 0 50%; }
        @media (max-width: 860px) { .auth-left { display: none !important; } }
      `}</style>

      <Toast />

      {/* Left brand panel */}
      <div
        className="auth-left"
        style={{
          background: "#0F172A",
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15.5 5.5V12.5L9 16L2.5 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M9 7V11M7 9H11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ color: "#F1F5F9", fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em" }}>
            GridLock
          </span>
        </div>

        {/* Center content */}
        <div style={{ animation: "fadeUp 0.6s ease" }}>
          <p style={{ color: "#64748B", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 16px" }}>
            Account Security Portal
          </p>
          <h1
            style={{
              color: "#F8FAFC",
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              margin: "0 0 40px",
              maxWidth: 360,
            }}
          >
            Enterprise-grade protection for every account.
          </h1>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 340 }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 16,
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontFamily: "monospace",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#4F46E5",
                    marginTop: 2,
                    flexShrink: 0,
                    letterSpacing: "0.05em",
                  }}
                >
                  {f.icon}
                </span>
                <div>
                  <div style={{ color: "#E2E8F0", fontSize: 14, fontWeight: 600, marginBottom: 3 }}>{f.title}</div>
                  <div style={{ color: "#64748B", fontSize: 13, lineHeight: 1.55 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <span style={{ color: "#334155", fontSize: 12 }}>© 2025 GridLock</span>
          <span style={{ color: "#1E293B", fontSize: 12 }}>·</span>
          <span style={{ color: "#334155", fontSize: 12 }}>Privacy</span>
          <span style={{ color: "#1E293B", fontSize: 12 }}>·</span>
          <span style={{ color: "#334155", fontSize: 12 }}>Security</span>
        </div>
      </div>

      {/* Right form panel */}
      <div
        style={{
          flex: 1,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 40px",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 400,
            animation: "fadeUp 0.4s ease",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
