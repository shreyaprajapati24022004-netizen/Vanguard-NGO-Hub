import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import MatchResult from "../components/MatchResult";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [available, setAvailable] = useState(user?.isAvailable ?? true);
  const [togglingAvail, setTogglingAvail] = useState(false);
  const [activeTab, setActiveTab] = useState("matches");

  const fetchMatches = async () => {
    setLoading(true);
    try { const { data } = await API.get("/api/matches/volunteer"); setMatches(data); } catch {} finally { setLoading(false); }
  };

  const toggleAvailability = async () => {
    setTogglingAvail(true);
    try {
      await API.patch("/api/volunteers/availability", { isAvailable: !available });
      setAvailable((a) => !a);
      toast.success(`You are now ${!available ? "available" : "unavailable"}`);
    } catch { toast.error("Could not update availability"); } finally { setTogglingAvail(false); }
  };

  useEffect(() => { fetchMatches(); }, []);

  const pending   = matches.filter((m) => m.status === "suggested");
  const accepted  = matches.filter((m) => m.status === "accepted");
  const completed = matches.filter((m) => m.status === "completed");

  const tabs = [
    { id: "matches", label: "All", icon: "🤝", count: matches.length },
    { id: "pending", label: "Pending", icon: "⏳", count: pending.length },
    { id: "accepted", label: "Accepted", icon: "✅", count: accepted.length },
    { id: "completed", label: "Done", icon: "🏆", count: completed.length },
  ];
  const displayMatches = { matches, pending, accepted, completed }[activeTab] || [];

  const Spinner = () => (
    <div className="flex items-center justify-center py-16">
      <svg className="animate-spin h-8 w-8 text-navy-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-navy-950 transition-colors duration-300">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-6 shadow-sm mb-8 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-navy-600 to-navy-300 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-navy-600/25 flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-display font-bold text-xl text-gray-900 dark:text-white">{user?.name}</h1>
              <p className="text-sm text-gray-500 dark:text-navy-400">{user?.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {user?.location && <span className="text-xs bg-gray-100 dark:bg-navy-800 text-gray-600 dark:text-navy-300 px-2.5 py-1 rounded-lg">📍 {user.location}</span>}
                {user?.skills?.map((s, i) => (
                  <span key={i} className="text-xs bg-navy-50 dark:bg-navy-700/60 text-navy-700 dark:text-navy-200 px-2.5 py-1 rounded-lg border border-navy-100 dark:border-navy-600/40">{s}</span>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3 sm:ml-auto">
              <div className="text-right">
                <p className="text-xs font-medium text-gray-500 dark:text-navy-400">Availability</p>
                <p className={`text-sm font-bold ${available ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"}`}>{available ? "Active" : "Inactive"}</p>
              </div>
              <button onClick={toggleAvailability} disabled={togglingAvail}
                className={`w-12 h-6 rounded-full relative transition-all duration-300 ${available ? "bg-emerald-500" : "bg-gray-300 dark:bg-navy-700"} disabled:opacity-60`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${available ? "left-6" : "left-0.5"}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 stagger-children">
          {[
            { label: "Total Matches", value: matches.length, icon: "🤝", color: "bg-navy-50 dark:bg-navy-800/60" },
            { label: "Pending", value: pending.length, icon: "⏳", color: "bg-amber-50 dark:bg-amber-500/15" },
            { label: "Accepted", value: accepted.length, icon: "✅", color: "bg-emerald-50 dark:bg-emerald-500/15" },
            { label: "Completed", value: completed.length, icon: "🏆", color: "bg-blue-50 dark:bg-blue-500/15" },
          ].map((s, i) => (
            <div key={i} className="card-hover bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-4 shadow-sm">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2 ${s.color}`}>{s.icon}</div>
              <p className="text-xl font-display font-bold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-navy-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-1 bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-1.5 mb-6 shadow-sm w-fit">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab.id ? "bg-navy-600 text-white shadow-md shadow-navy-700/30" : "text-gray-500 dark:text-navy-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-navy-800/50"}`}>
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
              {tab.count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300"}`}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-gray-900 dark:text-white text-sm">{displayMatches.length} {activeTab} match{displayMatches.length !== 1 ? "es" : ""}</h2>
            <button onClick={fetchMatches} className="text-xs text-navy-600 dark:text-navy-300 hover:text-navy-800 dark:hover:text-white font-semibold transition">🔄 Refresh</button>
          </div>
          {loading ? <Spinner /> : displayMatches.length === 0 ? (
            <div className="text-center py-16 text-gray-400 dark:text-navy-500">
              <div className="text-5xl mb-3">🎯</div>
              <p className="font-display font-semibold">No {activeTab} matches</p>
              <p className="text-sm mt-1">Keep your availability on to get matched</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
              {displayMatches.map((match) => <MatchResult key={match._id} match={match} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;