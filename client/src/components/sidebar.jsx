import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/themeContext";
import {
  LayoutDashboard,
  Upload,
  Briefcase,
  Mic,
  History,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";

function Sidebar() {
  const { logout } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const linkBase =
    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition";
  const linkActive = isDark
    ? "bg-pink-500/20 text-pink-300"
    : "bg-pink-100 text-pink-700";
  const linkInactive = isDark
    ? "text-gray-400 hover:bg-white/5 hover:text-white"
    : "text-gray-500 hover:bg-pink-50 hover:text-pink-700";

  return (
    <aside
      className={`w-64 h-screen flex flex-col justify-between p-4 border-r ${
        isDark
          ? "bg-[#1a0a14] border-white/10"
          : "bg-white border-pink-100"
      }`}
    >
      <div>
       <div
  className={`flex items-center gap-2 mb-1 px-3 py-2 rounded-xl w-fit ${
    isDark
      ? "bg-white/10 backdrop-blur-xl border border-white/20"
      : ""
  }`}
>
  <GraduationCap size={22} className="text-pink-500" />
  <h2
    className={`text-lg font-bold ${
      isDark
        ? "text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        : "text-gray-900"
    }`}
  >
    Career Prep AI
  </h2>
</div>

        <nav className="space-y-1">
          <NavLink to="/dashboard" end className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            <LayoutDashboard size={18} />
            Dashboard
          </NavLink>
          <NavLink to="/dashboard/upload" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            <Upload size={18} />
            Upload Resume
          </NavLink>
          <NavLink to="/dashboard/interview" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            <Mic size={18} />
            Interview Prep
          </NavLink>
          <NavLink to="/dashboard/history" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            <History size={18} />
            History
          </NavLink>
          <NavLink to="/dashboard/settings" className={({ isActive }) => `${linkBase} ${isActive ? linkActive : linkInactive}`}>
            <Settings size={18} />
            Settings
          </NavLink>
        </nav>
      </div>

      <button
        onClick={logout}
        className={`${linkBase} ${
          isDark
            ? "text-gray-400 hover:bg-red-500/10 hover:text-red-400"
            : "text-gray-500 hover:bg-red-50 hover:text-red-600"
        }`}
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

export default Sidebar;