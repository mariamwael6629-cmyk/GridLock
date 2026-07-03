import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import Toast from "../../components/Toast.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const TABS = [
  { path: "/dashboard", label: "Overview", icon: "⬡", end: true },
  { path: "/dashboard/activity", label: "Activity", icon: "⏱" },
  { path: "/dashboard/devices", label: "Devices", icon: "🖥" },
  { path: "/dashboard/security", label: "Security", icon: "🔐" },
  { path: "/dashboard/profile", label: "Profile", icon: "👤" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    addToast("Logged out successfully.", "info");
  };

  const handleLogoutAll = async () => {
    try {
      const res = await api.logoutAllDevices();
      addToast(res.message || "All other sessions terminated.", "success");
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #020617 0%, #0f172a 40%, #1e1b4b 100%)", color: "#f1f5f9", fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        .gridlock-dash-body { display: flex; min-height: calc(100vh - 69px); }
        .gridlock-sidebar { width: 220px; flex-shrink: 0; }
        @media (max-width: 800px) {
          .gridlock-dash-body { flex-direction: column; }
          .gridlock-sidebar { width: 100%; display: flex; overflow-x: auto; padding: 12px 16px !important; gap: 6px; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.05); }
          .gridlock-sidebar button { white-space: nowrap; margin-bottom: 0 !important; }
          .gridlock-sidebar .logout-all { display: none; }
        }
      `}</style>

      <Toast />

      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 100, background: "rgba(2,6,23,0.8)", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>⬡</div>
          <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: "-0.02em" }}>GridLock</span>
          <span style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa", fontSize: 10, padding: "2px 8px", borderRadius: 99, fontWeight: 700, border: "1px solid rgba(139,92,246,0.3)" }}>{user?.role?.toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700 }}>{user?.avatar}</div>
          <button onClick={handleLogout} style={{ padding: "8px 16px", borderRadius: 8, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="gridlock-dash-body">
        <aside className="gridlock-sidebar" style={{ borderRight: "1px solid rgba(255,255,255,0.05)", padding: "24px 16px", background: "rgba(255,255,255,0.01)" }}>
          {TABS.map((t) => (
            <NavLink
              key={t.path}
              to={t.path}
              end={t.end}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                width: "100%",
                padding: "10px 14px",
                borderRadius: 10,
                marginBottom: 4,
                background: isActive ? "rgba(139,92,246,0.15)" : "transparent",
                border: isActive ? "1px solid rgba(139,92,246,0.3)" : "1px solid transparent",
                color: isActive ? "#a78bfa" : "#64748b",
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                textAlign: "left",
                transition: "all 0.2s",
                textDecoration: "none",
              })}
            >
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              {t.label}
            </NavLink>
          ))}
          <div className="logout-all" style={{ paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: 32 }}>
            <button
              onClick={handleLogoutAll}
              style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)", color: "#f87171", cursor: "pointer", fontSize: 13 }}
            >
              <span>⊗</span> Logout All Devices
            </button>
          </div>
        </aside>

        <main style={{ flex: 1, padding: "32px", overflow: "auto", animation: "fadeIn 0.3s ease" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
