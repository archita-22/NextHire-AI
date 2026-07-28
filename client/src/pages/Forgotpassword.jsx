import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await API.post("/auth/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a0a14] relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-pink-600/25 rounded-full blur-3xl top-1/4 left-1/4"></div>
      <div className="absolute w-96 h-96 bg-fuchsia-500/15 rounded-full blur-3xl bottom-1/4 right-1/4"></div>

      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-2 text-center text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          Forgot Password
        </h1>
        <p className="text-sm text-gray-300 text-center mb-6">
          Enter your email and we'll send you a reset link.
        </p>

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

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2.5 rounded-lg font-medium hover:bg-pink-600 transition disabled:opacity-50 shadow-lg shadow-pink-500/30"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-300">
          Remembered your password?{" "}
          <Link to="/login" className="text-pink-300 hover:text-pink-200">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;