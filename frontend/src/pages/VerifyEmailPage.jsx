import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import AuthLayout from "../components/AuthLayout.jsx";
import { FormCard, GlowBtn } from "../components/Buttons.jsx";
import InputField from "../components/InputField.jsx";
import { useToast } from "../context/ToastContext.jsx";

export default function VerifyEmailPage() {
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!code) return addToast("Enter the verification code.", "error");
    setLoading(true);
    try {
      await api.verifyEmail({ email, code });
      addToast("Email verified!", "success");
      navigate("/login");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <FormCard title="Verify Email" subtitle="One last step to secure your account">
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📧</div>
          <p style={{ color: "#94a3b8", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
            A verification code has been sent to
            <br />
            <strong style={{ color: "#a78bfa" }}>{email || "your email"}</strong>
          </p>
          <div style={{ marginBottom: 16, textAlign: "left" }}>
            <InputField label="Verification Code" value={code} onChange={setCode} placeholder="6-digit code" icon="🔢" required />
          </div>
          <GlowBtn onClick={handleVerify} loading={loading}>
            Verify Email →
          </GlowBtn>
        </div>
      </FormCard>
    </AuthLayout>
  );
}
