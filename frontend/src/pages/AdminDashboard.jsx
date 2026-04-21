import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import VolunteerCard from "../components/VolunteerCard";
import NeedsChart from "../components/NeedsChart";
import API from "../api/axios";
import toast from "react-hot-toast";

const StatCard = ({ icon, label, value, color }) => (
  <div className="card-hover bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-5 shadow-sm">
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${color}`}>{icon}</div>
    <p className="text-2xl font-display font-bold text-gray-900 dark:text-white">{value}</p>
    <p className="text-sm font-medium text-gray-600 dark:text-navy-300 mt-0.5">{label}</p>
  </div>
);

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [volunteers, setVolunteers] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [triggeringMatch, setTriggeringMatch] = useState(false);

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

  const tabs = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "volunteers", label: "Volunteers", icon: "🙋" },
    { id: "analytics", label: "Analytics", icon: "📊" },
    { id: "users", label: "All Users", icon: "👥" },
  ];

  const roleCount = (role) => users.filter((u) => u.role === role).length;

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-in-up">
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-500 dark:text-navy-400 text-sm mt-1">Platform overview and management</p>
          </div>
          <button onClick={triggerMatching} disabled={triggeringMatch}
            className="btn-shine flex items-center gap-2 px-5 py-2.5 bg-navy-600 hover:bg-navy-500 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-md self-start sm:self-auto">
            {triggeringMatch ? (
              <><svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Matching...</>
            ) : "🤖 Trigger AI Matching"}
          </button>
        </div>

        <div className="flex gap-1 bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-1.5 mb-8 shadow-sm w-fit overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${activeTab === tab.id ? "bg-navy-600 text-white shadow-md shadow-navy-700/30" : "text-gray-500 dark:text-navy-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-navy-800/50"}`}>
              <span>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 stagger-children">
              <StatCard icon="👥" label="Total Users" value={users.length} color="bg-navy-50 dark:bg-navy-800/60" />
              <StatCard icon="🙋" label="Volunteers" value={roleCount("volunteer")} color="bg-teal-50 dark:bg-teal-500/15" />
              <StatCard icon="🏢" label="NGOs" value={roleCount("ngo")} color="bg-indigo-50 dark:bg-indigo-500/15" />
              <StatCard icon="📋" label="Community Needs" value={needs.length} color="bg-amber-50 dark:bg-amber-500/15" />
            </div>
            <NeedsChart needs={needs} />
          </div>
        )}

        {activeTab === "volunteers" && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-gray-900 dark:text-white text-base">Registered Volunteers ({volunteers.length})</h2>
              <button onClick={fetchAll} className="text-xs text-navy-600 dark:text-navy-300 hover:text-navy-800 dark:hover:text-white font-semibold transition">🔄 Refresh</button>
            </div>
            {loading ? <Spinner /> : volunteers.length === 0 ? (
              <div className="text-center py-16 text-gray-400 dark:text-navy-500"><div className="text-5xl mb-3">🙋</div><p className="font-display font-semibold">No volunteers yet</p></div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
                {volunteers.map((v) => <VolunteerCard key={v._id} volunteer={v} />)}
              </div>
            )}
          </div>
        )}

        {activeTab === "analytics" && <div className="animate-fade-in"><NeedsChart needs={needs} /></div>}

        {activeTab === "users" && (
          <div className="animate-fade-in">
            <h2 className="font-display font-bold text-gray-900 dark:text-white text-base mb-4">All Users ({users.length})</h2>
            {users.length === 0 ? (
              <div className="text-center py-16 text-gray-400 dark:text-navy-500"><div className="text-5xl mb-3">👥</div><p className="font-display font-semibold">No users found</p></div>
            ) : (
              <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-navy-700/60 bg-gray-50 dark:bg-navy-800/40">
                        <th className="text-left px-5 py-3.5 font-semibold text-gray-500 dark:text-navy-400 text-xs uppercase tracking-wide">User</th>
                        <th className="text-left px-5 py-3.5 font-semibold text-gray-500 dark:text-navy-400 text-xs uppercase tracking-wide">Email</th>
                        <th className="text-left px-5 py-3.5 font-semibold text-gray-500 dark:text-navy-400 text-xs uppercase tracking-wide">Role</th>
                        <th className="text-left px-5 py-3.5 font-semibold text-gray-500 dark:text-navy-400 text-xs uppercase tracking-wide">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-navy-800/60">
                      {users.map((u) => (
                        <tr key={u._id} className="hover:bg-gray-50 dark:hover:bg-navy-800/30 transition-colors">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-600 to-navy-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">{u.name?.charAt(0).toUpperCase()}</div>
                              <span className="font-medium text-gray-900 dark:text-white">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 dark:text-navy-300">{u.email}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${u.role === "admin" ? "bg-purple-50 dark:bg-purple-500/15 text-purple-700 dark:text-purple-300" : u.role === "ngo" ? "bg-navy-50 dark:bg-navy-700/60 text-navy-700 dark:text-navy-200" : "bg-teal-50 dark:bg-teal-500/15 text-teal-700 dark:text-teal-300"}`}>{u.role}</span>
                          </td>
                          <td className="px-5 py-3.5 text-gray-500 dark:text-navy-300">{u.location || <span className="text-gray-300 dark:text-navy-600">—</span>}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;