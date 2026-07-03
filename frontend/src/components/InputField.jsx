import { useState } from "react";

export default function InputField({ label, type = "text", value, onChange, placeholder, icon, required, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPass = type === "password";
  const hasValue = value && value.length > 0;

  return (
    <div style={{ position: "relative", marginBottom: 4 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "14px 16px",
          background: "rgba(255,255,255,0.05)",
          border: `1px solid ${focused ? "rgba(139,92,246,0.7)" : "rgba(255,255,255,0.1)"}`,
          borderRadius: 12,
          transition: "all 0.2s",
          boxShadow: focused ? "0 0 0 3px rgba(139,92,246,0.15)" : "none",
        }}
      >
        <span style={{ fontSize: 18, color: focused ? "#a78bfa" : "#64748b", flexShrink: 0 }}>{icon}</span>
        <div style={{ flex: 1, position: "relative" }}>
          <label
            style={{
              position: "absolute",
              left: 0,
              pointerEvents: "none",
              transition: "all 0.2s",
              fontSize: focused || hasValue ? 10 : 14,
              top: focused || hasValue ? -6 : "50%",
              transform: focused || hasValue ? "none" : "translateY(-50%)",
              color: focused ? "#a78bfa" : "#64748b",
              fontWeight: 500,
            }}
          >
            {label}
            {required && " *"}
          </label>
          <input
            type={isPass && showPass ? "text" : type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder={focused ? placeholder : ""}
            autoComplete={autoComplete}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              width: "100%",
              color: "#f1f5f9",
              fontSize: 14,
              paddingTop: focused || hasValue ? 8 : 0,
              paddingBottom: 0,
            }}
          />
        </div>
        {isPass && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", fontSize: 16, padding: 0, flexShrink: 0 }}
          >
            {showPass ? "🙈" : "👁"}
          </button>
        )}
      </div>
    </div>
  );
}
