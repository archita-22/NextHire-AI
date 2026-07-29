import { useState } from "react";
import { useTheme } from "../Context/themeContext";
import { useAuth } from "../Context/AuthContext";
import API from "../api/axios";
import { Moon, Sun, User, Lock } from "lucide-react";

function Settings() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const isDark = theme === "dark";

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const cardClass = isDark
    ? "bg-white/10 backdrop-blur-xl border border-white/20"
    : "bg-white border border-gray-200";
  const heading = isDark ? "text-white" : "text-gray-900";
  const subtext = isDark ? "text-gray-400" : "text-gray-500";
  const inputClass = isDark
    ? "bg-white/10 border border-white/20 text-white placeholder-gray-500"
    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400";

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setMessage(res.data.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className={`text-lg font-semibold ${heading}`}>Settings</h2>

      {/* Profile Info */}
      <div className={`${cardClass} rounded-2xl p-5 shadow-lg`}>
        <div className="flex items-center gap-2 mb-4">
          <User size={18} className={isDark ? "text-pink-300" : "text-pink-600"} />
          <p className={`font-medium ${heading}`}>Account Details</p>
        </div>
        <div className="space-y-2">
          <p className={`text-sm ${subtext}`}>
            Name: <span className={heading}>{user?.name}</span>
          </p>
          <p className={`text-sm ${subtext}`}>
            Email: <span className={heading}>{user?.email}</span>
          </p>
        </div>
      </div>

      {/* Theme */}
      <div className={`${cardClass} rounded-2xl p-5 shadow-lg flex justify-between items-center`}>
        <div>
          <p className={`font-medium ${heading}`}>Theme</p>
          <p className={`text-sm ${subtext}`}>Switch between dark and light mode</p>
        </div>
        <button
          onClick={toggleTheme}
          className="flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition"
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Change Password */}
      <div className={`${cardClass} rounded-2xl p-5 shadow-lg`}>
        <div className="flex items-center gap-2 mb-4">
          <Lock size={18} className={isDark ? "text-pink-300" : "text-pink-600"} />
          <p className={`font-medium ${heading}`}>Change Password</p>
        </div>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-2 rounded-lg mb-4">
            {error}
          </p>
        )}
        {message && (
          <p className="bg-green-500/10 border border-green-500/30 text-green-300 text-sm p-2 rounded-lg mb-4">
            {message}
          </p>
        )}

        <form onSubmit={handleChangePassword} className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className={`w-full rounded-lg px-3 py-2.5 ${inputClass} focus:outline-none focus:ring-2 focus:ring-pink-400`}
            required
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={`w-full rounded-lg px-3 py-2.5 ${inputClass} focus:outline-none focus:ring-2 focus:ring-pink-400`}
            required
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full rounded-lg px-3 py-2.5 ${inputClass} focus:outline-none focus:ring-2 focus:ring-pink-400`}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-pink-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-pink-600 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;