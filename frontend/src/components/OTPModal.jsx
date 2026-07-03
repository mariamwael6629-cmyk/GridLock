import { useRef, useState } from "react";

export default function OTPModal({ onVerify, onClose, email }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);

  const handleChange = (i, v) => {
    if (!/^\d?$/.test(v)) return;
    const next = [...otp];
    next[i] = v;
    setOtp(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const handleKey = (i, e) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const handleSubmit = async () => {
    setLoading(true);
    try {
      await onVerify(otp.join(""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.7)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e1b4b)",
          border: "1px solid rgba(139,92,246,0.3)",
          borderRadius: 20,
          padding: 32,
          width: 360,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔐</div>
        <h3 style={{ color: "#f1f5f9", margin: "0 0 8px", fontSize: 20 }}>Two-Factor Authentication</h3>
        <p style={{ color: "#94a3b8", fontSize: 14, margin: "0 0 24px" }}>
          Enter the 6-digit code sent to
          <br />
          <strong style={{ color: "#a78bfa" }}>{email}</strong>
        </p>
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 24 }}>
          {otp.map((d, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              value={d}
              maxLength={1}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKey(i, e)}
              style={{
                width: 44,
                height: 52,
                textAlign: "center",
                fontSize: 22,
                fontWeight: 700,
                background: "rgba(139,92,246,0.1)",
                border: `1px solid ${d ? "#8b5cf6" : "rgba(255,255,255,0.1)"}`,
                borderRadius: 10,
                color: "#f1f5f9",
                outline: "none",
                transition: "all 0.2s",
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 10,
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={otp.join("").length < 6 || loading}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 10,
              background: loading ? "rgba(139,92,246,0.3)" : "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none",
              color: "#fff",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              opacity: otp.join("").length < 6 ? 0.5 : 1,
            }}
          >
            {loading ? "Verifying…" : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}
