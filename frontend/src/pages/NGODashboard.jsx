import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SurveyForm from "../components/SurveyForm";
import NeedsChart from "../components/NeedsChart";
import MatchResult from "../components/MatchResult";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { StatCardSkeleton, ChartSkeleton, MatchCardSkeleton } from "../components/Skeleton";
import { NoSurveysEmpty, NoDataChartEmpty } from "../components/EmptyStates";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";

const StatCard = ({ icon, label, value, color, textColor, loading }) => {
  if (loading) return <StatCardSkeleton />;
  return (
    <div className="card-hover bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-5 shadow-sm overflow-hidden relative">
      <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 ${color}`} />
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${color}`}>{icon}</div>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
      <p className="text-sm font-medium text-gray-500 dark:text-navy-400 mt-0.5">{label}</p>
    </div>
  );
};

const urgencyConfig = {
  low:      { color: "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-500/20",         dot: "bg-blue-500",              label: "Low" },
  medium:   { color: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-500/20",   dot: "bg-amber-500",             label: "Medium" },
  high:     { color: "bg-orange-50 dark:bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-500/20", dot: "bg-orange-500",          label: "High" },
  critical: { color: "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/20",               dot: "bg-red-500 animate-pulse", label: "Critical" },
};

const categoryIcons = {
  food: "🍱", education: "📚", health: "🏥",
  shelter: "🏠", clothing: "👕", other: "🌟"
};

const NeedCard = ({ need }) => {
  const urgency = urgencyConfig[need.urgencyLevel] || urgencyConfig.medium;
  return (
    <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">{categoryIcons[need.category] || "🌟"}</span>
          <div>
            <p className="font-bold text-gray-900 dark:text-white text-sm capitalize">{need.category}</p>
            <p className="text-xs text-gray-400 dark:text-navy-500">📍 {need.area}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border flex items-center gap-1 flex-shrink-0 ${urgency.color}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${urgency.dot}`} />
          {urgency.label}
        </span>
      </div>
      {need.description && (
        <p className="text-xs text-gray-500 dark:text-navy-400 leading-relaxed mb-3 line-clamp-2">{need.description}</p>
      )}
      <div className="flex items-center justify-between text-xs text-gray-400 dark:text-navy-500 pt-2 border-t border-gray-50 dark:border-navy-800/60">
        <span>👥 {need.totalReports || 1} report{(need.totalReports || 1) !== 1 ? "s" : ""}</span>
        <span>🎯 Urgency: {need.urgencyScore || 0}/10</span>
      </div>
    </div>
  );
};

const NGODashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [needs, setNeeds] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [matchFilter, setMatchFilter] = useState("all");

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
    { id: "matches",   label: "Matches",    icon: "🤝", count: matches.length },
  ];

  const statCards = [
    { icon: "📋", label: "Surveys Submitted", value: needs.length,                                    color: "bg-navy-100 dark:bg-navy-700",          textColor: "text-navy-700 dark:text-navy-200" },
    { icon: "🤝", label: "Active Matches",    value: matches.filter(m=>m.status==="accepted").length,  color: "bg-emerald-100 dark:bg-emerald-500/20", textColor: "text-emerald-700 dark:text-emerald-300" },
    { icon: "⏳", label: "Pending Review",    value: matches.filter(m=>m.status==="suggested").length, color: "bg-amber-100 dark:bg-amber-500/20",    textColor: "text-amber-700 dark:text-amber-300" },
    { icon: "✅", label: "Completed",         value: matches.filter(m=>m.status==="completed").length, color: "bg-blue-100 dark:bg-blue-500/20",      textColor: "text-blue-700 dark:text-blue-300" },
  ];

  const filteredMatches = matchFilter === "all"
    ? matches
    : matches.filter((m) => m.status === matchFilter);

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-950 transition-colors duration-300">
        <Navbar />

        {/* ── Hero Header ── */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 border-b border-navy-700/50">
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center text-2xl font-bold text-white shadow-lg flex-shrink-0">
                🏢
              </div>
              <div className="flex-1">
                <p className="text-navy-400 text-sm font-medium">Welcome back,</p>
                <h1 className="font-bold text-2xl text-white">{user?.name}</h1>
                <p className="text-navy-400 text-sm mt-0.5">Manage community needs and volunteer matches</p>
              </div>
              <button onClick={() => setActiveTab("survey")}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-sm font-semibold transition backdrop-blur">
                📋 New Survey
              </button>
            </div>

            {/* Quick stats in hero */}
            <div className="flex gap-4 mt-5 pt-4 border-t border-white/10">
              {[
                { label: "Surveys", value: needs.length, icon: "📋" },
                { label: "Active Matches", value: matches.filter(m=>m.status==="accepted").length, icon: "🤝" },
                { label: "Pending", value: matches.filter(m=>m.status==="suggested").length, icon: "⏳" },
                { label: "Completed", value: matches.filter(m=>m.status==="completed").length, icon: "✅" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm">{s.icon}</span>
                  <span className="text-white font-bold text-sm">{s.value}</span>
                  <span className="text-navy-400 text-xs">{s.label}</span>
                  {i < 3 && <span className="text-navy-600 ml-2">·</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-8">

          {/* ── Tabs ── */}
          <div className="flex gap-1 bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-1.5 mb-8 shadow-sm w-fit overflow-x-auto">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-navy-600 text-white shadow-md shadow-navy-700/30"
                    : "text-gray-500 dark:text-navy-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-navy-800/50"
                }`}>
                <span>{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300"}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* ── Overview Tab ── */}
          {activeTab === "overview" && (
            <div className="space-y-8 animate-fade-in">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {statCards.map((s, i) => (
                  <StatCard key={i} loading={loading} icon={s.icon} label={s.label} value={s.value} color={s.color} textColor={s.textColor} />
                ))}
              </div>

              {!loading && needs.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-gray-900 dark:text-white text-base">Recent Community Needs</h2>
                    <button onClick={() => setActiveTab("analytics")}
                      className="text-xs text-navy-600 dark:text-navy-300 hover:text-navy-800 dark:hover:text-white font-semibold transition">
                      View Analytics →
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {needs.slice(0, 3).map((need, i) => <NeedCard key={i} need={need} />)}
                  </div>
                </div>
              )}

              {loading ? <ChartSkeleton /> : needs.length === 0 ? <NoDataChartEmpty /> : <NeedsChart needs={needs} showSummary={false} />}
            </div>
          )}

          {/* ── Survey Tab ── */}
          {activeTab === "survey" && (
            <div className="animate-fade-in">
              <div className="mb-6">
                <h2 className="font-bold text-gray-900 dark:text-white text-lg">Submit Community Need Survey</h2>
                <p className="text-gray-500 dark:text-navy-400 text-sm mt-1">Report a need in your community to get matched with volunteers</p>
              </div>

              {/* Two column layout on desktop */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Form — takes 3 cols */}
                <div className="lg:col-span-3">
                  <SurveyForm onSuccess={() => { fetchNeeds(); setActiveTab("analytics"); }} />
                </div>

                {/* Info panel — takes 2 cols */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-5 shadow-sm">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">💡 How it works</h3>
                    <div className="space-y-4">
                      {[
                        { step: "1", icon: "📋", title: "Submit Survey",    desc: "Fill in details about the community need" },
                        { step: "2", icon: "🤖", title: "AI Matching",      desc: "Our AI matches volunteers to your need" },
                        { step: "3", icon: "🙋", title: "Volunteer Accepts", desc: "Matched volunteer reviews and accepts" },
                        { step: "4", icon: "✅", title: "Need Fulfilled",    desc: "Volunteer completes the task" },
                      ].map((item) => (
                        <div key={item.step} className="flex items-start gap-3">
                          <div className="w-7 h-7 rounded-lg bg-navy-100 dark:bg-navy-700 flex items-center justify-center text-xs font-bold text-navy-600 dark:text-navy-300 flex-shrink-0">
                            {item.step}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-800 dark:text-white">{item.icon} {item.title}</p>
                            <p className="text-xs text-gray-400 dark:text-navy-500 mt-0.5">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-navy-800 to-navy-700 border border-navy-600/40 rounded-2xl p-5">
                    <h3 className="font-bold text-white text-sm mb-2">📊 Your Stats</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-navy-300">Total Surveys</span>
                        <span className="text-white font-bold">{needs.length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-navy-300">Active Matches</span>
                        <span className="text-emerald-400 font-bold">{matches.filter(m=>m.status==="accepted").length}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-navy-300">Completed</span>
                        <span className="text-blue-400 font-bold">{matches.filter(m=>m.status==="completed").length}</span>
                      </div>
                    </div>
                  </div>

                 
                </div>
              </div>
            </div>
          )}

          {/* ── Analytics Tab ── */}
          {activeTab === "analytics" && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white text-base">Community Needs Analytics</h2>
                  <p className="text-gray-500 dark:text-navy-400 text-xs mt-0.5">{needs.length} total surveys submitted</p>
                </div>
                <button onClick={() => setActiveTab("survey")}
                  className="flex items-center gap-1.5 text-xs bg-navy-600 hover:bg-navy-500 text-white px-3 py-2 rounded-xl font-semibold transition shadow-sm">
                  + Add Survey
                </button>
              </div>
              {loading ? <ChartSkeleton /> : needs.length === 0 ? (
                <NoSurveysEmpty onAdd={() => setActiveTab("survey")} />
              ) : (
                <>
                  <NeedsChart needs={needs} showSummary={true} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {needs.map((need, i) => <NeedCard key={i} need={need} />)}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── Matches Tab ── */}
          {activeTab === "matches" && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white text-base">Volunteer Matches</h2>
                  <p className="text-gray-500 dark:text-navy-400 text-xs mt-0.5">{matches.length} total matches</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-xl p-1">
                    {[
                      { value: "all",       label: "All" },
                      { value: "suggested", label: "Pending" },
                      { value: "accepted",  label: "Active" },
                      { value: "completed", label: "Done" },
                    ].map((f) => (
                      <button key={f.value} onClick={() => setMatchFilter(f.value)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                          matchFilter === f.value
                            ? "bg-navy-600 text-white shadow-sm"
                            : "text-gray-500 dark:text-navy-400 hover:text-gray-900 dark:hover:text-white"
                        }`}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <button onClick={fetchMatches}
                    className="flex items-center gap-1.5 text-xs text-navy-600 dark:text-navy-300 hover:text-navy-800 dark:hover:text-white font-semibold transition bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700/60 px-3 py-2 rounded-xl">
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {loadingMatches ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(4)].map((_, i) => <MatchCardSkeleton key={i} />)}
                </div>
              ) : filteredMatches.length === 0 ? (
                <NoSurveysEmpty onAdd={() => setActiveTab("survey")} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger-children">
                  {filteredMatches.map((match) => <MatchResult key={match._id} match={match} />)}
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