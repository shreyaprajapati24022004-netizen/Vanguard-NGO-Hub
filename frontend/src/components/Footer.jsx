const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto border-t border-gray-100 dark:border-navy-800/60 bg-white dark:bg-navy-950 py-6 px-6">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-navy-500 to-navy-300 flex items-center justify-center text-white font-bold text-xs">
            V
          </div>
          <div>
            <span className="font-display font-bold text-gray-800 dark:text-white text-sm">Vanguard NGO Hub</span>
            <span className="hidden sm:inline text-gray-400 dark:text-navy-500 text-xs ml-2">© {year}</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 dark:text-navy-500 text-center">
          🌍 Connecting volunteers with communities in need
        </p>
        <div className="flex items-center gap-4 text-xs text-gray-400 dark:text-navy-500">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Online
          </span>
          <span className="hidden sm:block">Built with ❤️ for social good</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;