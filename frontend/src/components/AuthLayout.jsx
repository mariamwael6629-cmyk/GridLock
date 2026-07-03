import GeometricBackground from "./GeometricBackground.jsx";
import Toast from "./Toast.jsx";

const FEATURES = [
  { icon: "🔐", title: "Zero-Trust Architecture", desc: "Every request is verified" },
  { icon: "🛡", title: "Military-Grade Encryption", desc: "AES-256 + bcrypt hashing" },
  { icon: "📊", title: "Real-Time Threat Detection", desc: "AI-powered anomaly alerts" },
];

export default function AuthLayout({ children }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexWrap: "wrap", fontFamily: "Inter, system-ui, sans-serif", background: "#020617", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 99px; }
        @media (max-width: 900px) { .gridlock-left-panel { display: none !important; } }
      `}</style>

      <Toast />

      <div
        className="gridlock-left-panel"
        style={{
          flex: "0 0 50%",
          minWidth: 320,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e1b4b 100%)" }} />
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "20%",
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "15%",
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.1) 0%, transparent 70%)",
            animation: "pulse 5s ease-in-out infinite 1s",
          }}
        />
        <GeometricBackground />

        <div style={{ position: "relative", zIndex: 10, textAlign: "center", animation: "fadeIn 0.8s ease" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 80,
              height: 80,
              borderRadius: 24,
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              marginBottom: 28,
              animation: "float 4s ease-in-out infinite",
              boxShadow: "0 0 48px rgba(99,102,241,0.5)",
            }}
          >
            <span style={{ fontSize: 36 }}>⬡</span>
          </div>
          <h1 style={{ margin: "0 0 12px", fontSize: 40, fontWeight: 900, letterSpacing: "-0.04em", color: "#f1f5f9", lineHeight: 1.1 }}>
            GridLock
          </h1>
          <p style={{ color: "#64748b", fontSize: 16, margin: "0 0 40px", lineHeight: 1.6 }}>
            Enterprise-grade security portal.
            <br />
            Your digital fortress awaits.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, textAlign: "left", maxWidth: 300, margin: "0 auto" }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 16px",
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12,
                  backdropFilter: "blur(8px)",
                }}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ color: "#e2e8f0", fontSize: 13, fontWeight: 700 }}>{f.title}</div>
                  <div style={{ color: "#64748b", fontSize: 12 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, minWidth: 320, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", position: "relative", overflowY: "auto" }}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(15,23,42,0.6)", backdropFilter: "blur(32px)" }} />
        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 420, animation: "fadeIn 0.5s ease" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: "36px 32px",
              backdropFilter: "blur(24px)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
