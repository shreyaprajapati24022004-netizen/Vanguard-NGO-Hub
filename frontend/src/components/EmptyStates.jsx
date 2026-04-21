const EmptyState = ({ icon, title, description, action, actionLabel }) => (
  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-navy-50 to-navy-100 dark:from-navy-800 dark:to-navy-900 flex items-center justify-center text-5xl shadow-inner border border-navy-100 dark:border-navy-700/60">
        {icon}
      </div>
      <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-navy-200 dark:bg-navy-700 opacity-60" />
      <div className="absolute -bottom-1 -left-1 w-3 h-3 rounded-full bg-navy-300 dark:bg-navy-600 opacity-40" />
    </div>
    <h3 className="font-display font-bold text-gray-800 dark:text-white text-lg mb-2">{title}</h3>
    <p className="text-sm text-gray-400 dark:text-navy-400 max-w-xs leading-relaxed mb-6">{description}</p>
    {action && (
      <button
        onClick={action}
        className="btn-shine px-5 py-2.5 bg-navy-600 hover:bg-navy-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md shadow-navy-600/20"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export const NoMatchesEmpty = ({ onRefresh }) => (
  <EmptyState
    icon="🎯"
    title="No matches yet"
    description="Keep your availability turned on and we'll match you with community needs that fit your skills."
    action={onRefresh}
    actionLabel="🔄 Check Again"
  />
);

export const NoPendingEmpty = () => (
  <EmptyState
    icon="⏳"
    title="No pending requests"
    description="You're all caught up! No volunteer requests are waiting for your review right now."
  />
);

export const NoAcceptedEmpty = () => (
  <EmptyState
    icon="✅"
    title="No accepted matches"
    description="Once you accept a volunteer request, it will appear here."
  />
);

export const NoCompletedEmpty = () => (
  <EmptyState
    icon="🏆"
    title="No completed missions"
    description="Completed volunteer assignments will show up here. Start making impact!"
  />
);

export const NoVolunteersEmpty = () => (
  <EmptyState
    icon="🙋"
    title="No volunteers registered"
    description="Volunteers who sign up on the platform will appear here with their skills and availability."
  />
);

export const NoSurveysEmpty = ({ onAdd }) => (
  <EmptyState
    icon="📋"
    title="No surveys submitted"
    description="Submit your first community need survey to get matched with volunteers who can help."
    action={onAdd}
    actionLabel="+ Submit Survey"
  />
);

export const NoUsersEmpty = () => (
  <EmptyState
    icon="👥"
    title="No users found"
    description="Registered users will appear here. Share the platform to grow your community."
  />
);

export const NoDataChartEmpty = () => (
  <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl shadow-sm">
    <EmptyState
      icon="📊"
      title="No analytics data yet"
      description="Submit community need surveys to start seeing urgency scores and report analytics here."
    />
  </div>
);

export default EmptyState;