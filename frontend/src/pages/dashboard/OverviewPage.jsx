import { useEffect, useState } from "react";
import { api } from "../../api/client";
import SecurityScore from "../../components/SecurityScore.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const CARD_STYLE = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 12,
  padding: 20,
};

function StatusDot({ status }) {
  const color = status === "success" ? "#059669" : "#DC2626";
  return (
    <span
      style={{
        display: "inline-block",
        width: 7,
        height: 7,
        borderRadius: "50%",
        background: color,
        flexShrink: 0,
      }}
    />
  );
}

export default function OverviewPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [stats, setStats] = useState(null);
  const [security, setSecurity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getStats(), api.getSecurityScore(), api.getActivity()])
      .then(([statsRes, securityRes, activityRes]) => {
        if (cancelled) return;
        setStats(statsRes);
        setSecurity(securityRes);
        setActivities(activityRes.slice(0, 4));
      })
      .catch((err) => addToast(err.message, "error"))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [addToast]);

  if (loading) return <p style={{ color: "#94A3B8", fontSize: 14 }}>Loading…</p>;

  const statCards = stats
    ? [
        { label: "Active sessions", value: stats.active_sessions, accent: "#4F46E5" },
        { label: "Logins (7 days)", value: stats.login_attempts_7d, accent: "#059669" },
        { label: "Blocked attempts", value: stats.blocked_attempts, accent: "#DC2626" },
        { label: "Trusted devices", value: stats.trusted_devices, accent: "#D97706" },
      ]
    : [];

  const checklist = security
    ? [
        { label: "Two-factor auth", ok: security.two_fa_enabled },
        { label: "Strong password", ok: security.strong_password },
        { label: "Email verified", ok: security.email_verified },
        { label: "Recovery codes", ok: security.has_recovery_codes },
      ]
    : [];

  return (
    <div>
      {/* Page header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: "#0F172A" }}>
          Good to see you, {user?.name?.split(" ")[0]}
        </h1>
        <p style={{ margin: 0, color: "#64748B", fontSize: 14 }}>
          Here's a summary of your account security.
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 12,
          marginBottom: 24,
        }}
      >
        {statCards.map((s, i) => (
          <div key={i} style={CARD_STYLE}>
            <div
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: s.accent,
                letterSpacing: "-0.03em",
                marginBottom: 4,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 13, color: "#64748B" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Two-column: activity + score */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 260px",
          gap: 16,
        }}
      >
        {/* Recent activity */}
        <div style={CARD_STYLE}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#0F172A" }}>Recent activity</h3>
          </div>
          {activities.length === 0 && (
            <p style={{ color: "#94A3B8", fontSize: 13 }}>No activity yet.</p>
          )}
          {activities.map((a) => (
            <div
              key={a.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 0",
                borderBottom: "1px solid #F1F5F9",
              }}
            >
              <StatusDot status={a.status} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A" }}>{a.action}</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {a.device} · {a.location}
                </div>
              </div>
              <span style={{ fontSize: 11, color: "#CBD5E1", flexShrink: 0 }}>
                {new Date(a.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>

        {/* Security score + checklist */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ ...CARD_STYLE, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <SecurityScore score={security?.score ?? 0} />
          </div>
          <div style={CARD_STYLE}>
            <h4 style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: "#0F172A" }}>
              Security checks
            </h4>
            {checklist.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: i < checklist.length - 1 ? "1px solid #F1F5F9" : "none",
                }}
              >
                <span style={{ fontSize: 13, color: "#374151" }}>{r.label}</span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: r.ok ? "#059669" : "#DC2626",
                    letterSpacing: "0.03em",
                  }}
                >
                  {r.ok ? "PASS" : "FAIL"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
