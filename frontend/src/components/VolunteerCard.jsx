const VolunteerCard = ({ volunteer }) => {
  const initials = volunteer.name?.charAt(0).toUpperCase() || "V";
  return (
    <div className="card-hover bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-navy-600 to-navy-400 flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{volunteer.name}</h3>
          <p className="text-xs text-gray-500 dark:text-navy-300 truncate">{volunteer.email}</p>
        </div>
        <div className="ml-auto flex-shrink-0">
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${volunteer.isAvailable ? "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" : "bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400"}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${volunteer.isAvailable ? "bg-emerald-500" : "bg-red-500"}`} />
            {volunteer.isAvailable ? "Available" : "Busy"}
          </span>
        </div>
      </div>
      <div className="space-y-2.5">
        <div className="flex items-start gap-2">
          <span className="text-base mt-0.5 flex-shrink-0">📍</span>
          <div>
            <span className="text-xs font-medium text-gray-400 dark:text-navy-400">Location</span>
            <p className="text-sm text-gray-700 dark:text-navy-100">{volunteer.location || "Not specified"}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <span className="text-base mt-0.5 flex-shrink-0">🛠</span>
          <div>
            <span className="text-xs font-medium text-gray-400 dark:text-navy-400 block mb-1">Skills</span>
            {volunteer.skills?.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {volunteer.skills.map((skill, i) => (
                  <span key={i} className="bg-navy-50 dark:bg-navy-700/60 text-navy-700 dark:text-navy-200 text-xs px-2 py-0.5 rounded-lg font-medium border border-navy-100 dark:border-navy-600/40">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-gray-400 dark:text-navy-400">No skills listed</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerCard;