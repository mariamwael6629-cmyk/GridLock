import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/client";
import { GlowBtn } from "../../components/Buttons.jsx";
import InputField from "../../components/InputField.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

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
      <h2 style={{ margin: "0 0 24px", fontSize: 22, fontWeight: 800 }}>Profile Settings</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24 }}>
          <h3 style={{ margin: "0 0 20px", fontSize: 16 }}>Personal Information</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <InputField label="Full Name" value={form.name} onChange={(v) => setForm((p) => ({ ...p, name: v }))} icon="👤" placeholder="Your name" />
            <InputField label="Email Address" type="email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} icon="✉" placeholder="your@email.com" />
            <GlowBtn onClick={handleSave} loading={saving}>
              Save Changes
            </GlowBtn>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, padding: 24, textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: 20, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 800, margin: "0 auto 12px" }}>
              {user?.avatar}
            </div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{user?.name}</div>
            <div style={{ color: "#64748b", fontSize: 13, marginBottom: 12 }}>{user?.email}</div>
            <span style={{ background: "rgba(139,92,246,0.2)", color: "#a78bfa", padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 700 }}>{user?.role}</span>
          </div>
          <div style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: 16, padding: 20 }}>
            <h4 style={{ margin: "0 0 10px", color: "#f87171", fontSize: 14 }}>Danger Zone</h4>
            <button
              onClick={handleDelete}
              style={{ width: "100%", padding: "10px", borderRadius: 10, background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171", cursor: "pointer", fontSize: 13, fontWeight: 600 }}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
