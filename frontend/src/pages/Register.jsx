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

const roleOptions = [
  { value: "volunteer", label: "🙋", name: "Volunteer", desc: "Help communities" },
  { value: "ngo",       label: "🏢", name: "NGO",       desc: "Manage needs" },
  { value: "admin",     label: "⚙️", name: "Admin",     desc: "Oversee platform" },
];

const features = [
  { icon: "🤝", value: "500+", label: "Volunteers" },
  { icon: "🏢", value: "120+", label: "NGOs" },
  { icon: "🌍", value: "50+",  label: "Communities" },
];

const getDashboard = (role) => {
  if (role === "admin")     return "/admin";
  if (role === "ngo")       return "/ngo";
  if (role === "volunteer") return "/volunteer";
  return "/login";
};

const Register = () => {
  const { isDark, toggleTheme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "volunteer", location: "", skills: "" });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean) };
      const { data } = await API.post("/api/auth/register", payload);
      login(data, data.token);
      toast.success(`Welcome, ${data.name}! 🎉`);
      navigate(getDashboard(data.role));
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-gray-50 dark:bg-navy-800/60 border border-gray-200 dark:border-navy-700/50 rounded-xl px-4 py-3 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-navy-500 text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/40 focus:border-navy-500 transition";

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-navy-950">

      {/* ── LEFT PANEL — Image + Info ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1200&auto=format&fit=crop&q=80"
          alt="Volunteers helping community"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-950/90 via-navy-900/80 to-navy-700/70" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-white font-bold text-lg">V</div>
            <span className="text-white font-bold text-xl tracking-tight">Vanguard NGO Hub</span>
          </div>

          {/* Middle */}
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              Start Making a <span className="text-navy-300">Difference</span> Today
            </h2>
            <p className="text-navy-200 text-base leading-relaxed mb-10">
              Join our growing community of volunteers and NGOs creating meaningful change across India.
            </p>
            <div className="flex gap-6">
              {features.map((s, i) => (
                <div key={i} className="glass rounded-2xl px-5 py-4 text-center">
                  <div className="text-2xl mb-1">{s.icon}</div>
                  <div className="text-white font-bold text-xl">{s.value}</div>
                  <div className="text-navy-300 text-xs font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Quote */}
          <div className="glass rounded-2xl p-5">
            <p className="text-navy-100 text-sm italic leading-relaxed">
              "The simplest acts of kindness are by far more powerful than a thousand heads bowing in prayer."
            </p>
            <p className="text-navy-300 text-xs mt-2 font-semibold">— Mahatma Gandhi</p>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Register Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        {/* Top bar */}
        <div className="flex justify-between items-center px-8 py-5">
          <div className="lg:hidden flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-navy-600 flex items-center justify-center text-white font-bold text-sm">V</div>
            <span className="font-bold text-gray-900 dark:text-white text-sm">Vanguard NGO Hub</span>
          </div>
          <div className="ml-auto">
            <button onClick={toggleTheme}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-gray-500 dark:text-navy-300 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-navy-800 hover:bg-gray-200 dark:hover:bg-navy-700 transition-all duration-200">
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>

        {/* Form centered */}
        <div className="flex-1 flex items-center justify-center px-8 py-4">
          <div className="w-full max-w-md animate-fade-in-up">

            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Join Vanguard 🚀</h1>
              <p className="text-gray-500 dark:text-navy-400 text-sm mt-2">Create your account and start making impact</p>
            </div>

            {/* Form card */}
            <div className="bg-white dark:bg-navy-900 rounded-2xl p-8 shadow-lg shadow-gray-200/60 dark:shadow-navy-950/50 border border-gray-100 dark:border-navy-700/60">
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Name + Email row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-navy-200 mb-1.5">Full Name</label>
                    <input type="text" required placeholder="Shreya Prajapati" className={inputClass} value={formData.name} onChange={set("name")} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-navy-200 mb-1.5">Location</label>
                    <input type="text" placeholder="Lucknow, UP" className={inputClass} value={formData.location} onChange={set("location")} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-navy-200 mb-1.5">Email Address</label>
                  <input type="email" required placeholder="you@example.com" className={inputClass} value={formData.email} onChange={set("email")} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-navy-200 mb-1.5">Password</label>
                  <input type="password" required placeholder="Min. 6 characters" className={inputClass} value={formData.password} onChange={set("password")} />
                </div>

                {/* Role selector */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-navy-200 mb-2">Select Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    {roleOptions.map((r) => (
                      <button key={r.value} type="button" onClick={() => setFormData({ ...formData, role: r.value })}
                        className={`p-3 rounded-xl border text-center transition-all duration-200 ${
                          formData.role === r.value
                            ? "border-navy-500 bg-navy-50 dark:bg-navy-700/60 text-navy-700 dark:text-white shadow-sm"
                            : "border-gray-200 dark:border-navy-700/50 bg-gray-50 dark:bg-navy-800/40 text-gray-500 dark:text-navy-400 hover:border-navy-300 dark:hover:border-navy-600"
                        }`}>
                        <div className="text-xl mb-1">{r.label}</div>
                        <div className="text-xs font-bold">{r.name}</div>
                        <div className="text-xs opacity-60 mt-0.5">{r.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-navy-200 mb-1.5">Skills</label>
                  <input type="text" placeholder="teaching, medical, coding" className={inputClass} value={formData.skills} onChange={set("skills")} />
                  <p className="text-xs text-gray-400 dark:text-navy-500 mt-1">Separate multiple skills with commas</p>
                </div>

                <button type="submit" disabled={loading}
                  className="btn-shine w-full bg-navy-600 hover:bg-navy-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-navy-600/30 flex items-center justify-center gap-2 mt-2">
                  {loading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Creating account...
                    </>
                  ) : "Create Account 🎉"}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-gray-100 dark:border-navy-700/50 text-center">
                <p className="text-sm text-gray-500 dark:text-navy-400">
                  Already have an account?{" "}
                  <Link to="/login" className="text-navy-600 dark:text-navy-300 font-semibold hover:text-navy-800 dark:hover:text-white transition-colors underline underline-offset-2">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mt-5 justify-center">
              {["🔒 Secure", "🌍 Make Impact", "🤝 Join Community", "🤖 AI Matching"].map((f, i) => (
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

export default Register;