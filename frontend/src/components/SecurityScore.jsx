export default function SecurityScore({ score }) {
  const color = score >= 80 ? "#059669" : score >= 50 ? "#D97706" : "#DC2626";
  const label = score >= 80 ? "Strong" : score >= 50 ? "Fair" : "Weak";
  const c = 2 * Math.PI * 40;
  const offset = c - (score / 100) * c;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={40} fill="none" stroke="#F1F5F9" strokeWidth={7} />
        <circle
          cx={50}
          cy={50}
          r={40}
          fill="none"
          stroke={color}
          strokeWidth={7}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        <text x="50" y="46" textAnchor="middle" fill="#0F172A" fontSize="20" fontWeight="700" fontFamily="Inter, system-ui, sans-serif">
          {score}
        </text>
        <text x="50" y="62" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="Inter, system-ui, sans-serif">
          / 100
        </text>
      </svg>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 13, fontWeight: 600, color }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: "#94A3B8" }}>Security Score</div>
      </div>
    </div>
  );
}
