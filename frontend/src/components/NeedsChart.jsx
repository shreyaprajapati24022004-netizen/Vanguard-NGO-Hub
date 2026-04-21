import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "../context/ThemeContext";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-900 border border-navy-700/60 rounded-xl p-3 shadow-xl text-sm">
      <p className="text-navy-200 font-semibold mb-2 text-xs">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-sm" style={{ background: p.fill }} />
          <span className="text-navy-300 text-xs">{p.name}:</span>
          <span className="text-white font-bold text-xs">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const NeedsChart = ({ needs }) => {
  const { isDark } = useTheme();

  if (!needs || needs.length === 0) {
    return (
      <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-8 text-center">
        <div className="text-4xl mb-3">📊</div>
        <p className="font-display font-semibold text-gray-600 dark:text-navy-300 text-sm">No survey data yet</p>
        <p className="text-xs text-gray-400 dark:text-navy-400 mt-1">Submit surveys to see analytics here</p>
      </div>
    );
  }

  const chartData = needs.map((need) => ({ name: need.area, "Urgency Score": need.urgencyScore, "Total Reports": need.totalReports }));
  const axisColor = isDark ? "#99d4f0" : "#004D74";
  const gridColor = isDark ? "rgba(0,100,148,0.15)" : "rgba(0,77,116,0.08)";

  return (
    <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-navy-100 dark:bg-navy-700/60 flex items-center justify-center text-lg">📊</div>
        <div>
          <h2 className="font-display font-bold text-gray-900 dark:text-white text-base">Community Needs Analytics</h2>
          <p className="text-xs text-gray-400 dark:text-navy-400">Urgency scores and report counts by area</p>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} barGap={4} barCategoryGap="30%">
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 11, fill: axisColor, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: axisColor, fontFamily: "DM Sans" }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,100,148,0.06)" }} />
          <Legend wrapperStyle={{ fontSize: "12px", fontFamily: "DM Sans", color: axisColor }} />
          <Bar dataKey="Urgency Score" fill="#006494" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Total Reports" fill="#33a6e0" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NeedsChart;