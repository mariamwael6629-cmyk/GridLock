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
      addToast("Email verified successfully.", "success");
      navigate("/login");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <FormCard title="Verify your email" subtitle="Check your inbox and enter the code below">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Icon */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: "#EEF2FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 4,
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="#4F46E5" strokeWidth="1.5" />
              <path d="M2 8l10 6 10-6" stroke="#4F46E5" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>

          {email && (
            <p style={{ margin: 0, color: "#64748B", fontSize: 13, lineHeight: 1.5 }}>
              A verification code was sent to{" "}
              <strong style={{ color: "#0F172A", fontWeight: 600 }}>{email}</strong>.
            </p>
          )}

          <InputField
            label="Verification code"
            value={code}
            onChange={setCode}
            placeholder="6-digit code"
            required
          />

          <GlowBtn onClick={handleVerify} loading={loading}>
            Verify email
          </GlowBtn>
        </div>
      </FormCard>
    </AuthLayout>
  );
}
