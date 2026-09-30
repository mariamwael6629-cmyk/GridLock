import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import AuthLayout from "../components/AuthLayout.jsx";
import { FormCard, GlowBtn } from "../components/Buttons.jsx";
import InputField from "../components/InputField.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function ForgotPasswordPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) return addToast("Please enter your email address.", "error");
    setLoading(true);
    try {
      const res = await api.forgotPassword({ email });
      addToast(res.message || "Reset code sent to your email.", "success");
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <FormCard title="Reset password" subtitle="Enter your email and we'll send you a reset code">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <InputField
            label="Email address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            required
          />
          <GlowBtn onClick={handleForgotPassword} loading={loading}>
            Send reset code
          </GlowBtn>
          <GlowBtn onClick={() => navigate("/login")} variant="ghost">
            Back to sign in
          </GlowBtn>
        </div>
      </FormCard>
    </AuthLayout>
  );
}
