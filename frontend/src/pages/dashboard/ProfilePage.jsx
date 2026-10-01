import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { GlowBtn } from "../../components/Buttons.jsx";
import InputField from "../../components/InputField.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

const CARD = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 12,
  padding: 24,
};

export default function ProfilePage() {
  const { user, setUser, logout } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setForm({ name: user.name, email: user.email });
  }, [user]);

  const handleSave = async () => {
    if (!form.name || !form.email) return addToast("Please fill in all fields.", "error");
    setSaving(true);
    try {
      const updated = await api.updateProfile(form);
      setUser(updated);
      addToast("Profile updated successfully.", "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteAccount();
      addToast("Account deleted.", "info");
      logout();
      navigate("/login");
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, letterSpacing: "-0.025em", color: "#0F172A" }}>
          Profile
        </h1>
        <p style={{ margin: 0, color: "#64748B", fontSize: 14 }}>
          Manage your personal information and account settings.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 280px",
          gap: 16,
          alignItems: "start",
        }}
      >
        {/* Edit form */}
        <div style={CARD}>
          <h3 style={{ margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: "#0F172A" }}>Personal information</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <InputField
              label="Full name"
              value={form.name}
              onChange={(v) => setForm((p) => ({ ...p, name: v }))}
              placeholder="Your name"
            />
            <InputField
              label="Email address"
              type="email"
              value={form.email}
              onChange={(v) => setForm((p) => ({ ...p, email: v }))}
              placeholder="your@email.com"
            />
            <div>
              <GlowBtn onClick={handleSave} loading={saving} full={false}>
                Save changes
              </GlowBtn>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Avatar card */}
          <div style={{ ...CARD, textAlign: "center" }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: 18,
                background: "#4F46E5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 700,
                color: "#FFFFFF",
                margin: "0 auto 14px",
                letterSpacing: "-0.02em",
              }}
            >
              {user?.avatar}
            </div>
            <div style={{ fontWeight: 600, fontSize: 15, color: "#0F172A", marginBottom: 2 }}>{user?.name}</div>
            <div style={{ color: "#94A3B8", fontSize: 12, marginBottom: 10 }}>{user?.email}</div>
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                color: "#4F46E5",
                background: "#EEF2FF",
                padding: "3px 10px",
                borderRadius: 4,
              }}
            >
              {user?.role}
            </span>
          </div>

          {/* Danger zone */}
          <div
            style={{
              background: "#FFFBFB",
              border: "1px solid #FECACA",
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h4 style={{ margin: "0 0 6px", fontSize: 13, fontWeight: 600, color: "#DC2626" }}>
              Danger zone
            </h4>
            <p style={{ margin: "0 0 14px", fontSize: 12, color: "#94A3B8", lineHeight: 1.5 }}>
              Permanently delete your account and all associated data.
            </p>
            <button
              onClick={handleDelete}
              style={{
                width: "100%",
                padding: "9px",
                borderRadius: 7,
                background: "transparent",
                border: "1px solid #FECACA",
                color: "#DC2626",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
                transition: "background 0.12s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#FEF2F2")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              Delete account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
