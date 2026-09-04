import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Plus, Download, Calendar, FileText, BarChart3, Circle, Play, LogOut, User, ChevronDown } from "lucide-react";

interface HeaderProps {
  readinessScore: number;
  showQuickActions: boolean;
  setShowQuickActions: (show: boolean) => void;
  startNewContract: () => void;
  downloadPdf: () => void;
  generateCalendarEvent: () => void;
  setShowTemplateLibrary: (show: boolean) => void;
  setShowAnalytics: (show: boolean) => void;
  focusMode: boolean;
  setFocusMode: (focus: boolean) => void;
  wizardMode: boolean;
  setWizardMode: (wizard: boolean) => void;
  setWizardStep: (step: number) => void;
  userEmail: string;
  handleLogout: () => void;
}

export default function Header({
  readinessScore,
  showQuickActions,
  setShowQuickActions,
  startNewContract,
  downloadPdf,
  generateCalendarEvent,
  setShowTemplateLibrary,
  setShowAnalytics,
  focusMode,
  setFocusMode,
  wizardMode,
  setWizardMode,
  setWizardStep,
  userEmail,
  handleLogout,
}: HeaderProps) {
  const actions = [
    { label: "New Contract", icon: Plus, action: startNewContract },
    { label: "Download PDF", icon: Download, action: downloadPdf },
    { label: "Add to Calendar", icon: Calendar, action: generateCalendarEvent },
    { label: "Templates", icon: FileText, action: () => setShowTemplateLibrary(true) },
    { label: "Analytics", icon: BarChart3, action: () => setShowAnalytics(true) },
  ];

  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/95 text-white shadow-lg shadow-slate-950/10 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-4 px-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
            <Play size={16} fill="currentColor" className="text-indigo-300" />
          </div>
          <div className="min-w-0">
            <h1 className="truncate text-[15px] font-semibold tracking-tight text-white">Setlist</h1>
            <div className="mt-0.5 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
              <span className="text-[11px] font-medium text-slate-400">{readinessScore}% ready</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <button
            type="button"
            onClick={startNewContract}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            <Plus size={16} />
            New Contract
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowQuickActions(!showQuickActions)}
              aria-expanded={showQuickActions}
              aria-haspopup="menu"
              aria-controls="quick-actions-menu"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-slate-600 hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              <MoreHorizontal size={16} />
              More
              <ChevronDown size={14} className={`transition-transform ${showQuickActions ? "rotate-180" : ""}`} />
            </button>

            <AnimatePresence>
              {showQuickActions && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -5, scale: 0.98 }}
                  id="quick-actions-menu"
                  role="menu"
                  className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-950/15 dark:border-slate-700 dark:bg-slate-900"
                >
                  {actions.slice(1).map(({ label, icon: Icon, action }) => (
                    <button
                      key={label}
                      type="button"
                      role="menuitem"
                      onClick={() => { action(); setShowQuickActions(false); }}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      <Icon size={16} className="text-slate-500 dark:text-slate-400" />
                      {label}
                    </button>
                  ))}
                  <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setFocusMode(!focusMode); setShowQuickActions(false); }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <Circle size={16} className="text-slate-500" />
                    {focusMode ? "Exit Focus Mode" : "Focus Mode"}
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => { setWizardMode(!wizardMode); setShowQuickActions(false); if (!wizardMode) setWizardStep(1); }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                  >
                    <Play size={16} className="text-slate-500" />
                    {wizardMode ? "Exit Wizard" : "Guided Wizard"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden max-w-[180px] items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1.5 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-500/20 text-indigo-200">
              <User size={15} />
            </span>
            <span className="truncate text-xs font-medium text-slate-300">{userEmail || "User"}</span>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            title="Sign out"
            aria-label="Sign out"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
