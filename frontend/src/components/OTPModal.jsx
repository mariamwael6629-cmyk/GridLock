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

  const complete = otp.join("").length === 6;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(15,23,42,0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          background: "#FFFFFF",
          borderRadius: 16,
          padding: "36px 32px",
          width: "100%",
          maxWidth: 380,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 8px 20px rgba(0,0,0,0.08)",
          animation: "fadeUp 0.2s ease",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 24, textAlign: "center" }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              background: "#EEF2FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <rect x="3" y="10" width="16" height="10" rx="2" stroke="#4F46E5" strokeWidth="1.5" />
              <path d="M7 10V7a4 4 0 018 0v3" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="11" cy="15" r="1.5" fill="#4F46E5" />
            </svg>
          </div>
          <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em" }}>
            Two-Factor Verification
          </h3>
          <p style={{ margin: 0, color: "#64748B", fontSize: 13, lineHeight: 1.5 }}>
            Enter the 6-digit code sent to{" "}
            <strong style={{ color: "#0F172A", fontWeight: 600 }}>{email}</strong>
          </p>
        </div>

        {/* OTP inputs */}
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
                fontSize: 20,
                fontWeight: 700,
                background: d ? "#EEF2FF" : "#F8FAFC",
                border: `1.5px solid ${d ? "#4F46E5" : "#E2E8F0"}`,
                borderRadius: 8,
                color: "#0F172A",
                outline: "none",
                transition: "border-color 0.15s, background 0.15s",
                letterSpacing: 0,
              }}
            />
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: 8,
              background: "transparent",
              border: "1px solid #E2E8F0",
              color: "#374151",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!complete || loading}
            style={{
              flex: 1,
              padding: "11px",
              borderRadius: 8,
              background: complete ? "#4F46E5" : "#E0E7FF",
              border: "none",
              color: complete ? "#FFFFFF" : "#A5B4FC",
              cursor: complete ? "pointer" : "not-allowed",
              fontSize: 14,
              fontWeight: 600,
              transition: "background 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading && (
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
            )}
            {loading ? "Verifying…" : "Verify Code"}
          </button>
        </div>
      </div>
    </div>
  );
}
