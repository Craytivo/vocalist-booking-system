import { motion, AnimatePresence } from "framer-motion";
import {
  MoreHorizontal,
  Plus,
  Download,
  Calendar,
  FileText,
  BarChart3,
  Circle,
  Play,
  LogOut,
  User,
} from "lucide-react";

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
  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 h-16 bg-slate-900/90 backdrop-blur-xl border-b border-primary/20 px-4 text-white shadow-lg shadow-slate-900/10 lg:px-8"
    >
      <div className="flex h-full items-center justify-between max-w-[1600px] mx-auto">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.2 }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-primary/25 bg-slate-800 shadow-md shadow-black/20"
          >
            <Play size={18} fill="currentColor" className="text-primary" />
          </motion.div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-white tracking-tight font-display">Setlist</h1>
            <motion.span
              key={readinessScore}
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-xs text-slate-400"
            >
              {readinessScore}% ready
            </motion.span>
          </div>
        </motion.div>

        {/* Center - Quick Actions */}
        <div className="hidden lg:flex items-center">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={() => setShowQuickActions(!showQuickActions)}
              aria-expanded={showQuickActions}
              aria-haspopup="menu"
              aria-controls="quick-actions-menu"
              className="flex items-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/20"
            >
              <MoreHorizontal size={16} />
              Quick Actions
              <motion.div
                animate={{ rotate: showQuickActions ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </motion.div>
            </motion.button>
            <AnimatePresence>
              {showQuickActions && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  id="quick-actions-menu" role="menu" className="absolute top-full mt-2 left-0 w-48 rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-900/10 py-1 z-50 dark:border-slate-700 dark:bg-slate-900"
                >
                  <motion.button
                    whileHover={{ x: 4 }}
                    type="button"
                    onClick={() => { startNewContract(); setShowQuickActions(false); }}
                    role="menuitem"
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Plus size={16} />
                    New Contract
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4 }}
                    type="button"
                    onClick={() => { downloadPdf(); setShowQuickActions(false); }}
                    role="menuitem"
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Download size={16} />
                    Download PDF
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4 }}
                    type="button"
                    onClick={() => { generateCalendarEvent(); setShowQuickActions(false); }}
                    role="menuitem"
                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-3 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary"
                  >
                    <Calendar size={16} />
                    Add to Calendar
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4 }}
                    type="button"
                    onClick={() => { setShowTemplateLibrary(true); setShowQuickActions(false); }}
                    role="menuitem"
                    className="w-full px-4 py-2.5 text-left text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors flex items-center gap-3 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-primary"
                  >
                    <FileText size={16} />
                    Templates
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4 }}
                    type="button"
                    onClick={() => { setShowAnalytics(true); setShowQuickActions(false); }}
                    role="menuitem"
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <BarChart3 size={16} />
                    Analytics
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4 }}
                    type="button"
                    onClick={() => { setFocusMode(!focusMode); setShowQuickActions(false); }}
                    role="menuitem"
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Circle size={16} />
                    {focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
                  </motion.button>
                  <motion.button
                    whileHover={{ x: 4 }}
                    type="button"
                    onClick={() => { setWizardMode(!wizardMode); setShowQuickActions(false); if (!wizardMode) setWizardStep(1); }}
                    role="menuitem"
                    className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-3 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    <Play size={16} />
                    {wizardMode ? "Exit Wizard Mode" : "Enter Wizard Mode"}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side - User */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex items-center"
        >
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow-sm shadow-primary/30"
            >
              <User size={16} />
            </motion.div>
            <p className="text-sm font-medium text-white/90 hidden sm:block">{userEmail || "User"}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg text-white hover:bg-primary/10 transition-all focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
              title="Sign out"
              aria-label="Sign out"
            >
              <LogOut size={18} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}
