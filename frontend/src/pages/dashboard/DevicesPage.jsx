import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { useToast } from "../../context/ToastContext.jsx";

export default function DevicesPage() {
  const { addToast } = useToast();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDevices = () => {
    setLoading(true);
    return api
      .getDevices()
      .then(setDevices)
      .catch((err) => addToast(err.message, "error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = async (device) => {
    try {
      const res = await api.removeDevice(device.id);
      addToast(res.message || `${device.name} removed.`, "success");
      loadDevices();
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  if (loading) return <p style={{ color: "#94A3B8", fontSize: 14 }}>Loading…</p>;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: "#0F172A" }}>
          Trusted devices
        </h1>
        <p style={{ margin: 0, color: "#64748B", fontSize: 14 }}>
          All devices that have accessed your account.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {devices.length === 0 && (
          <p style={{ color: "#94A3B8", fontSize: 13 }}>No devices registered yet.</p>
        )}
        {devices.map((d) => (
          <div
            key={d.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              padding: "16px 20px",
              background: "#FFFFFF",
              border: `1px solid ${d.is_current ? "#C7D2FE" : "#E2E8F0"}`,
              borderRadius: 12,
              transition: "box-shadow 0.15s",
            }}
          >
            {/* Device info */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: d.is_current ? "#EEF2FF" : "#F8FAFC",
                  border: `1px solid ${d.is_current ? "#C7D2FE" : "#E2E8F0"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="1" y="3" width="16" height="10" rx="2" stroke={d.is_current ? "#4F46E5" : "#94A3B8"} strokeWidth="1.25" />
                  <path d="M5 17h8M9 13v4" stroke={d.is_current ? "#4F46E5" : "#94A3B8"} strokeWidth="1.25" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{d.name}</span>
                  {d.is_current && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                        color: "#4F46E5",
                        background: "#EEF2FF",
                        padding: "2px 7px",
                        borderRadius: 4,
                      }}
                    >
                      CURRENT
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "#94A3B8" }}>
                  {[d.browser, d.os, d.location].filter(Boolean).join(" · ")}
                </div>
              </div>
            </div>

            {/* Last active + remove */}
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 12, color: "#94A3B8" }}>
                {new Date(d.last_active).toLocaleDateString()}
              </span>
              {!d.is_current && (
                <button
                  onClick={() => handleRemove(d)}
                  style={{
                    padding: "6px 14px",
                    borderRadius: 7,
                    background: "transparent",
                    border: "1px solid #FECACA",
                    color: "#DC2626",
                    cursor: "pointer",
                    fontSize: 12,
                    fontWeight: 500,
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
