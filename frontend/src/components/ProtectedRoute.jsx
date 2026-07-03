import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#020617", color: "#64748b", fontFamily: "Inter, system-ui, sans-serif" }}>
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
