import { useState, useEffect, useRef } from "react";
import API from "../api/axios";
import { useTheme } from "../Context/themeContext";
import { Mic, MicOff, Volume2, Send, RotateCcw } from "lucide-react";

function InterviewPrep() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [resumes, setResumes] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  const [session, setSession] = useState(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const recognitionRef = useRef(null);

  useEffect(() => {
    API.get("/resume/my-resumes")
      .then((res) => setResumes(res.data.resumes))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setAnswerText((prev) => (prev ? prev + " " + transcript : transcript));
    };

    recognition.onend = () => setIsListening(false);
     recognition.onerror = (event) => {
       console.log("Speech recognition error:", event.error);
       setIsListening(false);
};

    recognitionRef.current = recognition;

    // 🔧 FIX: jab component unmount ho (user page chhoड़e), speech turant band karo
    return () => {
      window.speechSynthesis.cancel();
      try {
        recognition.stop();
      } catch {
        // already stopped, ignore
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice input is not supported in this browser. Try Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakQuestion = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  const handleStart = async (e) => {
    e.preventDefault();
    if (!resumeId || !jobRole) {
      setError("Please select a resume and enter a job role");
      return;
    }

    setError("");
    setStarting(true);

    const combinedRole = jobDescription
      ? `${jobRole}\n\nJob Description:\n${jobDescription}`
      : jobRole;

    try {
      const res = await API.post("/interview/start", {
        resumeId,
        jobRole: combinedRole,
      });
      setSession(res.data.session);
      setAnswers(new Array(res.data.session.questions.length).fill(""));
      setCurrentQ(0);
      setAnswerText("");

      setTimeout(() => speakQuestion(res.data.session.questions[0]), 400);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to start interview");
    } finally {
      setStarting(false);
    }
  };

  // 🔧 FIX: answer compulsory — empty/whitespace-only text pe aage nahi badhne dena
  const handleNext = () => {
    if (!answerText.trim()) {
      setError("Please answer before moving to the next question.");
      return;
    }
    setError("");

    const updated = [...answers];
    updated[currentQ] = answerText;
    setAnswers(updated);
    setAnswerText("");

    window.speechSynthesis.cancel(); // pehle wala bolna turant band karo

    if (currentQ < session.questions.length - 1) {
      const next = currentQ + 1;
      setCurrentQ(next);
      setTimeout(() => speakQuestion(session.questions[next]), 300);
    }
  };

  const handleSubmit = async () => {
    // 🔧 FIX: last answer bhi compulsory
    if (!answerText.trim()) {
      setError("Please answer before submitting.");
      return;
    }
    setError("");

    const finalAnswers = [...answers];
    finalAnswers[currentQ] = answerText;

    window.speechSynthesis.cancel();

    setSubmitting(true);
    try {
      const res = await API.post(`/interview/${session._id}/submit`, {
        answers: finalAnswers,
      });
      setResult(res.data.session);
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    window.speechSynthesis.cancel();
    setSession(null);
    setResult(null);
    setCurrentQ(0);
    setAnswers([]);
    setAnswerText("");
    setJobRole("");
    setJobDescription("");
    setError("");
  };

  const glass = isDark
    ? "bg-white/10 backdrop-blur-xl border border-white/20"
    : "bg-white/70 backdrop-blur-xl border border-pink-100";
  const heading = isDark ? "text-white" : "text-gray-900";
  const subtext = isDark ? "text-gray-400" : "text-gray-500";
  const inputClass = isDark
    ? "bg-white/10 border border-white/20 text-white placeholder-gray-500"
    : "bg-white border border-pink-200 text-gray-900 placeholder-gray-400";

  if (result) {
    return (
      <div className="space-y-5">
        <div className={`${glass} rounded-2xl p-6 shadow-xl text-center`}>
          <p className={`text-sm ${subtext}`}>Overall Score</p>
          <p className={`text-4xl font-bold mt-1 ${isDark ? "text-pink-300" : "text-pink-600"}`}>
            {result.overallScore}/100
          </p>
        </div>

        {result.questions.map((q, i) => (
          <div key={i} className={`${glass} rounded-2xl p-5 shadow-lg`}>
            <p className={`font-medium ${heading}`}>Q{i + 1}: {q}</p>
            <p className={`text-sm mt-2 ${subtext}`}>
              <span className="font-medium">Your answer:</span> {result.answers[i] || "No answer"}
            </p>
            <p className={`text-sm mt-2 p-3 rounded-lg ${isDark ? "bg-pink-500/10 text-pink-200" : "bg-pink-50 text-pink-700"}`}>
              {result.feedback[i]}
            </p>
          </div>
        ))}

        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-pink-500 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-pink-600 transition shadow-lg shadow-pink-500/30"
        >
          <RotateCcw size={16} />
          Start New Interview
        </button>
      </div>
    );
  }

  if (session) {
    const isLast = currentQ === session.questions.length - 1;

    return (
      <div className="space-y-5">
        <div className={`${glass} rounded-2xl p-6 shadow-xl`}>
          <div className="flex justify-between items-center mb-4">
            <span className={`text-sm font-medium ${subtext}`}>
              Question {currentQ + 1} of {session.questions.length}
            </span>
            <button
              onClick={() => speakQuestion(session.questions[currentQ])}
              className={`p-2 rounded-lg ${isDark ? "bg-white/10 hover:bg-white/20" : "bg-pink-50 hover:bg-pink-100"}`}
              title="Read question aloud"
            >
              <Volume2 size={16} className={isDark ? "text-pink-300" : "text-pink-600"} />
            </button>
          </div>

          <p className={`text-lg font-medium mb-4 ${heading}`}>
            {session.questions[currentQ]}
          </p>

          {error && (
            <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-2 rounded-lg mb-3">
              {error}
            </p>
          )}

          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            placeholder="Type your answer, or use the mic to speak..."
            rows={5}
            className={`w-full rounded-lg px-3 py-2.5 mb-3 ${inputClass} focus:outline-none focus:ring-2 focus:ring-pink-400`}
          />

          <div className="flex items-center justify-between">
            <button
              onClick={toggleListening}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                isListening
                  ? "bg-red-500 text-white"
                  : isDark
                  ? "bg-white/10 text-white hover:bg-white/20"
                  : "bg-pink-50 text-pink-700 hover:bg-pink-100"
              }`}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              {isListening ? "Stop Recording" : "Speak Answer"}
            </button>

            {isLast ? (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 bg-pink-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-pink-600 transition disabled:opacity-50 shadow-lg shadow-pink-500/30"
              >
                <Send size={16} />
                {submitting ? "Evaluating..." : "Submit & Get Feedback"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-pink-500 text-white px-5 py-2 rounded-lg font-medium hover:bg-pink-600 transition shadow-lg shadow-pink-500/30"
              >
                Next Question →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${glass} rounded-2xl p-6 shadow-xl max-w-lg`}>
      <div className="flex items-center gap-2 mb-5">
        <Mic size={20} className={isDark ? "text-pink-300" : "text-pink-600"} />
        <h2 className={`text-lg font-semibold ${heading}`}>Start Mock Interview</h2>
      </div>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-2 rounded-lg mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleStart} className="space-y-4">
        <div>
          <label className={`text-sm font-medium block mb-1.5 ${subtext}`}>
            Select Resume
          </label>
          <select
            value={resumeId}
            onChange={(e) => setResumeId(e.target.value)}
            className={`w-full rounded-lg px-3 py-2.5 ${inputClass} focus:outline-none focus:ring-2 focus:ring-pink-400`}
          >
            <option value="">-- Choose a resume --</option>
            {resumes.map((r) => (
              <option key={r._id} value={r._id}>
                {r.fileName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={`text-sm font-medium block mb-1.5 ${subtext}`}>
            Job Role
          </label>
          <input
            type="text"
            value={jobRole}
            onChange={(e) => setJobRole(e.target.value)}
            placeholder="e.g. Backend Developer"
            className={`w-full rounded-lg px-3 py-2.5 ${inputClass} focus:outline-none focus:ring-2 focus:ring-pink-400`}
          />
        </div>

        <div>
          <label className={`text-sm font-medium block mb-1.5 ${subtext}`}>
            Job Description <span className="opacity-60">(optional)</span>
          </label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste a job description for more tailored questions..."
            rows={4}
            className={`w-full rounded-lg px-3 py-2.5 ${inputClass} focus:outline-none focus:ring-2 focus:ring-pink-400`}
          />
        </div>

        <button
          type="submit"
          disabled={starting}
          className="w-full bg-pink-500 text-white py-2.5 rounded-lg font-medium hover:bg-pink-600 transition disabled:opacity-50 shadow-lg shadow-pink-500/30"
        >
          {starting ? "Generating Questions..." : "Start Interview"}
        </button>
      </form>
    </div>
  );
}

export default InterviewPrep;