const MatchResult = ({ match }) => {
  const statusClass = {
    suggested: "status-suggested",
    accepted: "status-accepted",
    rejected: "status-rejected",
    completed: "status-completed",
  }[match.status] || "bg-gray-100 text-gray-600";

  const scoreColor = match.matchScore >= 80 ? "text-emerald-600 dark:text-emerald-400" : match.matchScore >= 50 ? "text-amber-600 dark:text-amber-400" : "text-red-500 dark:text-red-400";
  const scoreBar = match.matchScore >= 80 ? "bg-emerald-500" : match.matchScore >= 50 ? "bg-amber-500" : "bg-red-500";

  return (
    <div className="card-hover bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-navy-600 to-navy-400 flex items-center justify-center text-white font-bold flex-shrink-0">
            {match.volunteer?.name?.charAt(0).toUpperCase() || "V"}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{match.volunteer?.name || "Volunteer"}</h3>
            <p className="text-xs text-gray-500 dark:text-navy-300">{match.volunteer?.email}</p>
          </div>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusClass}`}>{match.status?.toUpperCase()}</span>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-gray-500 dark:text-navy-400 font-medium">Match Score</span>
          <span className={`text-sm font-bold ${scoreColor}`}>{match.matchScore}/100</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-navy-800 rounded-full h-1.5">
          <div className={`${scoreBar} h-1.5 rounded-full`} style={{ width: `${match.matchScore}%` }} />
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-navy-800/60">
          <span>📍</span>
          <div>
            <span className="text-xs text-gray-400 dark:text-navy-400 font-medium">Need Area</span>
            <p className="text-sm text-gray-700 dark:text-navy-100">{match.need?.area || "—"}</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 dark:bg-navy-800/60">
          <span>🏷</span>
          <div>
            <span className="text-xs text-gray-400 dark:text-navy-400 font-medium">Category</span>
            <p className="text-sm text-gray-700 dark:text-navy-100 capitalize">{match.need?.category || "—"}</p>
          </div>
        </div>
        {match.aiReason && (
          <div className="p-3 rounded-xl bg-navy-50 dark:bg-navy-800/40 border border-navy-100 dark:border-navy-700/40">
            <p className="text-xs font-semibold text-navy-600 dark:text-navy-300 mb-1">🤖 AI Reasoning</p>
            <p className="text-sm text-gray-700 dark:text-navy-200 leading-relaxed">{match.aiReason}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchResult;