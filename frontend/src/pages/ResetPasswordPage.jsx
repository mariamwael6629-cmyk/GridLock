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
    if (!form.email || !form.code || !form.password || !form.confirm) return addToast("Fill in all fields.", "error");
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
      <FormCard title="Reset Password" subtitle="Enter the code from your email">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <InputField label="Email Address" type="email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} placeholder="you@example.com" icon="✉" required />
          <InputField label="Reset Code" value={form.code} onChange={(v) => setForm((p) => ({ ...p, code: v }))} placeholder="Reset code" icon="🔢" required />
          <InputField label="New Password" type="password" value={form.password} onChange={(v) => setForm((p) => ({ ...p, password: v }))} placeholder="New password" icon="🔒" required />
          <PasswordStrength password={form.password} />
          <InputField label="Confirm Password" type="password" value={form.confirm} onChange={(v) => setForm((p) => ({ ...p, confirm: v }))} placeholder="Repeat password" icon="🔑" required />
          <GlowBtn onClick={handleResetPassword} loading={loading}>
            Reset Password →
          </GlowBtn>
        </div>
      </FormCard>
    </AuthLayout>
  );
}
