import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../Context/AuthContext"; // 1. Import your auth context hook

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // 2. Extract the login or user setter function from context

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", formData);
      
      // 3. Save to browser storage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // 4. Update AuthContext directly so the dashboard gets the user's name immediately
      // Note: If your context uses "setUser" instead of a "login" function, change this line to: setUser(res.data.user);
      if (login) {
        login(res.data.user, res.data.token); 
      }

      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a0a14] relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-pink-600/25 rounded-full blur-3xl top-1/4 left-1/4"></div>
      <div className="absolute w-96 h-96 bg-fuchsia-500/15 rounded-full blur-3xl bottom-1/4 right-1/4"></div>

      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <h1 className="text-2xl font-semibold mb-6 text-center text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
          Welcome Back
        </h1>

        {error && (
          <p className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-2 rounded-lg mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
            required
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-pink-300 hover:text-pink-200">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 text-white py-2.5 rounded-lg font-medium hover:bg-pink-600 transition disabled:opacity-50 shadow-lg shadow-pink-500/30"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-pink-300 hover:text-pink-200">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
