import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { GlowBtn } from "../../components/Buttons.jsx";
import InputField from "../../components/InputField.jsx";
import PasswordStrength from "../../components/PasswordStrength.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const CARD = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 12,
  padding: 24,
};

export default function SecurityPage() {
  const { addToast } = useToast();
  const [security, setSecurity] = useState(null);
  const [changePassForm, setChangePassForm] = useState({ current: "", newPass: "", confirm: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.getSecurityScore().then(setSecurity).catch((err) => addToast(err.message, "error"));
  }, [addToast]);

  const handleChangePassword = async () => {
    const { current, newPass, confirm } = changePassForm;
    if (!current || !newPass || !confirm) return addToast("Please fill in all fields.", "error");
    if (newPass !== confirm) return addToast("Passwords do not match.", "error");
    setSaving(true);
    try {
      const res = await api.changePassword({ current, newPassword: newPass, confirm });
      addToast(res.message || "Password updated successfully.", "success");
      setChangePassForm({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const recommendations = [
    { text: "Set up recovery codes", done: security?.has_recovery_codes ?? false },
    { text: "Verify your email address", done: security?.email_verified ?? false },
    { text: "Review active sessions", done: true },
  ];

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: "#0F172A" }}>
          Security settings
        </h1>
        <p style={{ margin: 0, color: "#64748B", fontSize: 14 }}>
          Manage your password and two-factor authentication.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* Change password */}
        <div style={CARD}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: "#0F172A" }}>Change password</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <InputField
              label="Current password"
              type="password"
              value={changePassForm.current}
              onChange={(v) => setChangePassForm((p) => ({ ...p, current: v }))}
              placeholder="Current password"
            />
            <div>
              <InputField
                label="New password"
                type="password"
                value={changePassForm.newPass}
                onChange={(v) => setChangePassForm((p) => ({ ...p, newPass: v }))}
                placeholder="New password"
              />
              {changePassForm.newPass && (
                <div style={{ marginTop: 8 }}>
                  <PasswordStrength password={changePassForm.newPass} />
                </div>
              )}
            </div>
            <InputField
              label="Confirm new password"
              type="password"
              value={changePassForm.confirm}
              onChange={(v) => setChangePassForm((p) => ({ ...p, confirm: v }))}
              placeholder="Repeat new password"
            />
            <GlowBtn onClick={handleChangePassword} loading={saving}>
              Update password
            </GlowBtn>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {/* 2FA */}
          <div style={CARD}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#0F172A" }}>Two-factor auth</h3>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  padding: "3px 9px",
                  borderRadius: 5,
                  background: security?.two_fa_enabled ? "#ECFDF5" : "#FEF2F2",
                  color: security?.two_fa_enabled ? "#059669" : "#DC2626",
                  border: `1px solid ${security?.two_fa_enabled ? "#BBF7D0" : "#FECACA"}`,
                }}
              >
                {security?.two_fa_enabled ? "ENABLED" : "DISABLED"}
              </span>
            </div>
            <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 16px", lineHeight: 1.5 }}>
              {security?.two_fa_enabled
                ? "Your account is protected with two-factor authentication."
                : "Enable 2FA to add an extra layer of protection to your account."}
            </p>
            <GlowBtn onClick={() => addToast("2FA management coming soon.", "info")} variant="outline" full={false}>
              Manage 2FA
            </GlowBtn>
          </div>

          {/* Recommendations */}
          <div style={CARD}>
            <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 600, color: "#0F172A" }}>
              Recommendations
            </h3>
            {recommendations.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 0",
                  borderBottom: i < recommendations.length - 1 ? "1px solid #F1F5F9" : "none",
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: r.done ? "#ECFDF5" : "#FFF7ED",
                    border: `1px solid ${r.done ? "#BBF7D0" : "#FED7AA"}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 10,
                    fontWeight: 700,
                    color: r.done ? "#059669" : "#D97706",
                  }}
                >
                  {r.done ? "✓" : "!"}
                </div>
                <span
                  style={{
                    fontSize: 13,
                    color: r.done ? "#94A3B8" : "#374151",
                    textDecoration: r.done ? "line-through" : "none",
                  }}
                >
                  {r.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
