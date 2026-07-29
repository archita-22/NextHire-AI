import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useTheme } from "../Context/themeContext";
import { Upload } from "lucide-react";

function UploadResume() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    setError("");
    setUploading(true);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await API.post("/resume/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/dashboard/history");
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed. Try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={`${
        isDark
          ? "bg-white/10 backdrop-blur-xl border border-white/20"
          : "bg-white border border-gray-200"
      } rounded-2xl p-6 shadow-xl`}
    >
      <div className="flex items-center gap-2 mb-4">
        <Upload size={18} className="text-violet-400" />
        <h2 className={`text-lg font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>
          Upload Resume
        </h2>
      </div>

      {error && (
        <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-2 rounded-lg mb-4">
          {error}
        </p>
      )}

      <form onSubmit={handleUpload} className="flex items-center gap-3">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className={`text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-pink-400/30 file:bg-white/10 file:backdrop-blur-xl file:text-pink-200 file:cursor-pointer hover:file:bg-pink-500/20 file:font-medium ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        />
        <button
          type="submit"
          disabled={uploading}
          className="bg-white/10 backdrop-blur-xl border border-pink-400/30 text-pink-200 px-5 py-2 rounded-lg font-medium hover:bg-pink-500/20 transition disabled:opacity-50 whitespace-nowrap shadow-lg shadow-pink-500/20"
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

export default UploadResume;