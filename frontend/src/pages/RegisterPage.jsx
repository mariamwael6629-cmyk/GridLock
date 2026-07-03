import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import AuthLayout from "../components/AuthLayout.jsx";
import { FormCard, GlowBtn } from "../components/Buttons.jsx";
import InputField from "../components/InputField.jsx";
import PasswordStrength from "../components/PasswordStrength.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function RegisterPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const { name, email, password, confirm } = form;
    if (!name || !email || !password || !confirm) return addToast("Please fill in all fields.", "error");
    if (password !== confirm) return addToast("Passwords do not match.", "error");
    if (password.length < 8) return addToast("Password must be at least 8 characters.", "error");

    setLoading(true);
    try {
      await api.register(form);
      addToast("Account created! Please verify your email.", "success");
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <FormCard title="Create Account" subtitle="Join the secure network">
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <InputField label="Full Name" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} placeholder="Alex Mercer" icon="👤" required />
          <InputField label="Email Address" type="email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} placeholder="you@example.com" icon="✉" required />
          <InputField label="Password" type="password" value={form.password} onChange={(v) => setForm((p) => ({ ...p, password: v }))} placeholder="Min. 8 characters" icon="🔒" required />
          <PasswordStrength password={form.password} />
          <InputField label="Confirm Password" type="password" value={form.confirm} onChange={(v) => setForm((p) => ({ ...p, confirm: v }))} placeholder="Repeat password" icon="🔑" required />
          <GlowBtn onClick={handleRegister} loading={loading}>
            Create Secure Account →
          </GlowBtn>
          <p style={{ textAlign: "center", color: "#64748b", fontSize: 13, margin: 0 }}>
            Already registered?{" "}
            <Link to="/login" style={{ background: "none", border: "none", color: "#a78bfa", cursor: "pointer", fontWeight: 700, padding: 0, fontSize: 13, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </FormCard>
    </AuthLayout>
  );
}
