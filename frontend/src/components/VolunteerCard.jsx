const VolunteerCard = ({ volunteer }) => {
  const initials = volunteer.name?.charAt(0).toUpperCase() || "V";

  const skillColors = [
    "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-100 dark:border-blue-500/20",
    "bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-500/20",
    "bg-teal-50 dark:bg-teal-500/10 text-teal-700 dark:text-teal-300 border-teal-100 dark:border-teal-500/20",
    "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-500/20",
    "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-500/20",
  ];

  return (
    <div className="card-hover bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-5 shadow-sm overflow-hidden relative group">

      {/* ── Subtle top accent ── */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${volunteer.isAvailable ? "bg-gradient-to-r from-emerald-400 to-teal-400" : "bg-gradient-to-r from-red-400 to-rose-400"}`} />

      {/* ── Header ── */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-navy-600 to-navy-400 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-navy-600/25 flex-shrink-0 group-hover:scale-105 transition-transform duration-200">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-gray-900 dark:text-white text-sm truncate">{volunteer.name}</h3>
          <p className="text-xs text-gray-400 dark:text-navy-400 truncate">{volunteer.email}</p>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border flex-shrink-0 ${
          volunteer.isAvailable
            ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
            : "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${volunteer.isAvailable ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
          {volunteer.isAvailable ? "Available" : "Busy"}
        </span>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-gray-50 dark:border-navy-800/60 mb-3" />

      {/* ── Location ── */}
      <div className="flex items-center gap-2 mb-3">
        <span className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-navy-800/60 flex items-center justify-center text-sm flex-shrink-0">📍</span>
        <div>
          <p className="text-xs text-gray-400 dark:text-navy-500 font-medium">Location</p>
          <p className="text-sm text-gray-700 dark:text-navy-100 font-medium">{volunteer.location || "Not specified"}</p>
        </div>
      </div>

      {/* ── Skills ── */}
      <div className="flex items-start gap-2">
        <span className="w-7 h-7 rounded-lg bg-gray-50 dark:bg-navy-800/60 flex items-center justify-center text-sm flex-shrink-0 mt-0.5">🛠</span>
        <div className="flex-1">
          <p className="text-xs text-gray-400 dark:text-navy-500 font-medium mb-1.5">Skills</p>
          {volunteer.skills?.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {volunteer.skills.map((skill, i) => (
                <span key={i} className={`text-xs px-2 py-0.5 rounded-lg font-semibold border ${skillColors[i % skillColors.length]}`}>
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-gray-400 dark:text-navy-500 italic">No skills listed</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default VolunteerCard;