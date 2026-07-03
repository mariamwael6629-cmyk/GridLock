import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx";
import VerifyEmailPage from "./pages/VerifyEmailPage.jsx";
import ActivityPage from "./pages/dashboard/ActivityPage.jsx";
import DashboardLayout from "./pages/dashboard/DashboardLayout.jsx";
import DevicesPage from "./pages/dashboard/DevicesPage.jsx";
import OverviewPage from "./pages/dashboard/OverviewPage.jsx";
import ProfilePage from "./pages/dashboard/ProfilePage.jsx";
import SecurityPage from "./pages/dashboard/SecurityPage.jsx";

function RootRedirect() {
  const { user, initializing } = useAuth();
  if (initializing) return null;
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<OverviewPage />} />
        <Route path="activity" element={<ActivityPage />} />
        <Route path="devices" element={<DevicesPage />} />
        <Route path="security" element={<SecurityPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
