const Pulse = ({ className }) => (
  <div className={`animate-pulse bg-gray-200 dark:bg-navy-800 rounded-xl ${className}`} />
);

export const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-5 shadow-sm">
    <Pulse className="w-11 h-11 mb-3" />
    <Pulse className="w-16 h-7 mb-2" />
    <Pulse className="w-24 h-4" />
  </div>
);

export const VolunteerCardSkeleton = () => (
  <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-5 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <Pulse className="w-11 h-11 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Pulse className="w-32 h-4" />
        <Pulse className="w-48 h-3" />
      </div>
      <Pulse className="w-20 h-6 rounded-full" />
    </div>
    <div className="space-y-3">
      <Pulse className="w-full h-4" />
      <div className="flex gap-2">
        <Pulse className="w-16 h-5 rounded-full" />
        <Pulse className="w-20 h-5 rounded-full" />
        <Pulse className="w-14 h-5 rounded-full" />
      </div>
    </div>
  </div>
);

export const MatchCardSkeleton = () => (
  <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-5 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-3">
        <Pulse className="w-10 h-10 flex-shrink-0" />
        <div className="space-y-2">
          <Pulse className="w-28 h-4" />
          <Pulse className="w-40 h-3" />
        </div>
      </div>
      <Pulse className="w-20 h-6 rounded-full" />
    </div>
    <Pulse className="w-full h-2 rounded-full mb-4" />
    <div className="space-y-2">
      <Pulse className="w-full h-12 rounded-xl" />
      <Pulse className="w-full h-12 rounded-xl" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="border-b border-gray-50 dark:border-navy-800/60">
    <td className="px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        <div className="animate-pulse bg-gray-200 dark:bg-navy-800 rounded-lg w-8 h-8" />
        <div className="animate-pulse bg-gray-200 dark:bg-navy-800 rounded-xl w-28 h-4" />
      </div>
    </td>
    <td className="px-5 py-3.5"><div className="animate-pulse bg-gray-200 dark:bg-navy-800 rounded-xl w-40 h-4" /></td>
    <td className="px-5 py-3.5"><div className="animate-pulse bg-gray-200 dark:bg-navy-800 rounded-full w-16 h-6" /></td>
    <td className="px-5 py-3.5"><div className="animate-pulse bg-gray-200 dark:bg-navy-800 rounded-xl w-24 h-4" /></td>
  </tr>
);

export const ChartSkeleton = () => (
  <div className="bg-white dark:bg-navy-900 border border-gray-100 dark:border-navy-700/60 rounded-2xl p-6 shadow-sm">
    <div className="flex items-center gap-3 mb-6">
      <Pulse className="w-9 h-9" />
      <div className="space-y-2">
        <Pulse className="w-48 h-5" />
        <Pulse className="w-64 h-3" />
      </div>
    </div>
    <div className="flex items-end gap-3 h-48 px-4">
      {[60, 85, 45, 95, 70, 55, 80].map((h, i) => (
        <div key={i} className="flex-1 flex flex-col justify-end gap-1">
          <div className="animate-pulse bg-navy-200 dark:bg-navy-700 rounded-t-lg" style={{ height: `${h}%` }} />
          <div className="animate-pulse bg-navy-100 dark:bg-navy-800 rounded-t-lg" style={{ height: `${h * 0.4}%` }} />
        </div>
      ))}
    </div>
  </div>
);

export default Pulse;