import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SurveyForm from "../components/SurveyForm";
import NeedsChart from "../components/NeedsChart";
import MatchResult from "../components/MatchResult";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { StatCardSkeleton, ChartSkeleton, MatchCardSkeleton } from "../components/Skeleton";
import { NoSurveysEmpty, NoDataChartEmpty } from "../components/EmptyStates";
import API from "../api/axios";

const StatCard = ({ icon, label, value, color, loading }) => {
  if (loading) return <StatCardSkeleton />;
  return (
    <div className="card-hover bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-5 shadow-sm">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${color}`}>{icon}</div>
      <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm font-medium text-gray-600 dark:text-navy-300 mt-0.5">{label}</p>
    </div>
  );
};

const NGODashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [needs, setNeeds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);

  const fetchNeeds = async () => {
    try { const { data } = await API.get("/api/surveys/needs"); setNeeds(data); } catch {}
  };

  const fetchMatches = async () => {
    setLoadingMatches(true);
    try { const { data } = await API.get("/api/matches"); setMatches(data); }
    catch {} finally { setLoadingMatches(false); }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchNeeds(), fetchMatches()]).finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: "overview",  label: "Overview",   icon: "🏠" },
    { id: "survey",    label: "New Survey", icon: "📋" },
    { id: "analytics", label: "Analytics",  icon: "📊" },
    { id: "matches",   label: "Matches",    icon: "🤝" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-950 transition-colors duration-300">
        <Navbar />
        <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">
          <div className="mb-8">
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
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <StatCard loading={loading} icon="📋" label="Surveys Submitted" value={needs.length}                                    color="bg-navy-50 dark:bg-navy-800/60" />
                <StatCard loading={loading} icon="🤝" label="Active Matches"    value={matches.filter(m=>m.status==="accepted").length}  color="bg-emerald-50 dark:bg-emerald-500/15" />
                <StatCard loading={loading} icon="⏳" label="Pending Review"    value={matches.filter(m=>m.status==="suggested").length} color="bg-amber-50 dark:bg-amber-500/15" />
                <StatCard loading={loading} icon="✅" label="Completed"         value={matches.filter(m=>m.status==="completed").length} color="bg-blue-50 dark:bg-blue-500/15" />
              </div>
              {loading ? <ChartSkeleton /> : needs.length === 0 ? <NoDataChartEmpty /> : <NeedsChart needs={needs} />}
            </div>
          )}

          {activeTab === "survey" && (
            <div className="max-w-lg animate-fade-in">
              <SurveyForm onSuccess={() => { fetchNeeds(); setActiveTab("analytics"); }} />
            </div>
          )}

          {activeTab === "analytics" && (
            <div className="animate-fade-in">
              {loading ? <ChartSkeleton /> : needs.length === 0 ? (
                <NoSurveysEmpty onAdd={() => setActiveTab("survey")} />
              ) : <NeedsChart needs={needs} />}
            </div>
          )}

          {activeTab === "matches" && (
            <div className="animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-gray-900 dark:text-white text-base">Volunteer Matches ({matches.length})</h2>
                <button onClick={fetchMatches} className="text-xs text-navy-600 dark:text-navy-300 hover:text-navy-800 dark:hover:text-white font-semibold transition">🔄 Refresh</button>
              </div>
              {loadingMatches ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => <MatchCardSkeleton key={i} />)}
                </div>
              ) : matches.length === 0 ? (
                <NoSurveysEmpty onAdd={() => setActiveTab("survey")} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
                  {matches.map((match) => <MatchResult key={match._id} match={match} />)}
                </div>
              )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </PageTransition>
  );
};

export default NGODashboard;