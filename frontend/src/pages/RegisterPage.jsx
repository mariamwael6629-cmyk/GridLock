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
      addToast("Account created. Please verify your email.", "success");
      navigate("/verify-email", { state: { email } });
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <FormCard title="Create account" subtitle="Start securing your digital identity today">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <InputField
            label="Full name"
            value={form.name}
            onChange={(v) => setForm((p) => ({ ...p, name: v }))}
            placeholder="Jane Smith"
            required
          />
          <InputField
            label="Email address"
            type="email"
            value={form.email}
            onChange={(v) => setForm((p) => ({ ...p, email: v }))}
            placeholder="you@example.com"
            required
          />
          <div>
            <InputField
              label="Password"
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
            label="Confirm password"
            type="password"
            value={form.confirm}
            onChange={(v) => setForm((p) => ({ ...p, confirm: v }))}
            placeholder="Repeat password"
            required
          />
          <GlowBtn onClick={handleRegister} loading={loading}>
            Create account
          </GlowBtn>
          <p style={{ textAlign: "center", color: "#64748B", fontSize: 13, margin: 0 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#4F46E5", fontWeight: 600, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>
      </FormCard>
    </AuthLayout>
  );
}
