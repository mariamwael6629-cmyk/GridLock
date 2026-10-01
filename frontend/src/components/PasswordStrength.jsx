export default function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
    { label: "Special char", ok: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["#DC2626", "#D97706", "#CA8A04", "#059669"];
  const labels = ["Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div>
      <div style={{ display: "flex", gap: 3, marginBottom: 8 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              background: i < score ? colors[score - 1] : "#E2E8F0",
              transition: "background 0.2s",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: score > 0 ? colors[score - 1] : "#94A3B8",
          }}
        >
          {score > 0 ? labels[score - 1] : "Too weak"}
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          {checks.map((c, i) => (
            <span
              key={i}
              style={{
                fontSize: 11,
                color: c.ok ? "#059669" : "#CBD5E1",
                display: "flex",
                alignItems: "center",
                gap: 3,
              }}
            >
              {c.ok ? "✓" : "·"} {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function isStrongPassword(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[^a-zA-Z0-9]/.test(password)
  );
}
