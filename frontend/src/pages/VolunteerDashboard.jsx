import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MatchResult from "../components/MatchResult";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { MatchCardSkeleton, StatCardSkeleton } from "../components/Skeleton";
import { NoMatchesEmpty, NoPendingEmpty, NoAcceptedEmpty, NoCompletedEmpty } from "../components/EmptyStates";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [available, setAvailable] = useState(user?.isAvailable ?? true);
  const [togglingAvail, setTogglingAvail] = useState(false);
  const [activeTab, setActiveTab] = useState("matches");

  const fetchMatches = async () => {
    setLoading(true);
    try { const { data } = await API.get("/api/matches/my"); setMatches(data); }
    catch {} finally { setLoading(false); }
  };

  const toggleAvailability = async () => {
    setTogglingAvail(true);
    try {
      await API.patch("/api/volunteers/availability", { isAvailable: !available });
      setAvailable((a) => !a);
      toast.success(`You are now ${!available ? "available" : "unavailable"}`);
    } catch { toast.error("Could not update availability"); }
    finally { setTogglingAvail(false); }
  };

  useEffect(() => { fetchMatches(); }, []);

  const pending   = matches.filter((m) => m.status === "suggested");
  const accepted  = matches.filter((m) => m.status === "accepted");
  const completed = matches.filter((m) => m.status === "completed");

  const tabs = [
    { id: "matches",   label: "All",      icon: "🤝", count: matches.length,   color: "text-navy-600" },
    { id: "pending",   label: "Pending",  icon: "⏳", count: pending.length,   color: "text-amber-600" },
    { id: "accepted",  label: "Accepted", icon: "✅", count: accepted.length,  color: "text-emerald-600" },
    { id: "completed", label: "Done",     icon: "🏆", count: completed.length, color: "text-blue-600" },
  ];

  const displayMatches = { matches, pending, accepted, completed }[activeTab] || [];

  const emptyComponents = {
    matches:   <NoMatchesEmpty onRefresh={fetchMatches} />,
    pending:   <NoPendingEmpty />,
    accepted:  <NoAcceptedEmpty />,
    completed: <NoCompletedEmpty />,
  };

  const statCards = [
    { label: "Total Matches", value: matches.length,   icon: "🤝", bg: "from-navy-500 to-navy-700",     light: "bg-navy-50 dark:bg-navy-800/60",       text: "text-navy-700 dark:text-navy-200" },
    { label: "Pending",       value: pending.length,   icon: "⏳", bg: "from-amber-400 to-amber-600",   light: "bg-amber-50 dark:bg-amber-500/15",     text: "text-amber-700 dark:text-amber-300" },
    { label: "Accepted",      value: accepted.length,  icon: "✅", bg: "from-emerald-400 to-emerald-600", light: "bg-emerald-50 dark:bg-emerald-500/15", text: "text-emerald-700 dark:text-emerald-300" },
    { label: "Completed",     value: completed.length, icon: "🏆", bg: "from-blue-400 to-blue-600",     light: "bg-blue-50 dark:bg-blue-500/15",       text: "text-blue-700 dark:text-blue-300" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-950 transition-colors duration-300">
        <Navbar />

        {/* ── Hero Banner ── */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 border-b border-navy-700/50">
          <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex items-center gap-4 flex-1">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur border border-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-lg flex-shrink-0">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-navy-300 text-sm font-medium">{getGreeting()},</p>
                  <h1 className="font-bold text-2xl text-white">{user?.name} 👋</h1>
                  <p className="text-navy-400 text-xs mt-0.5">{user?.email}</p>
                </div>
              </div>

              {/* Availability toggle */}
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-2xl px-4 py-3 border border-white/15">
                <div>
                  <p className="text-xs font-medium text-navy-300">Availability</p>
                  <p className={`text-sm font-bold ${available ? "text-emerald-400" : "text-red-400"}`}>
                    {available ? "🟢 Active" : "🔴 Inactive"}
                  </p>
                </div>
                <button onClick={toggleAvailability} disabled={togglingAvail}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 ${available ? "bg-emerald-500" : "bg-gray-600"} disabled:opacity-60`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${available ? "left-6" : "left-0.5"}`} />
                </button>
              </div>
            </div>

            {/* Skills + location tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {user?.location && (
                <span className="text-xs bg-white/10 backdrop-blur border border-white/15 text-navy-200 px-3 py-1 rounded-full">
                  📍 {user.location}
                </span>
              )}
              {user?.skills?.map((s, i) => (
                <span key={i} className="text-xs bg-navy-600/50 border border-navy-500/40 text-navy-200 px-3 py-1 rounded-full">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">

          {/* ── Stat Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {loading ? [...Array(4)].map((_, i) => <StatCardSkeleton key={i} />) : (
              statCards.map((s, i) => (
                <div key={i} className="card-hover bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-5 shadow-sm overflow-hidden relative">
                  <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 bg-gradient-to-br ${s.bg}`} />
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${s.light}`}>{s.icon}</div>
                  <p className={`text-2xl font-bold mb-0.5 ${s.text}`}>{s.value}</p>
                  <p className="text-xs text-gray-500 dark:text-navy-400 font-medium">{s.label}</p>
                </div>
              ))
            )}
          </div>

          {/* ── Tab Bar ── */}
          <div className="flex gap-1 bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-1.5 mb-6 shadow-sm w-fit overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-navy-600 text-white shadow-md shadow-navy-700/30"
                    : "text-gray-500 dark:text-navy-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-navy-800/50"
                }`}>
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                    activeTab === tab.id ? "bg-white/20 text-white" : "bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Match List ── */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-gray-900 dark:text-white text-sm">
                  {displayMatches.length} {activeTab === "matches" ? "total" : activeTab} match{displayMatches.length !== 1 ? "es" : ""}
                </h2>
                {activeTab === "matches" && !loading && matches.length === 0 && (
                  <p className="text-xs text-gray-400 dark:text-navy-500 mt-0.5">Admin will trigger matching based on community needs</p>
                )}
              </div>
              <button onClick={fetchMatches}
                className="flex items-center gap-1.5 text-xs text-navy-600 dark:text-navy-300 hover:text-navy-800 dark:hover:text-white font-semibold transition bg-navy-50 dark:bg-navy-800/60 px-3 py-1.5 rounded-lg">
                🔄 Refresh
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <MatchCardSkeleton key={i} />)}
              </div>
            ) : displayMatches.length === 0 ? emptyComponents[activeTab] : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
                {displayMatches.map((match) => (
                  <MatchResult key={match._id} match={match} onStatusUpdate={fetchMatches} />
                ))}
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default VolunteerDashboard;