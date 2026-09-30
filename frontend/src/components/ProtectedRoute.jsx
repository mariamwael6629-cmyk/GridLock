import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();

  if (initializing) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F8FAFC",
          color: "#94A3B8",
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 14,
        }}
      >
        Loading…
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
