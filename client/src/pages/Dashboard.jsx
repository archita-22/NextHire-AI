import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import API from "../api/axios";
import {
  Upload,
  Bot,
  Briefcase,
  Mic,
  FileText,
  ArrowRight,
} from "lucide-react";

const QUOTES = [
  "Success is where preparation and opportunity meet.",
  "Your only limit is your mind.",
  "Every expert was once a beginner.",
  "Small steps every day lead to big results.",
  "Consistency beats motivation.",
  "The best time to start was yesterday. The next best time is now.",
];

function Dashboard() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [quote, setQuote] = useState("");
  const [resumes, setResumes] = useState([]);;
  const [interviewCount, setInterviewCount] = useState(0);

  useEffect(() => {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);

    API.get("/resume/my-resumes").then((res) => setResumes(res.data.resumes)).catch(() => {});
    API.get("/interview/history").then((res) => setInterviewCount(res.data.sessions.length)).catch(() => {});
  }, []);

  const latestScore = resumes.find((r) => r.analysis?.atsScore != null)?.analysis?.atsScore;

  const glass = isDark
    ? "bg-white/10 backdrop-blur-xl border border-white/20"
    : "bg-white/70 backdrop-blur-xl border border-pink-100";

  const heading = isDark ? "text-white" : "text-gray-900";
  const subtext = isDark ? "text-gray-400" : "text-gray-500";

  const statCards = [
    { label: "Resume Score", value: latestScore != null ? `${latestScore}/100` : "—", icon: FileText },
    { label: "Interview Sessions", value: interviewCount, icon: Mic },
  ];

  const toolkitCards = [
    {
      title: "Upload Resume",
      desc: "Upload your resume and get AI-powered analysis",
      icon: Upload,
      cta: "Upload Resume",
      path: "/dashboard/upload",
      accent: isDark ? "from-pink-500/20 to-pink-500/5" : "from-pink-100 to-white",
    },
    {
      title: "AI Resume Feedback",
      desc: "Get detailed suggestions to improve your resume",
      icon: Bot,
      cta: "Analyze Now",
      path: "/dashboard/history",
      accent: isDark ? "from-rose-500/20 to-rose-500/5" : "from-rose-100 to-white",
    },
    {
      title: "Interview Prep",
      desc: "Practice with AI-generated questions & get feedback",
      icon: Mic,
      cta: "Start Practice",
      path: "/dashboard/interview",
      accent: isDark ? "from-pink-600/20 to-pink-600/5" : "from-pink-100 to-white",
    },
  ];

  return (
    <div>
      {/* Hero */}
      <div
        className={`rounded-2xl p-8 mb-8 shadow-xl ${
          isDark
            ? "bg-gradient-to-br from-pink-600/30 via-[#2a0f22] to-fuchsia-700/20 border border-white/10"
            : "bg-gradient-to-br from-pink-100 via-white to-rose-50 border border-pink-100"
        }`}
      >
       <h1 className={`text-3xl font-bold ${
          isDark
            ? "text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            : heading
        }`}>
          Welcome back,{" "}
          <span className={isDark ? "text-pink-300" : "text-pink-600"}>
            {user?.name || "there"}
          </span>
          !
        </h1>
        <p className={`mt-2 ${subtext}`}>Ready to achieve your dream placement?</p>

        <div
          className={`inline-block mt-4 px-4 py-2 rounded-full text-sm italic ${
            isDark ? "bg-white/10 text-pink-200" : "bg-white text-pink-600 shadow-sm"
          }`}
        >
          "{quote}" 💗
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className={`${glass} rounded-2xl p-5 shadow-lg`}>
            <div className={`inline-flex p-2 rounded-lg mb-3 ${isDark ? "bg-pink-500/20" : "bg-pink-100"}`}>
              <Icon size={18} className={isDark ? "text-pink-300" : "text-pink-600"} />
            </div>
            <p className={`text-sm ${subtext}`}>{label}</p>
            <p className={`text-2xl font-bold mt-1 ${heading}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Toolkit */}
      <h2 className={`text-xl font-bold mb-1 ${heading}`}>Career Toolkit ✨</h2>
      <p className={`text-sm mb-5 ${subtext}`}>Everything you need to build your dream career</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {toolkitCards.map(({ title, desc, icon: Icon, cta, path, accent }) => (
          <div
            key={title}
            className={`rounded-2xl p-5 shadow-lg bg-gradient-to-br ${accent} ${
              isDark ? "border border-white/10" : "border border-pink-100"
            }`}
          >
            <div className={`inline-flex p-2.5 rounded-xl mb-3 ${isDark ? "bg-white/10" : "bg-white"}`}>
              <Icon size={20} className={isDark ? "text-pink-300" : "text-pink-600"} />
            </div>
            <h3 className={`font-semibold ${heading}`}>{title}</h3>
            <p className={`text-sm mt-1 mb-4 ${subtext}`}>{desc}</p>
            <button
              onClick={() => navigate(path)}
              className="flex items-center gap-1.5 bg-pink-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-pink-600 transition shadow-md shadow-pink-500/30"
            >
              {cta}
              <ArrowRight size={14} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;