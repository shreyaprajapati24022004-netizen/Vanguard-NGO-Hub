import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "../context/ThemeContext";

const categoryIcons = {
  food: "🍱", education: "📚", health: "🏥",
  shelter: "🏠", clothing: "👕", other: "🌟"
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-900 border border-navy-700/60 rounded-xl p-3 shadow-xl min-w-[140px]">
      <p className="text-navy-200 font-bold mb-2 text-xs border-b border-navy-700/40 pb-1.5">📍 {label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 mt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: p.fill }} />
            <span className="text-navy-400 text-xs">{p.name}</span>
          </div>
          <span className="text-white font-bold text-xs">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const NeedsChart = ({ needs, showSummary = true }) => {
  const { isDark } = useTheme();

  if (!needs || needs.length === 0) {
    return (
      <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="font-semibold text-gray-600 dark:text-navy-300 text-sm">No survey data yet</p>
        <p className="text-xs text-gray-400 dark:text-navy-400 mt-1">Submit surveys to see analytics here</p>
      </div>
    );
  }

  const chartData = needs.map((need) => ({
    name: need.area?.length > 12 ? need.area.slice(0, 12) + "…" : need.area,
    "Urgency": need.urgencyScore  || 0,
    "Reports": need.totalReports  || 1,
  }));

  const axisColor = isDark ? "#7eb8d4" : "#005578";
  const gridColor = isDark ? "rgba(0,100,148,0.12)" : "rgba(0,77,116,0.07)";

  const totalReports   = needs.reduce((s, n) => s + (n.totalReports || 1), 0);
  const avgUrgency     = (needs.reduce((s, n) => s + (n.urgencyScore || 0), 0) / needs.length).toFixed(1);
  const highestUrgency = needs.reduce((max, n) => (n.urgencyScore || 0) > (max.urgencyScore || 0) ? n : max, needs[0]);

  const categoryCounts = needs.reduce((acc, n) => {
    acc[n.category] = (acc[n.category] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-4">

      {/* ── Summary Stats — only show when showSummary=true ── */}
      {showSummary && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "📋", label: "Total Surveys", value: needs.length,        color: "bg-navy-50 dark:bg-navy-800/60",     text: "text-navy-700 dark:text-navy-200" },
            { icon: "📊", label: "Total Reports", value: totalReports,        color: "bg-blue-50 dark:bg-blue-500/15",    text: "text-blue-700 dark:text-blue-300" },
            { icon: "🎯", label: "Avg Urgency",   value: `${avgUrgency}/10`,  color: "bg-amber-50 dark:bg-amber-500/15", text: "text-amber-700 dark:text-amber-300" },
          ].map((s, i) => (
            <div key={i} className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-4 shadow-sm">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2 ${s.color}`}>{s.icon}</div>
              <p className={`text-xl font-bold ${s.text}`}>{s.value}</p>
              <p className="text-xs text-gray-500 dark:text-navy-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Main Chart ── */}
      <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-700/60 flex items-center justify-center text-lg">📊</div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-white text-base">Urgency & Reports by Area</h2>
              <p className="text-xs text-gray-400 dark:text-navy-400">Community needs breakdown</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500 dark:text-navy-400">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-navy-600" />Urgency</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-400" />Reports</span>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barGap={4} barCategoryGap="30%"
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: axisColor }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,100,148,0.05)", radius: 8 }} />
            <Bar dataKey="Urgency" fill="#006494" radius={[6, 6, 0, 0]} maxBarSize={40} />
            <Bar dataKey="Reports" fill="#33a6e0" radius={[6, 6, 0, 0]} maxBarSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Category Breakdown ── */}
      {showSummary && Object.keys(categoryCounts).length > 0 && (
        <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-4">📂 Needs by Category</h3>
          <div className="space-y-3">
            {Object.entries(categoryCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([cat, count]) => (
                <div key={cat} className="flex items-center gap-3">
                  <span className="text-lg w-7 flex-shrink-0">{categoryIcons[cat] || "🌟"}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold text-gray-700 dark:text-navy-200 capitalize">{cat}</span>
                      <span className="text-xs font-bold text-gray-500 dark:text-navy-400">{count} survey{count !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="w-full bg-gray-100 dark:bg-navy-800 rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-navy-600 to-navy-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(count / needs.length) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── High Urgency Alert ── */}
      {highestUrgency && highestUrgency.urgencyScore >= 7 && (
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4 flex items-center gap-3">
          <span className="text-2xl flex-shrink-0">🚨</span>
          <div>
            <p className="text-sm font-bold text-red-700 dark:text-red-300">High Urgency Alert</p>
            <p className="text-xs text-red-500 dark:text-red-400 mt-0.5">
              <span className="font-semibold">{highestUrgency.area}</span> has the highest urgency score of{" "}
              <span className="font-semibold">{highestUrgency.urgencyScore}/10</span> — needs immediate attention!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeedsChart;