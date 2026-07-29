import { Outlet, useNavigate, useLocation } from "react-router-dom";
import Sidebar from "./sidebar";
import { useTheme } from "../Context/themeContext";
import { ArrowLeft } from "lucide-react";

function Layout() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();
  const location = useLocation();

  const isRoot = location.pathname === "/dashboard";

  return (
    <div className={`flex ${isDark ? "bg-[#1a0a14]" : "bg-pink-50/40"}`}>
      <Sidebar />

      <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl top-0 left-0 pointer-events-none ${
            isDark ? "bg-pink-600/20" : "bg-pink-300/30"
          }`}
        ></div>
        <div
          className={`absolute w-96 h-96 rounded-full blur-3xl bottom-0 right-0 pointer-events-none ${
            isDark ? "bg-fuchsia-500/10" : "bg-rose-200/40"
          }`}
        ></div>

        {!isRoot && (
          <button
            onClick={() => navigate(-1)}
            className={`relative flex items-center gap-2 mt-6 ml-6 w-fit px-4 py-2 rounded-lg text-sm font-medium transition ${
              isDark
                ? "bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20"
                : "bg-white border border-pink-200 text-gray-700 hover:bg-pink-50"
            }`}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        )}

        <main className="flex-1 relative max-w-5xl w-full mx-auto px-6 py-10">
          <Outlet />
        </main>

        <footer className={`text-center text-xs py-4 relative ${isDark ? "text-gray-500" : "text-gray-400"}`}>
          Manage your resumes and get AI-powered feedback
        </footer>
      </div>
    </div>
  );
}

export default Layout;