import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import AuthLayout from "../components/AuthLayout.jsx";
import { FormCard, GlowBtn, SocialBtn } from "../components/Buttons.jsx";
import InputField from "../components/InputField.jsx";
import OTPModal from "../components/OTPModal.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function LoginPage() {
  const { addToast } = useToast();
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(null);

  const handleLogin = async () => {
    if (!form.email || !form.password) return addToast("Please fill in all fields.", "error");
    setLoading(true);
    try {
      const res = await api.login(form);
      if (res.requires_2fa) {
        setPendingEmail(res.email);
        setShowOTP(true);
      } else {
        loginWithToken(res.token.access_token, res.token.user);
        addToast(`Welcome back, ${res.token.user.name}!`, "success");
        navigate("/dashboard");
      }
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (code) => {
    try {
      const res = await api.verifyOtp({ email: pendingEmail, code });
      loginWithToken(res.access_token, res.user);
      setShowOTP(false);
      addToast(`Welcome back, ${res.user.name}! 2FA verified.`, "success");
      navigate("/dashboard");
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <AuthLayout>
      {showOTP && <OTPModal onVerify={handleOTPVerify} onClose={() => setShowOTP(false)} email={pendingEmail} />}
      <FormCard title="Security Portal" subtitle="Authenticate to access your control center">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <InputField
            label="Email Address"
            type="email"
            value={form.email}
            onChange={(v) => setForm((p) => ({ ...p, email: v }))}
            placeholder="you@example.com"
            icon="✉"
            required
            autoComplete="email"
          />
          <InputField
            label="Password"
            type="password"
            value={form.password}
            onChange={(v) => setForm((p) => ({ ...p, password: v }))}
            placeholder="••••••••"
            icon="🔒"
            required
            autoComplete="current-password"
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", color: "#94a3b8", fontSize: 13 }}>
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} style={{ accentColor: "#8b5cf6" }} />
              Remember me
            </label>
            <Link to="/forgot-password" style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              Forgot password?
            </Link>
          </div>
          <div style={{ marginTop: 4 }}>
            <GlowBtn onClick={handleLogin} loading={loading}>
              Access Control Center →
            </GlowBtn>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, color: "#334155", fontSize: 12 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            Continue with
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <SocialBtn icon="G" label="Google" />
            <SocialBtn icon="⌥" label="GitHub" />
            <SocialBtn icon="in" label="LinkedIn" />
          </div>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, margin: 0 }}>
            No account?{" "}
            <Link to="/register" style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer", fontWeight: 700, padding: 0, fontSize: 13, textDecoration: "none" }}>
              Register
            </Link>
          </p>
        </div>
      </FormCard>
    </AuthLayout>
  );
}
