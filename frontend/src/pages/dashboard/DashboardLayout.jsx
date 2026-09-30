import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import Toast from "../../components/Toast.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const TABS = [
  {
    path: "/dashboard",
    label: "Overview",
    end: true,
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
        <rect x="9" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
        <rect x="1" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
        <rect x="9" y="9" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      </svg>
    ),
  },
  {
    path: "/dashboard/activity",
    label: "Activity",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <polyline points="1,10 4,6 7,8 10,4 13,7 15,5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    path: "/dashboard/devices",
    label: "Devices",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1" y="3" width="14" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M5 15h6M8 12v3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    path: "/dashboard/security",
    label: "Security",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 1L13 3.5V8c0 3-2.5 5.5-5 6.5C5.5 13.5 3 11 3 8V3.5L8 1Z" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
        <path d="M5.5 8l2 2 3-3" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    path: "/dashboard/profile",
    label: "Profile",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="5.5" r="2.5" stroke="currentColor" strokeWidth="1.25" />
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    addToast("Signed out successfully.", "info");
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Inter, system-ui, sans-serif",
        background: "#F8FAFC",
        color: "#0F172A",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .dash-body { display: flex; flex: 1; }
        .dash-sidebar { width: 220px; flex-shrink: 0; }
        .dash-nav-link { display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-radius: 7px; margin-bottom: 2px; text-decoration: none; font-size: 13.5px; font-weight: 500; transition: background 0.12s, color 0.12s; color: #94A3B8; }
        .dash-nav-link:hover { background: rgba(255,255,255,0.06); color: #CBD5E1; }
        .dash-nav-link.active { background: rgba(255,255,255,0.1); color: #F1F5F9; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 4px; }
        @media (max-width: 780px) {
          .dash-body { flex-direction: column; }
          .dash-sidebar { width: 100% !important; flex-direction: row !important; overflow-x: auto; padding: 0 16px !important; border-right: none !important; border-bottom: 1px solid rgba(255,255,255,0.08) !important; }
          .dash-sidebar-inner { flex-direction: row; gap: 4px; padding: 10px 0; }
          .sidebar-footer { display: none !important; }
        }
      `}</style>

      <Toast />

      {/* Top navigation bar */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          height: 56,
          background: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          position: "sticky",
          top: 0,
          zIndex: 100,
          flexShrink: 0,
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: 7,
              background: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L15.5 5.5V12.5L9 16L2.5 12.5V5.5L9 2Z" stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M9 7V11M7 9H11" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-0.015em", color: "#0F172A" }}>GridLock</span>
          <span
            style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#4F46E5",
              background: "#EEF2FF",
              padding: "2px 7px",
              borderRadius: 4,
            }}
          >
            {user?.role}
          </span>
        </div>

        {/* Right: avatar + sign out */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "#4F46E5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 700,
              color: "#FFFFFF",
              letterSpacing: "-0.02em",
            }}
          >
            {user?.avatar}
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>{user?.name}</span>
          <button
            onClick={handleLogout}
            style={{
              padding: "6px 14px",
              borderRadius: 7,
              background: "transparent",
              border: "1px solid #E2E8F0",
              color: "#64748B",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              letterSpacing: "-0.01em",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#DC2626"; e.currentTarget.style.color = "#DC2626"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#E2E8F0"; e.currentTarget.style.color = "#64748B"; }}
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="dash-body">
        {/* Sidebar */}
        <aside
          className="dash-sidebar"
          style={{
            background: "#0F172A",
            borderRight: "1px solid rgba(255,255,255,0.06)",
            padding: "20px 12px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="dash-sidebar-inner" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#334155", padding: "0 12px", marginBottom: 8, marginTop: 4 }}>
              Navigation
            </p>
            {TABS.map((t) => (
              <NavLink
                key={t.path}
                to={t.path}
                end={t.end}
                className={({ isActive }) => `dash-nav-link${isActive ? " active" : ""}`}
              >
                {t.icon}
                {t.label}
              </NavLink>
            ))}
          </div>

          {/* Sidebar footer */}
          <div
            className="sidebar-footer"
            style={{ paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: 16 }}
          >
            <button
              onClick={handleLogoutAll}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "8px 12px",
                borderRadius: 7,
                background: "transparent",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#F87171",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 7h6M9 5l2 2-2 2" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 2H3a1 1 0 00-1 1v8a1 1 0 001 1h4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
              </svg>
              Logout all devices
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main
          style={{
            flex: 1,
            padding: "32px 36px",
            overflow: "auto",
            animation: "fadeUp 0.25s ease",
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
