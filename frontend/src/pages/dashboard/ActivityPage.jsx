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
    return () => { cancelled = true; };
  }, [addToast]);

  if (loading) return <p style={{ color: "#94A3B8", fontSize: 14 }}>Loading…</p>;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: "#0F172A" }}>
          Login activity
        </h1>
        <p style={{ margin: 0, color: "#64748B", fontSize: 14 }}>
          All authentication events for your account.
        </p>
      </div>

      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        {/* Table header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 2fr 1.5fr 1.3fr 88px",
            padding: "10px 20px",
            background: "#F8FAFC",
            borderBottom: "1px solid #E2E8F0",
            fontSize: 11,
            fontWeight: 600,
            color: "#94A3B8",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            minWidth: 580,
          }}
        >
          <span>Action</span>
          <span>Device</span>
          <span>Location</span>
          <span>Time</span>
          <span>Status</span>
        </div>

        {activities.length === 0 && (
          <p style={{ color: "#94A3B8", fontSize: 13, padding: "20px" }}>No activity recorded yet.</p>
        )}

        <div style={{ overflowX: "auto" }}>
          {activities.map((a, idx) => (
            <div
              key={a.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1.2fr 2fr 1.5fr 1.3fr 88px",
                padding: "13px 20px",
                borderBottom: idx < activities.length - 1 ? "1px solid #F1F5F9" : "none",
                fontSize: 13,
                alignItems: "center",
                minWidth: 580,
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FAFBFC")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ fontWeight: 500, color: "#0F172A" }}>{a.action}</span>
              <span style={{ color: "#64748B" }}>{a.device}</span>
              <span style={{ color: "#64748B" }}>{a.location}</span>
              <span style={{ color: "#94A3B8", fontSize: 12 }}>{new Date(a.created_at).toLocaleString()}</span>
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: 5,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  textAlign: "center",
                  background: a.status === "success" ? "#ECFDF5" : "#FEF2F2",
                  color: a.status === "success" ? "#059669" : "#DC2626",
                  border: `1px solid ${a.status === "success" ? "#BBF7D0" : "#FECACA"}`,
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
