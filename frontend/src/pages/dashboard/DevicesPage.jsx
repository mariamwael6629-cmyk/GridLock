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
      addToast(res.message || `${device.name} removed from trusted devices.`, "success");
      loadDevices();
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  if (loading) return <p style={{ color: "#64748b" }}>Loading…</p>;

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800 }}>Trusted Devices</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {devices.length === 0 && <p style={{ color: "#64748b", fontSize: 13 }}>No devices yet.</p>}
        {devices.map((d) => (
          <div
            key={d.id}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 12,
              padding: "20px",
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${d.is_current ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 14,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🖥</div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{d.name}</span>
                  {d.is_current && <span style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e", fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 700 }}>CURRENT</span>}
                </div>
                <div style={{ color: "#64748b", fontSize: 13, marginTop: 2 }}>
                  {d.browser} {d.os && `· ${d.os}`} {d.location && `· ${d.location}`}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ color: "#64748b", fontSize: 13 }}>{new Date(d.last_active).toLocaleString()}</span>
              {!d.is_current && (
                <button
                  onClick={() => handleRemove(d)}
                  style={{ padding: "6px 14px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", cursor: "pointer", fontSize: 13 }}
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
