export default function SecurityScore({ score }) {
  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#eab308" : "#ef4444";
  const c = 2 * Math.PI * 40;
  const offset = c - (score / 100) * c;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      <svg width={100} height={100} viewBox="0 0 100 100">
        <circle cx={50} cy={50} r={40} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={8} />
        <circle
          cx={50}
          cy={50}
          r={40}
          fill="none"
          stroke={color}
          strokeWidth={8}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x="50" y="46" textAnchor="middle" fill={color} fontSize="22" fontWeight="700">
          {score}
        </text>
        <text x="50" y="62" textAnchor="middle" fill="#64748b" fontSize="10">
          / 100
        </text>
      </svg>
      <span style={{ fontSize: 12, color: "#94a3b8" }}>Security Score</span>
    </div>
  );
}
