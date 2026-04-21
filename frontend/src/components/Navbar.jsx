import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1"  x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const roleConfig = {
  admin:     { label: "Admin",     color: "bg-purple-500/20 text-purple-300 border-purple-400/30" },
  ngo:       { label: "NGO",       color: "bg-navy-500/30 text-navy-200 border-navy-400/30" },
  volunteer: { label: "Volunteer", color: "bg-teal-500/20 text-teal-300 border-teal-400/30" },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/login"); };
  const role = roleConfig[user?.role] || { label: user?.role, color: "bg-navy-500/20 text-navy-200 border-navy-400/30" };

  return (
    <nav className="sticky top-0 z-50 navbar-blur bg-navy-900/90 dark:bg-navy-950/95 border-b border-navy-700/50 dark:border-navy-800/60 shadow-lg shadow-navy-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-500 to-navy-300 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-navy-600/30">
              V
            </div>
            <div>
              <span className="font-display font-bold text-white text-lg leading-none tracking-tight">Vanguard</span>
              <span className="block text-navy-300 text-[10px] tracking-widest uppercase font-medium leading-none mt-0.5">NGO Hub</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${role.color}`}>
              {role.label}
            </span>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy-800/60 border border-navy-700/40">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-navy-500 to-navy-300 flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-navy-100 font-medium">{user?.name}</span>
            </div>
            <button
              onClick={toggleTheme}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-navy-300 hover:text-white hover:bg-navy-700/60 transition-all duration-200"
            >
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={handleLogout}
              className="btn-shine px-4 py-1.5 rounded-lg bg-navy-600 hover:bg-navy-500 text-white text-sm font-semibold transition-all duration-200 shadow-sm"
            >
              Logout
            </button>
          </div>

          <div className="sm:hidden flex items-center gap-2">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-lg flex items-center justify-center text-navy-300 hover:text-white transition">
              {isDark ? <SunIcon /> : <MoonIcon />}
            </button>
            <button onClick={() => setMenuOpen((o) => !o)} className="w-9 h-9 rounded-lg flex items-center justify-center text-navy-300 hover:text-white hover:bg-navy-700/50 transition">
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="sm:hidden pb-4 pt-2 space-y-3 border-t border-navy-700/40 mt-1 animate-fade-in">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-navy-500 to-navy-300 flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-white text-sm font-semibold">{user?.name}</p>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${role.color}`}>{role.label}</span>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full px-4 py-2 rounded-lg bg-navy-600 hover:bg-navy-500 text-white text-sm font-semibold transition">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;