import { useState, useEffect } from "react";
import API from "../api/axios";
import { useTheme } from "../context/themeContext";
import { FileText, TrendingUp } from "lucide-react";

function History() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [resumes, setResumes] = useState([]);
  const [analyzingId, setAnalyzingId] = useState(null);

  const fetchResumes = async () => {
    try {
      const res = await API.get("/resume/my-resumes");
      setResumes(res.data.resumes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchResumes();
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

  const cardClass = isDark
    ? "bg-white/10 backdrop-blur-xl border border-white/20 hover:border-violet-500/30"
    : "bg-white border border-gray-200 hover:border-violet-300";

  return (
    <div className="space-y-4">
      <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
        Resume History
      </h2>

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
  );
}

export default History;