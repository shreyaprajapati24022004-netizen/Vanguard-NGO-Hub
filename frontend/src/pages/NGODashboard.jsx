import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SurveyForm from "../components/SurveyForm";
import NeedsChart from "../components/NeedsChart";
import MatchResult from "../components/MatchResult";
import API from "../api/axios";

const StatCard = ({ icon, label, value, color }) => (
  <div className="card-hover bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-5 shadow-sm">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${color}`}>{icon}</div>
    <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm font-medium text-gray-600 dark:text-navy-300 mt-0.5">{label}</p>
  </div>
);

const NGODashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [needs, setNeeds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loadingNeeds, setLoadingNeeds] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const fetchNeeds = async () => {
    setLoadingNeeds(true);
    try { const { data } = await API.get("/api/surveys/needs"); setNeeds(data); } catch {} finally { setLoadingNeeds(false); }
  };
  const fetchMatches = async () => {
    setLoadingMatches(true);
    try { const { data } = await API.get("/api/matches"); setMatches(data); } catch {} finally { setLoadingMatches(false); }
  };

  useEffect(() => { fetchNeeds(); fetchMatches(); }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "survey", label: "New Survey", icon: "📋" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "matches", label: "Matches", icon: "🤝" },
  ];

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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">NGO Dashboard</h1>
          <p className="text-gray-500 dark:text-navy-400 text-sm mt-1">Manage community needs and volunteer matches</p>
        </div>

        <div className="flex gap-1 bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-1.5 mb-8 shadow-sm w-fit">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${activeTab === tab.id ? "bg-navy-600 text-white shadow-md shadow-navy-700/30" : "text-gray-500 dark:text-navy-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-navy-800/50"}`}>
              <span>{tab.icon}</span><span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children">
              <StatCard icon="📋" label="Surveys Submitted" value={needs.length || 0} color="bg-navy-50 dark:bg-navy-800/60" />
              <StatCard icon="🤝" label="Active Matches" value={matches.filter(m => m.status === "accepted").length} color="bg-emerald-50 dark:bg-emerald-500/15" />
              <StatCard icon="⏳" label="Pending Review" value={matches.filter(m => m.status === "suggested").length} color="bg-amber-50 dark:bg-amber-500/15" />
              <StatCard icon="✅" label="Completed" value={matches.filter(m => m.status === "completed").length} color="bg-blue-50 dark:bg-blue-500/15" />
            </div>
            <NeedsChart needs={needs} />
          </div>
        )}

        {activeTab === "survey" && (
          <div className="max-w-lg animate-fade-in">
            <SurveyForm onSuccess={() => { fetchNeeds(); setActiveTab("analytics"); }} />
          </div>
        )}

        {activeTab === "analytics" && (
          <div className="animate-fade-in">
            {loadingNeeds ? <Spinner /> : <NeedsChart needs={needs} />}
          </div>
        )}

        {activeTab === "matches" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-gray-900 dark:text-white text-base">Volunteer Matches ({matches.length})</h2>
              <button onClick={fetchMatches} className="text-xs text-navy-600 dark:text-navy-300 hover:text-navy-800 dark:hover:text-white font-semibold transition">🔄 Refresh</button>
            </div>
            {loadingMatches ? <Spinner /> : matches.length === 0 ? (
              <div className="text-center py-16 text-gray-400 dark:text-navy-500">
                <div className="text-5xl mb-3">🤝</div>
                <p className="font-display font-semibold">No matches yet</p>
                <p className="text-sm mt-1">Submit a survey to get volunteer matches</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
                {matches.map((match) => <MatchResult key={match._id} match={match} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NGODashboard;