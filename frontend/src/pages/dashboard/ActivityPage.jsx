import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext.jsx";

export default function ActivityPage() {
  const { addToast } = useToast();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .getActivity()
      .then((res) => !cancelled && setActivities(res))
      .catch((err) => addToast(err.message, "error"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [addToast]);

  if (loading) return <p style={{ color: "#64748b" }}>Loading…</p>;

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800 }}>Login Activity</h2>
      <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr 1fr 80px", gap: 0, padding: "12px 20px", background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.05)", fontSize: 12, color: "#64748b", fontWeight: 600, minWidth: 600, overflowX: "auto" }}>
          <span>ACTION</span>
          <span>DEVICE</span>
          <span>LOCATION</span>
          <span>TIME</span>
          <span>STATUS</span>
        </div>
        {activities.length === 0 && <p style={{ color: "#64748b", fontSize: 13, padding: 20 }}>No activity yet.</p>}
        <div style={{ overflowX: "auto" }}>
          {activities.map((a) => (
            <div key={a.id} style={{ display: "grid", gridTemplateColumns: "1fr 2fr 1.5fr 1fr 80px", gap: 0, padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.03)", fontSize: 14, alignItems: "center", minWidth: 600 }}>
              <span style={{ fontWeight: 600 }}>{a.action}</span>
              <span style={{ color: "#94a3b8" }}>{a.device}</span>
              <span style={{ color: "#94a3b8" }}>{a.location}</span>
              <span style={{ color: "#64748b", fontSize: 12 }}>{new Date(a.created_at).toLocaleString()}</span>
              <span
                style={{
                  padding: "3px 10px",
                  borderRadius: 6,
                  background: a.status === "success" ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  color: a.status === "success" ? "#22c55e" : "#ef4444",
                  fontSize: 12,
                  fontWeight: 600,
                  textAlign: "center",
                }}
              >
                {a.status === "success" ? "OK" : "BLOCKED"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
