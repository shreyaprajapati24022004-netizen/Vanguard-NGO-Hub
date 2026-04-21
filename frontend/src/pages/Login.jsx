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

const stats = [
  { icon: "🤝", value: "500+", label: "Volunteers" },
  { icon: "🏢", value: "120+", label: "NGOs" },
  { icon: "🌍", value: "50+", label: "Communities" },
];

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
      toast.error("Invalid email or password. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-navy-950">

      {/* ── LEFT PANEL — Image + Info ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background image */}
        <img
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop&q=80"
          alt="Volunteers helping community"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/90 via-navy-900/80 to-navy-700/70" />

        {/* Content over image */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Top logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-lg">
              V
            </div>
            <span className="text-white font-bold text-xl tracking-tight">Vanguard NGO Hub</span>
          </div>

          {/* Middle content */}
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Connecting <span className="text-navy-300">Volunteers</span> with Communities in Need
            </h2>
            <p className="text-navy-200 text-base leading-relaxed mb-10">
              Join thousands of volunteers and NGOs working together to create meaningful change across India.
            </p>

            {/* Stats */}
            <div className="flex gap-6">
              {stats.map((s, i) => (
                <div key={i} className="glass rounded-2xl px-5 py-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-white font-bold text-xl">{s.value}</div>
                  <div className="text-navy-300 text-xs font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom quote */}
          <div className="glass rounded-2xl p-5">
            <p className="text-navy-100 text-sm italic leading-relaxed">
              "The best way to find yourself is to lose yourself in the service of others."
            </p>
            <p className="text-navy-300 text-xs mt-2 font-semibold">— Mahatma Gandhi</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Login Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        {/* Theme toggle */}
        <div className="flex justify-between items-center px-8 py-5">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-600 flex items-center justify-center text-white font-bold text-sm">V</div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">Vanguard NGO Hub</span>
          </div>
          <div className="ml-auto">
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-navy-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-navy-800 hover:bg-gray-200 dark:hover:bg-navy-700 transition-all duration-200"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>

        {/* Form centered */}
        <div className="flex-1 flex items-center justify-center px-8 py-6">
          <div className="w-full max-w-md animate-fade-in-up">

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome back 👋</h1>
              <p className="text-gray-500 dark:text-navy-400 text-sm mt-2">Sign in to your account to continue</p>
            </div>

            {/* Form card */}
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-8 shadow-lg shadow-gray-200/60 dark:shadow-navy-950/50 border border-gray-100 dark:border-navy-700/60">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-navy-200 mb-1.5">Email address</label>
                  <input
                    type="email" required placeholder="you@example.com"
                    className="w-full bg-gray-50 dark:bg-navy-800/60 border border-gray-200 dark:border-navy-700/50 rounded-xl px-4 py-3 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-navy-500 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/40 focus:border-navy-500 transition"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-navy-200 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"} required placeholder="••••••••"
                      className="w-full bg-gray-50 dark:bg-navy-800/60 border border-gray-200 dark:border-navy-700/50 rounded-xl px-4 py-3 pr-11 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-navy-500 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/40 focus:border-navy-500 transition"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <button type="button" onClick={() => setShowPass((s) => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-navy-400 dark:hover:text-white transition">
                      <EyeIcon open={showPass} />
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="btn-shine w-full bg-navy-600 hover:bg-navy-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-navy-600/30 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Signing in...
                    </>
                  ) : "Sign In"}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-navy-700/50 text-center">
                <p className="text-sm text-gray-500 dark:text-navy-400">
                  Don't have an account?{" "}
                  <Link to="/register" className="text-navy-600 dark:text-navy-300 font-semibold hover:text-navy-800 dark:hover:text-white transition-colors underline underline-offset-2">
                    Create one
                  </Link>
                </p>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-6 justify-center">
              {["🔒 Secure Login", "🌍 Make Impact", "🤝 Join Community"].map((f, i) => (
                <span key={i} className="text-xs bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-navy-300 px-3 py-1.5 rounded-full font-medium">
                  {f}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;