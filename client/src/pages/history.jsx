import { useState, useEffect } from "react";
import API from "../api/axios";
import { useTheme } from "../Context/themeContext";
import { 
  FileText, 
  TrendingUp, 
  Mic, 
  Calendar, 
  Bookmark, 
  Loader2, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  User 
} from "lucide-react";

// **bold** ko detect karke actual <strong> mein render karta hai
function renderWithBold(text) {
  if (!text) return text;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

function History() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [activeTab, setActiveTab] = useState("resume"); // 'resume' or 'interview'
  const [resumes, setResumes] = useState([]);
  const [interviews, setInterviews] = useState([]);
  const [analyzingId, setAnalyzingId] = useState(null);
  const [loadingInterviews, setLoadingInterviews] = useState(false);
  const [expandedSessionId, setExpandedSessionId] = useState(null);

  // 1. Fetch Resume Reviews History
  const fetchResumes = async () => {
    try {
      const res = await API.get("/resume/my-resumes");
      setResumes(res.data.resumes || []);
    } catch (err) {
      console.log(err);
    }
  };

  // 2. Fetch Interview Sessions History
  const fetchInterviews = async () => {
    try {
      setLoadingInterviews(true);
      const res = await API.get("/interview/history");
      if (res.data.success) {
        setInterviews(res.data.sessions || []);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingInterviews(false);
    }
  };

  useEffect(() => {
    fetchResumes();
    fetchInterviews();
  }, []);

  const handleAnalyze = async (resumeId) => {
    setAnalyzingId(resumeId);
    try {
      await API.post(`/resume/${resumeId}/analyze`);
      fetchResumes();
    } catch (err) {
      console.log(err);
    } finally {
      setAnalyzingId(null);
    }
  };

  const toggleSessionExpand = (id) => {
    setExpandedSessionId(expandedSessionId === id ? null : id);
  };

  const cardClass = isDark
    ? "bg-white/10 backdrop-blur-xl border border-white/20 hover:border-violet-500/30"
    : "bg-white border border-gray-200 hover:border-violet-300";

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* TABS HEADERS NAVIGATOR SEGMENT */}
      <div className="flex gap-6 border-b border-white/10 pb-2">
        <button
          onClick={() => setActiveTab("resume")}
          className={`pb-2 px-2 text-sm font-medium transition-all ${
            activeTab === "resume"
              ? "border-b-2 border-violet-500 text-violet-400 font-semibold"
              : isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Resume Analysis
        </button>
        <button
          onClick={() => setActiveTab("interview")}
          className={`pb-2 px-2 text-sm font-medium transition-all ${
            activeTab === "interview"
              ? "border-b-2 border-violet-500 text-violet-400 font-semibold"
              : isDark ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"
          }`}
        >
          Interview Bookmarks
        </button>
      </div>

      {/* ==================== RESUME TAB VIEW PANEL ==================== */}
      {activeTab === "resume" && (
        <div className="space-y-4">
          {resumes.length === 0 && (
            <div className={`${cardClass} rounded-2xl p-8 text-center`}>
              <FileText size={32} className="text-gray-500 mx-auto mb-3" />
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                No resumes yet — upload one to get started!
              </p>
            </div>
          )}

          {resumes.map((resume) => (
            <div key={resume._id} className={`${cardClass} rounded-2xl p-5 shadow-lg transition`}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-violet-600/20 p-2 rounded-lg">
                    <FileText size={20} className="text-violet-400" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
                      {resume.fileName}
                    </p>
                    <p className={`text-xs mt-0.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                      Uploaded {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {resume.analysis?.atsScore != null ? (
                  <div className="flex items-center gap-1.5 bg-violet-600/20 px-3 py-1.5 rounded-lg">
                    <TrendingUp size={14} className="text-violet-300" />
                    <span className="text-violet-300 font-semibold text-sm">
                      ATS Score: {resume.analysis.atsScore}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAnalyze(resume._id)}
                    disabled={analyzingId === resume._id}
                    className="bg-violet-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-violet-500 transition disabled:opacity-50"
                  >
                    {analyzingId === resume._id ? "Analyzing..." : "Analyze"}
                  </button>
                )}
              </div>

              {resume.analysis?.missingSkills?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Missing Skills:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {resume.analysis.missingSkills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-red-500/10 border border-red-500/20 text-red-300 text-xs px-2.5 py-1 rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
                {resume.analysis?.suggestions?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className={`text-sm font-medium mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                    Suggestions:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {resume.analysis.suggestions.map((s, i) => (
                      <li key={i} className={`text-sm ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ==================== INTERVIEW BOOKMARKS TAB VIEW PANEL ==================== */}
      {activeTab === "interview" && (
        <div className="space-y-4">
          {loadingInterviews ? (
            <div className="flex items-center gap-2 text-gray-500 text-sm py-4">
              <Loader2 className="animate-spin text-violet-500" size={16} />
              Loading interview bookmarks...
            </div>
          ) : interviews.length === 0 ? (
            <div className={`${cardClass} rounded-2xl p-8 text-center`}>
              <Mic size={32} className="text-gray-500 mx-auto mb-3" />
              <p className={isDark ? "text-gray-400" : "text-gray-500"}>
                No completed interview sessions found.
              </p>
            </div>
          ) : (
            interviews.map((session) => {
              const isExpanded = expandedSessionId === session._id;
              return (
                <div 
                  key={session._id} 
                  className={`${cardClass} rounded-2xl p-5 shadow-lg transition-all duration-300 w-full max-w-full overflow-hidden`}
                >
                  {/* MAIN CARD ROW - CLICKABLE ACCORDION HEADER */}
                  <div 
                    onClick={() => toggleSessionExpand(session._id)}
                    className="flex justify-between items-start cursor-pointer select-none gap-4"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      <div className="bg-violet-600/20 p-2 rounded-lg mt-0.5 flex-shrink-0">
                        <Bookmark size={20} className="text-violet-400 fill-violet-400/10" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="inline-block text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-violet-500/10 text-violet-300 border border-violet-500/20 mb-2">
                          {session.jobRole}
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`font-medium text-sm truncate ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                            Interview Evaluation Log
                          </p>
                          {isExpanded ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                        </div>
                        <p className={`text-xs flex items-center gap-1 mt-1.5 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                          <Calendar size={12} /> {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 block mb-1">
                        Overall Score
                      </span>
                      <div className="text-base font-bold text-violet-400 bg-violet-600/10 px-3 py-1 rounded-xl border border-violet-500/20">
                        {session.overallScore != null ? `${session.overallScore}/100` : "N/A"}
                      </div>
                    </div>
                  </div>

                  {/* CLOSED MINI SUB-INFO SUMMARY STRIP */}
                  {!isExpanded && session.questions?.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                      <span>Evaluated Components: {session.questions.length} Questions</span>
                      <span className="text-violet-400 text-xs font-medium">
                        Click to view questions & answers
                      </span>
                    </div>
                  )}

                  {/* ==================== CONTENT DROPDOWN DETAILS REPORT ==================== */}
                  {isExpanded && (
                    <div className="mt-5 pt-5 border-t border-white/10 space-y-5 w-full max-w-full">
                      <h4 className="text-xs uppercase font-bold tracking-wider text-violet-400 mb-2">
                        Detailed QA Evaluation Report
                      </h4>

                      {session.questions.map((question, index) => (
                        <div key={index} className="p-4 bg-black/20 rounded-xl border border-white/5 space-y-3 w-full max-w-full overflow-hidden break-words">
                          {/* THE CORE QUESTION TEXT SECTION */}
                          <div className="flex gap-2 items-start w-full">
                            <span className="text-xs font-bold bg-violet-600/30 text-violet-300 px-2 py-0.5 rounded mt-0.5 flex-shrink-0">
                              Q{index + 1}
                            </span>
                            <p className={`text-sm font-medium break-words whitespace-pre-wrap flex-1 ${isDark ? "text-gray-200" : "text-gray-800"}`}>
                              {question}
                            </p>
                          </div>

                          {/* USER'S INPUT ANSWER TEXT BLOCK SECTION */}
                          <div className="pl-0 sm:pl-8 space-y-1 w-full border-l-2 sm:border-l-0 border-violet-500/20 pl-2 sm:pl-0">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1">
                              <User size={10} className="text-violet-400" /> Your Response
                            </span>
                            <p className={`text-sm italic break-words whitespace-pre-wrap sm:pl-2 sm:border-l-2 border-violet-500/30 ${isDark ? "text-gray-400" : "text-gray-600"}`}>
                              {session.answers?.[index] || "No response recorded for this question."}
                            </p>
                          </div>

                          {/* SYSTEM GENERATED AI RESPONSE EVALUATION SUMMARY SECTION */}
                          <div className="pl-0 sm:pl-8 space-y-1 w-full border-l-2 sm:border-l-0 border-violet-500/20 pl-2 sm:pl-0">
                            <span className="text-[10px] uppercase tracking-wider text-gray-500 flex items-center gap-1">
                              <MessageSquare size={10} className="text-violet-400" /> AI Feedback
                            </span>
                            <p className={`text-sm break-words whitespace-pre-wrap sm:pl-2 sm:border-l-2 border-violet-500/30 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
                              {session.feedback?.[index] || "Feedback evaluation logs missing."}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default History;