import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const EyeIcon = ({ open }) => open ? (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const Login = () => {
  const { login } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/api/auth/login", formData);
      login(data, data.token);
      toast.success("Welcome back!");
      if (data.role === "admin") navigate("/admin");
      else if (data.role === "ngo") navigate("/ngo");
      else navigate("/volunteer");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden animated-bg flex items-center justify-center px-4">
      <div className="absolute top-[-80px] right-[-80px] w-80 h-80 rounded-full bg-navy-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-80px] left-[-80px] w-96 h-96 rounded-full bg-navy-300/10 blur-3xl pointer-events-none" />

      <button
        onClick={toggleTheme}
        className="absolute top-5 right-5 w-10 h-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-all duration-200"
      >
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-500 to-navy-300 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-xl shadow-navy-900/50 animate-pulse-ring">
            V
          </div>
          <h1 className="font-display font-bold text-3xl text-white tracking-tight">Vanguard NGO Hub</h1>
          <p className="text-navy-200 text-sm mt-1">Connecting communities, creating impact</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl shadow-navy-950/50">
          <h2 className="font-display font-bold text-xl text-white mb-6">Sign in to your account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy-200 mb-1.5">Email address</label>
              <input
                type="email" required placeholder="you@example.com"
                className="input-glow w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none transition"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-200 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"} required placeholder="••••••••"
                  className="input-glow w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 pr-11 text-white placeholder-white/40 text-sm focus:outline-none transition"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPass((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80 transition">
                  <EyeIcon open={showPass} />
                </button>
              </div>
            </div>
            <button
              type="submit" disabled={loading}
              className="btn-shine w-full bg-navy-600 hover:bg-navy-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-navy-900/50 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Signing in...</>
              ) : "Sign In"}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-sm text-navy-200">
              Don't have an account?{" "}
              <Link to="/register" className="text-navy-300 font-semibold hover:text-white transition-colors duration-200 underline underline-offset-2">Create one</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;