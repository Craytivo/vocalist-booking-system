import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Plus, Download, Calendar, FileText, BarChart3, Circle, Play, LogOut, User, ChevronDown, LayoutDashboard } from "lucide-react";

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

export default function Header({ readinessScore, showQuickActions, setShowQuickActions, startNewContract, downloadPdf, generateCalendarEvent, setShowTemplateLibrary, setShowAnalytics, focusMode, setFocusMode, wizardMode, setWizardMode, setWizardStep, userEmail, handleLogout }: HeaderProps) {
  const actions = [
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
      className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm shadow-slate-900/5 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2">
          <a href="/dashboard" className="flex shrink-0 items-center gap-3 rounded-lg px-1.5 py-1 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400" aria-label="Open dashboard">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm">
              <Play size={16} fill="currentColor" />
            </div>
            <div className="hidden min-w-0 sm:block">
              <h1 className="truncate text-[15px] font-bold tracking-tight text-slate-950">Setlist</h1>
              <div className="mt-0.5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-medium text-slate-500">{readinessScore}% ready</span>
              </div>
            </div>
          </a>
          <a href="/dashboard" className="hidden items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 md:inline-flex">
            <LayoutDashboard size={14} /> Dashboard
          </a>
          <span className="hidden h-4 w-px bg-slate-200 md:block" />
          <span className="hidden text-xs font-semibold text-slate-400 lg:block">Contract workspace</span>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          <button type="button" onClick={startNewContract} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
            <Plus size={16} /> New contract
          </button>
          <div className="relative">
            <button type="button" onClick={() => setShowQuickActions(!showQuickActions)} aria-expanded={showQuickActions} aria-haspopup="menu" aria-controls="quick-actions-menu" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400">
              <MoreHorizontal size={16} /> More <ChevronDown size={14} className={`transition-transform ${showQuickActions ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {showQuickActions && (
                <motion.div initial={{ opacity: 0, y: -5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -5, scale: 0.98 }} id="quick-actions-menu" role="menu" className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-2xl shadow-slate-900/10">
                  {actions.map(({ label, icon: Icon, action }) => (
                    <button key={label} type="button" role="menuitem" onClick={() => { action(); setShowQuickActions(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                      <Icon size={16} className="text-slate-400" />{label}
                    </button>
                  ))}
                  <div className="my-1 border-t border-slate-100" />
                  <button type="button" role="menuitem" onClick={() => { setFocusMode(!focusMode); setShowQuickActions(false); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                    <Circle size={16} className="text-slate-400" />{focusMode ? "Exit Focus Mode" : "Focus Mode"}
                  </button>
                  <button type="button" role="menuitem" onClick={() => { setWizardMode(!wizardMode); setShowQuickActions(false); if (!wizardMode) setWizardStep(1); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
                    <Play size={16} className="text-slate-400" />{wizardMode ? "Exit Wizard" : "Guided Wizard"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden max-w-[220px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 sm:flex">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-50 text-indigo-600"><User size={15} /></span>
            <span className="truncate text-xs font-medium text-slate-600">{userEmail || "User"}</span>
          </div>
          <button type="button" onClick={handleLogout} className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400" title="Sign out" aria-label="Sign out">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </motion.header>
  );
}
