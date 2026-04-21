import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  { value: "volunteer", label: "🙋 Volunteer" },
  { value: "ngo",       label: "🏢 NGO" },
  { value: "admin",     label: "⚙️ Admin" },
];

const Register = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "volunteer", location: "", skills: "" });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData, skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean) };
      await API.post("/api/auth/register", payload);
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "input-glow w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-white/40 text-sm focus:outline-none transition";

  return (
    <div className="min-h-screen relative overflow-hidden animated-bg flex items-center justify-center px-4 py-10">
      <div className="absolute top-[-60px] left-[-60px] w-72 h-72 rounded-full bg-navy-500/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-60px] right-[-60px] w-96 h-96 rounded-full bg-navy-300/10 blur-3xl pointer-events-none" />

      <button onClick={toggleTheme} className="absolute top-5 right-5 w-10 h-10 rounded-xl flex items-center justify-center text-white/70 hover:text-white bg-white/10 hover:bg-white/20 transition-all duration-200">
        {isDark ? <SunIcon /> : <MoonIcon />}
      </button>

      <div className="w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-navy-500 to-navy-300 flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-xl shadow-navy-900/50">V</div>
          <h1 className="font-display font-bold text-3xl text-white tracking-tight">Join Vanguard</h1>
          <p className="text-navy-200 text-sm mt-1">Create your account and start making impact</p>
        </div>

        <div className="glass rounded-2xl p-8 shadow-2xl shadow-navy-950/50">
          <h2 className="font-display font-bold text-xl text-white mb-6">Create Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-navy-200 mb-1.5">Full Name</label>
              <input type="text" required placeholder="Shreya Prajapati" className={inputClass} value={formData.name} onChange={set("name")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-200 mb-1.5">Email Address</label>
              <input type="email" required placeholder="you@example.com" className={inputClass} value={formData.email} onChange={set("email")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-200 mb-1.5">Password</label>
              <input type="password" required placeholder="Min. 6 characters" className={inputClass} value={formData.password} onChange={set("password")} />
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-200 mb-2">Select Role</label>
              <div className="grid grid-cols-3 gap-2">
                {roleOptions.map((r) => (
                  <button key={r.value} type="button" onClick={() => setFormData({ ...formData, role: r.value })}
                    className={`p-2.5 rounded-xl border text-center transition-all duration-200 ${formData.role === r.value ? "border-navy-400 bg-navy-500/30 text-white" : "border-white/15 bg-white/5 text-navy-200 hover:border-white/30 hover:bg-white/10"}`}>
                    <div className="text-lg mb-0.5">{r.label.split(" ")[0]}</div>
                    <div className="text-xs font-semibold">{r.label.split(" ")[1]}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-navy-200 mb-1.5">Location</label>
              <input type="text" placeholder="e.g. Lucknow, UP" className={inputClass} value={formData.location} onChange={set("location")} />
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-200 mb-1.5">Skills</label>
              <input type="text" placeholder="teaching, medical, coding" className={inputClass} value={formData.skills} onChange={set("skills")} />
              <p className="text-xs text-navy-300/70 mt-1">Separate multiple skills with commas</p>
            </div>

            <button type="submit" disabled={loading}
              className="btn-shine w-full bg-navy-600 hover:bg-navy-500 disabled:opacity-60 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold text-sm transition-all duration-200 shadow-lg shadow-navy-900/50 mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account...</>
              ) : "Create Account"}
            </button>
          </form>
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <p className="text-sm text-navy-200">
              Already have an account?{" "}
              <Link to="/login" className="text-navy-300 font-semibold hover:text-white transition-colors duration-200 underline underline-offset-2">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;