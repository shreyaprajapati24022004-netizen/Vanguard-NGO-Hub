import { useState, useEffect, useMemo } from "react";
import Navbar from "../components/Navbar";
import VolunteerCard from "../components/VolunteerCard";
import NeedsChart from "../components/NeedsChart";
import Footer from "../components/Footer";
import PageTransition from "../components/PageTransition";
import { VolunteerCardSkeleton, StatCardSkeleton, ChartSkeleton, TableRowSkeleton } from "../components/Skeleton";
import { NoVolunteersEmpty, NoUsersEmpty, NoDataChartEmpty } from "../components/EmptyStates";
import API from "../api/axios";
import toast from "react-hot-toast";

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

const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [volunteers, setVolunteers] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [triggeringMatch, setTriggeringMatch] = useState(false);
  const [volunteerSearch, setVolunteerSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [v, n, u] = await Promise.allSettled([
        API.get("/api/volunteers"),
        API.get("/api/surveys/needs"),
        API.get("/api/admin/users"),
      ]);
      if (v.status === "fulfilled") setVolunteers(v.value.data);
      if (n.status === "fulfilled") setNeeds(n.value.data);
      if (u.status === "fulfilled") setUsers(u.value.data);
    } finally { setLoading(false); }
  };

  const triggerMatching = async () => {
    setTriggeringMatch(true);
    try {
      await API.post("/api/matches/trigger");
      toast.success("AI matching triggered!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Matching failed!");
    } finally { setTriggeringMatch(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const filteredVolunteers = useMemo(() =>
    volunteers.filter((v) =>
      v.name?.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      v.location?.toLowerCase().includes(volunteerSearch.toLowerCase()) ||
      v.skills?.some((s) => s.toLowerCase().includes(volunteerSearch.toLowerCase()))
    ), [volunteers, volunteerSearch]);

  const filteredUsers = useMemo(() =>
    users.filter((u) => {
      const matchesSearch =
        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.location?.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = userRoleFilter === "all" || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    }), [users, userSearch, userRoleFilter]);

  const tabs = [
    { id: "overview",   label: "Overview",   icon: "🏠" },
    { id: "volunteers", label: "Volunteers", icon: "🙋" },
    { id: "analytics",  label: "Analytics",  icon: "📊" },
    { id: "users",      label: "All Users",  icon: "👥" },
  ];

  const roleCount = (role) => users.filter((u) => u.role === role).length;

  const statCards = [
    { icon: "👥", label: "Total Users",     value: users.length,           color: "bg-navy-100 dark:bg-navy-700",        textColor: "text-navy-700 dark:text-navy-100" },
    { icon: "🙋", label: "Volunteers",      value: roleCount("volunteer"), color: "bg-teal-100 dark:bg-teal-500/20",     textColor: "text-teal-700 dark:text-teal-300" },
    { icon: "🏢", label: "NGOs",            value: roleCount("ngo"),       color: "bg-indigo-100 dark:bg-indigo-500/20", textColor: "text-indigo-700 dark:text-indigo-300" },
    { icon: "📋", label: "Community Needs", value: needs.length,           color: "bg-amber-100 dark:bg-amber-500/20",   textColor: "text-amber-700 dark:text-amber-300" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-navy-950 transition-colors duration-300">
        <Navbar />

        {/* ── Hero Header ── */}
        <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-navy-700 border-b border-navy-700/50">
          <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-navy-400 text-sm font-medium mb-1">Welcome back, Admin 👋</p>
                <h1 className="font-bold text-2xl text-white">Admin Dashboard</h1>
                <p className="text-navy-400 text-sm mt-1">Platform overview and management</p>
              </div>
              <button onClick={triggerMatching} disabled={triggeringMatch}
                className="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 disabled:opacity-60 border border-white/20 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md self-start sm:self-auto backdrop-blur">
                {triggeringMatch ? (
                  <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Matching...</>
                ) : <><span>🤖</span><span>Trigger AI Matching</span></>}
              </button>
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
                <span>{tab.icon}</span><span>{tab.label}</span>
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
              {/* ← showSummary={false} prevents duplicate stat cards */}
              {loading ? <ChartSkeleton /> : needs.length === 0 ? <NoDataChartEmpty /> : <NeedsChart needs={needs} showSummary={false} />}
            </div>
          )}

          {/* ── Volunteers Tab ── */}
          {activeTab === "volunteers" && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h2 className="font-bold text-gray-900 dark:text-white text-base">
                  Registered Volunteers
                  <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300">
                    {filteredVolunteers.length}/{volunteers.length}
                  </span>
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-navy-500">
                      <SearchIcon />
                    </span>
                    <input
                      type="text" placeholder="Search name, skill, location..."
                      value={volunteerSearch} onChange={(e) => setVolunteerSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700/60 rounded-xl text-gray-700 dark:text-navy-200 placeholder-gray-400 dark:placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/30 w-56"
                    />
                  </div>
                  <button onClick={fetchAll}
                    className="flex items-center gap-1.5 text-xs text-navy-600 dark:text-navy-300 hover:text-navy-800 dark:hover:text-white font-semibold transition bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700/60 px-3 py-2 rounded-xl">
                    🔄 Refresh
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(6)].map((_, i) => <VolunteerCardSkeleton key={i} />)}
                </div>
              ) : filteredVolunteers.length === 0 ? (
                <NoVolunteersEmpty />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                  {filteredVolunteers.map((v) => <VolunteerCard key={v._id} volunteer={v} />)}
                </div>
              )}
            </div>
          )}

          {/* ── Analytics Tab ── */}
          {activeTab === "analytics" && (
            <div className="animate-fade-in space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-gray-900 dark:text-white text-base">Community Needs Analytics</h2>
                <span className="text-xs text-gray-400 dark:text-navy-500">{needs.length} total needs</span>
              </div>
              {loading ? <ChartSkeleton /> : needs.length === 0 ? <NoDataChartEmpty /> : <NeedsChart needs={needs} showSummary={true} />}
            </div>
          )}

          {/* ── Users Tab ── */}
          {activeTab === "users" && (
            <div className="animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <h2 className="font-bold text-gray-900 dark:text-white text-base">
                  All Users
                  <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300">
                    {filteredUsers.length}/{users.length}
                  </span>
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-navy-500">
                      <SearchIcon />
                    </span>
                    <input
                      type="text" placeholder="Search users..."
                      value={userSearch} onChange={(e) => setUserSearch(e.target.value)}
                      className="pl-9 pr-4 py-2 text-sm bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700/60 rounded-xl text-gray-700 dark:text-navy-200 placeholder-gray-400 dark:placeholder-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-500/30 w-48"
                    />
                  </div>
                  <select value={userRoleFilter} onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="py-2 px-3 text-sm bg-white dark:bg-navy-900 border border-gray-200 dark:border-navy-700/60 rounded-xl text-gray-700 dark:text-navy-200 focus:outline-none focus:ring-2 focus:ring-navy-500/30">
                    <option value="all">All Roles</option>
                    <option value="admin">Admin</option>
                    <option value="ngo">NGO</option>
                    <option value="volunteer">Volunteer</option>
                  </select>
                </div>
              </div>

              {loading ? (
                <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-navy-700/60 bg-gray-50 dark:bg-navy-800/40">
                        {["User","Email","Role","Location"].map(h => (
                          <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-500 dark:text-navy-400 text-xs uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>{[...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)}</tbody>
                  </table>
                </div>
              ) : filteredUsers.length === 0 ? <NoUsersEmpty /> : (
                <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-navy-700/60 bg-gray-50 dark:bg-navy-800/40">
                          {["User","Email","Role","Location"].map(h => (
                            <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-500 dark:text-navy-400 text-xs uppercase tracking-wide">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-navy-800/60">
                        {filteredUsers.map((u) => (
                          <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-navy-800/30 transition-colors group">
                            <td className="px-5 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-600 to-navy-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                                  {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">{u.name}</p>
                                  {u.location && <p className="text-xs text-gray-400 dark:text-navy-500 sm:hidden">📍 {u.location}</p>}
                                </div>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 text-gray-500 dark:text-navy-300 text-xs">{u.email}</td>
                            <td className="px-5 py-3.5">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                                u.role === "admin"
                                  ? "bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-500/20"
                                  : u.role === "ngo"
                                  ? "bg-navy-50 dark:bg-navy-700/60 text-navy-700 dark:text-navy-200 border-navy-200 dark:border-navy-600/30"
                                  : "bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-500/20"
                              }`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-gray-500 dark:text-navy-300 text-xs">
                              {u.location || <span className="text-gray-300 dark:text-navy-600 italic">Not set</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-5 py-3 border-t border-gray-50 dark:border-navy-800/60 bg-gray-50/50 dark:bg-navy-800/20">
                    <p className="text-xs text-gray-400 dark:text-navy-500">
                      Showing <span className="font-semibold text-gray-600 dark:text-navy-300">{filteredUsers.length}</span> of <span className="font-semibold text-gray-600 dark:text-navy-300">{users.length}</span> users
                      {userRoleFilter !== "all" && <span className="ml-1">• Filtered by <span className="font-semibold capitalize">{userRoleFilter}</span></span>}
                    </p>
                  </div>
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

export default AdminDashboard;