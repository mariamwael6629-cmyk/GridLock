export default function PasswordStrength({ password }) {
  const checks = [
    { label: "8+ characters", ok: password.length >= 8 },
    { label: "Uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "Number", ok: /\d/.test(password) },
    { label: "Special char", ok: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["#ef4444", "#f97316", "#eab308", "#22c55e"];
  const labels = ["Weak", "Fair", "Good", "Strong"];
  if (!password) return null;
  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 6 }}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: 3,
              borderRadius: 99,
              background: i < score ? colors[score - 1] : "rgba(255,255,255,0.1)",
              transition: "background 0.3s",
            }}
          />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, color: score > 0 ? colors[score - 1] : "#94a3b8" }}>
          {score > 0 ? labels[score - 1] : "Too weak"}
        </span>
        <div style={{ display: "flex", gap: 8 }}>
          {checks.map((c, i) => (
            <span key={i} style={{ fontSize: 10, color: c.ok ? "#22c55e" : "#64748b", display: "flex", alignItems: "center", gap: 3 }}>
              <span>{c.ok ? "✓" : "○"}</span>
              {c.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export function isStrongPassword(password) {
  return password.length >= 8 && /[A-Z]/.test(password) && /\d/.test(password) && /[^a-zA-Z0-9]/.test(password);
}
