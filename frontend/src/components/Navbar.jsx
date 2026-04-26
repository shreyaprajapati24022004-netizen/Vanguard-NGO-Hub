import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
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
const LogoutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const roleConfig = {
  admin:     { label: "Admin",     color: "bg-purple-500/20 text-purple-300 border-purple-400/30",  dot: "bg-purple-400" },
  ngo:       { label: "NGO",       color: "bg-navy-500/30 text-navy-200 border-navy-400/30",        dot: "bg-blue-400" },
  volunteer: { label: "Volunteer", color: "bg-teal-500/20 text-teal-300 border-teal-400/30",        dot: "bg-teal-400" },
};

const navLinks = {
  admin:     { path: "/admin",     label: "Dashboard", icon: "🏠" },
  ngo:       { path: "/ngo",       label: "Dashboard", icon: "🏢" },
  volunteer: { path: "/volunteer", label: "Dashboard", icon: "🙋" },
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setShowLogoutConfirm(false);
  };

  const role = roleConfig[user?.role] || { label: user?.role, color: "bg-navy-500/20 text-navy-200 border-navy-400/30", dot: "bg-gray-400" };
  const navLink = navLinks[user?.role];
  const isActive = navLink && location.pathname === navLink.path;

  return (
    <>
      <nav className="sticky top-0 z-50 bg-navy-900/95 dark:bg-navy-950/98 border-b border-navy-700/50 shadow-lg shadow-navy-950/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-500 to-navy-300 flex items-center justify-center text-white font-bold text-base shadow-lg shadow-navy-600/30">
                V
              </div>
              <div>
                <span className="font-bold text-white text-lg leading-none tracking-tight">Vanguard</span>
                <span className="block text-navy-400 text-[10px] tracking-widest uppercase font-medium leading-none mt-0.5">NGO Hub</span>
              </div>
            </div>

            {/* ── Active Page Indicator (desktop) ── */}
            {navLink && (
              <div className={`hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? "bg-navy-700/80 text-white border border-navy-600/50"
                  : "text-navy-400"
              }`}>
                <span>{navLink.icon}</span>
                <span>{navLink.label}</span>
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
              </div>
            )}

            {/* ── Right Section (desktop) ── */}
            <div className="hidden sm:flex items-center gap-2">

              {/* Role badge */}
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${role.color} flex items-center gap-1.5`}>
                <span className={`w-1.5 h-1.5 rounded-full ${role.dot}`} />
                {role.label}
              </span>

              {/* User badge */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-navy-800/60 border border-navy-700/40">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-navy-500 to-navy-300 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-white font-semibold leading-none">{user?.name}</p>
                  <p className="text-xs text-navy-400 leading-none mt-0.5">{user?.email?.split("@")[0]}...</p>
                </div>
              </div>

              {/* Theme toggle */}
              <button onClick={toggleTheme}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-navy-300 hover:text-white hover:bg-navy-700/60 transition-all duration-200">
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>

              {/* Logout button */}
              <button onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-navy-700/80 hover:bg-red-500/20 border border-navy-600/50 hover:border-red-500/40 text-navy-200 hover:text-red-300 text-sm font-semibold transition-all duration-200">
                <LogoutIcon />
                Logout
              </button>
            </div>

            {/* ── Mobile right ── */}
            <div className="sm:hidden flex items-center gap-2">
              <button onClick={toggleTheme}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-navy-300 hover:text-white transition">
                {isDark ? <SunIcon /> : <MoonIcon />}
              </button>
              <button onClick={() => setMenuOpen((o) => !o)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-navy-300 hover:text-white hover:bg-navy-700/50 transition">
                {menuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>

          {/* ── Mobile Menu ── */}
          {menuOpen && (
            <div className="sm:hidden pb-4 pt-3 border-t border-navy-700/40 mt-1 animate-fade-in space-y-3">

              {/* User info */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-800/60 border border-navy-700/40">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-500 to-navy-300 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm font-bold">{user?.name}</p>
                  <p className="text-navy-400 text-xs">{user?.email}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${role.color}`}>{role.label}</span>
              </div>

              {/* Active page */}
              {navLink && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-navy-700/50 border border-navy-600/40 text-white text-sm font-semibold">
                  <span>{navLink.icon}</span>
                  <span>{navLink.label}</span>
                  <span className="ml-auto w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
              )}

              {/* Logout */}
              <button onClick={() => { setMenuOpen(false); setShowLogoutConfirm(true); }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-sm font-semibold transition">
                <LogoutIcon />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── Logout Confirmation Dialog ── */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-navy-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-navy-900 border border-navy-700/60 rounded-2xl p-6 shadow-2xl shadow-navy-950/50 w-full max-w-sm animate-fade-in-up">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 border border-red-500/20 flex items-center justify-center text-2xl mx-auto mb-4">
              👋
            </div>
            <h3 className="font-bold text-white text-lg text-center mb-1">Leaving so soon?</h3>
            <p className="text-navy-400 text-sm text-center mb-6">Are you sure you want to logout from Vanguard?</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 border border-navy-600/50 text-navy-200 text-sm font-semibold transition">
                Cancel
              </button>
              <button onClick={handleLogout}
                className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white text-sm font-bold transition shadow-md shadow-red-500/25">
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;