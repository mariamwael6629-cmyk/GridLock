import { useEffect, useState } from "react";
import { api } from "../../api/client";
import { GlowBtn } from "../../components/Buttons.jsx";
import InputField from "../../components/InputField.jsx";
import PasswordStrength from "../../components/PasswordStrength.jsx";
import { useToast } from "../../context/ToastContext.jsx";

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
    if (!current || !newPass || !confirm) return addToast("Fill in all fields.", "error");
    if (newPass !== confirm) return addToast("Passwords do not match.", "error");

    setSaving(true);
    try {
      const res = await api.changePassword({ current, newPassword: newPass, confirm });
      addToast(res.message || "Password changed successfully.", "success");
      setChangePassForm({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const recommendations = [
    { text: "Set up recovery codes", done: security?.has_recovery_codes ?? false },
    { text: "Verify your email", done: security?.email_verified ?? false },
    { text: "Review active sessions", done: true },
  ];

  return (
    <div>
      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800 }}>Security Settings</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16 }}>Change Password</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <InputField label="Current Password" type="password" value={changePassForm.current} onChange={(v) => setChangePassForm((p) => ({ ...p, current: v }))} icon="🔒" placeholder="Current password" />
            <InputField label="New Password" type="password" value={changePassForm.newPass} onChange={(v) => setChangePassForm((p) => ({ ...p, newPass: v }))} icon="🔑" placeholder="New password" />
            <PasswordStrength password={changePassForm.newPass} />
            <InputField label="Confirm New Password" type="password" value={changePassForm.confirm} onChange={(v) => setChangePassForm((p) => ({ ...p, confirm: v }))} icon="✓" placeholder="Repeat new password" />
            <GlowBtn onClick={handleChangePassword} loading={saving}>
              Update Password
            </GlowBtn>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Two-Factor Authentication</h3>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ color: "#94a3b8", fontSize: 14 }}>2FA Status</span>
              <span
                style={{
                  background: security?.two_fa_enabled ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                  color: security?.two_fa_enabled ? "#22c55e" : "#ef4444",
                  padding: "4px 12px",
                  borderRadius: 99,
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {security?.two_fa_enabled ? "ENABLED" : "DISABLED"}
              </span>
            </div>
            <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 16px" }}>
              {security?.two_fa_enabled
                ? "Your account is protected with two-factor authentication."
                : "Enable 2FA for an extra layer of protection."}
            </p>
            <GlowBtn onClick={() => addToast("2FA management coming soon.", "info")} variant="ghost">
              Manage 2FA Settings
            </GlowBtn>
          </div>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16 }}>Security Recommendations</h3>
            {recommendations.map((r, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ color: r.done ? "#22c55e" : "#f97316", fontSize: 16 }}>{r.done ? "✓" : "!"}</span>
                <span style={{ fontSize: 13, color: r.done ? "#64748b" : "#94a3b8", textDecoration: r.done ? "line-through" : "none" }}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
