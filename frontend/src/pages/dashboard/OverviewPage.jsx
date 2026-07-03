import { useEffect, useState } from "react";
import { api } from "../../api/client";
import SecurityScore from "../../components/SecurityScore.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

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
        setActivities(activityRes.slice(0, 3));
      })
      .catch((err) => addToast(err.message, "error"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [addToast]);

  const statCards = stats
    ? [
        { label: "Active Sessions", value: stats.active_sessions, icon: "📱", color: "#3b82f6" },
        { label: "Login Attempts (7d)", value: stats.login_attempts_7d, icon: "🔓", color: "#22c55e" },
        { label: "Blocked Attempts", value: stats.blocked_attempts, icon: "🛡", color: "#8b5cf6" },
        { label: "Trusted Devices", value: stats.trusted_devices, icon: "💻", color: "#06b6d4" },
      ]
    : [];

  const checklist = security
    ? [
        { label: "2FA Enabled", ok: security.two_fa_enabled },
        { label: "Strong Password", ok: security.strong_password },
        { label: "Email Verified", ok: security.email_verified },
        { label: "Recovery Codes", ok: security.has_recovery_codes },
      ]
    : [];

  if (loading) return <p style={{ color: "#64748b" }}>Loading…</p>;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em" }}>
          Welcome back, {user?.name.split(" ")[0]} 👋
        </h1>
        <p style={{ margin: 0, color: "#64748b", fontSize: 15 }}>Your control center is secure and operational.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))", gap: 16, marginBottom: 32 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: `${s.color}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>Recent Activity</h3>
          {activities.length === 0 && <p style={{ color: "#64748b", fontSize: 13 }}>No activity yet.</p>}
          {activities.map((a) => (
            <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.status === "success" ? "#22c55e" : "#ef4444", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{a.action}</div>
                <div style={{ fontSize: 12, color: "#64748b" }}>
                  {a.device} · {a.location}
                </div>
              </div>
              <span style={{ fontSize: 12, color: "#475569" }}>{new Date(a.created_at).toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <SecurityScore score={security?.score ?? 0} />
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 8 }}>
            {checklist.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 13 }}>
                <span style={{ color: "#94a3b8" }}>{r.label}</span>
                <span style={{ color: r.ok ? "#22c55e" : "#ef4444", fontWeight: 600 }}>{r.ok ? "✓" : "✕"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
