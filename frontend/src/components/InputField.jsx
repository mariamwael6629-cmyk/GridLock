import { useState } from "react";

export default function InputField({ label, type = "text", value, onChange, placeholder, required, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const isPass = type === "password";

  const borderColor = focused ? "#4F46E5" : "#E2E8F0";
  const shadowStyle = focused ? "0 0 0 3px rgba(79,70,229,0.12)" : "none";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {label && (
        <label
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "#374151",
            letterSpacing: "-0.005em",
          }}
        >
          {label}
          {required && <span style={{ color: "#DC2626", marginLeft: 2 }}>*</span>}
        </label>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          background: "#FFFFFF",
          border: `1px solid ${borderColor}`,
          borderRadius: 8,
          transition: "border-color 0.15s, box-shadow 0.15s",
          boxShadow: shadowStyle,
          overflow: "hidden",
        }}
      >
        <input
          type={isPass && showPass ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            padding: "10px 14px",
            fontSize: 14,
            color: "#0F172A",
            letterSpacing: "-0.005em",
          }}
        />
        {isPass && (
          <button
            type="button"
            onClick={() => setShowPass(!showPass)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#94A3B8",
              padding: "0 12px",
              fontSize: 13,
              fontWeight: 500,
              flexShrink: 0,
              letterSpacing: "-0.01em",
            }}
          >
            {showPass ? "Hide" : "Show"}
          </button>
        )}
      </div>
    </div>
  );
}
