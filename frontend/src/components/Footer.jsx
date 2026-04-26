const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-gray-100 dark:border-navy-800/60 bg-white dark:bg-navy-950 py-5 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">

        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-navy-500 to-navy-300 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            V
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-800 dark:text-white text-sm">Vanguard NGO Hub</span>
            <span className="text-gray-300 dark:text-navy-700">·</span>
            <span className="text-gray-400 dark:text-navy-500 text-xs">© {year}</span>
          </div>
        </div>

        {/* Center */}
        <p className="text-xs text-gray-400 dark:text-navy-500 flex items-center gap-1.5">
          <span className="text-base">🌍</span>
          Connecting volunteers with communities in need
        </p>

        {/* Right */}
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-navy-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </span>
          <span className="hidden sm:flex items-center gap-1">
            Built with <span className="text-red-400 text-sm">❤️</span> for social good
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;