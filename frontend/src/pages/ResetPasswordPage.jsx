import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import AuthLayout from "../components/AuthLayout.jsx";
import { FormCard, GlowBtn } from "../components/Buttons.jsx";
import InputField from "../components/InputField.jsx";
import PasswordStrength from "../components/PasswordStrength.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ResetPasswordPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const prefillEmail = location.state?.email || "";

  const [form, setForm] = useState({ email: prefillEmail, code: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!form.email || !form.code || !form.password || !form.confirm)
      return addToast("Please fill in all fields.", "error");
    if (form.password !== form.confirm) return addToast("Passwords do not match.", "error");
    setLoading(true);
    try {
      await api.resetPassword(form);
      addToast("Password reset successfully.", "success");
      navigate("/login");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <FormCard title="Set new password" subtitle="Enter the code from your email and choose a new password">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <InputField
            label="Email address"
            type="email"
            value={form.email}
            onChange={(v) => setForm((p) => ({ ...p, email: v }))}
            placeholder="you@example.com"
            required
          />
          <InputField
            label="Reset code"
            value={form.code}
            onChange={(v) => setForm((p) => ({ ...p, code: v }))}
            placeholder="6-digit code"
            required
          />
          <div>
            <InputField
              label="New password"
              type="password"
              value={form.password}
              onChange={(v) => setForm((p) => ({ ...p, password: v }))}
              placeholder="Min. 8 characters"
              required
            />
            {form.password && (
              <div style={{ marginTop: 8 }}>
                <PasswordStrength password={form.password} />
              </div>
            )}
          </div>
          <InputField
            label="Confirm new password"
            type="password"
            value={form.confirm}
            onChange={(v) => setForm((p) => ({ ...p, confirm: v }))}
            placeholder="Repeat password"
            required
          />
          <GlowBtn onClick={handleResetPassword} loading={loading}>
            Reset password
          </GlowBtn>
        </div>
      </FormCard>
    </AuthLayout>
  );
}
