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
    <header className="sticky top-0 z-50 h-16 bg-stone-950/90 backdrop-blur-xl border-b border-amber-400/20 px-4 text-amber-50 shadow-lg shadow-amber-950/10 lg:px-8">
      <div className="flex h-full items-center justify-between max-w-[1600px] mx-auto">
        {/* Left side - Branding */}
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-300/25 bg-stone-900 shadow-md shadow-black/20">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-amber-300">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-amber-50 tracking-tight">Setlist</h1>
            <span className="text-xs text-amber-200/70">{readinessScore}% ready</span>
          </div>
        </div>

        {/* Center - Quick Actions */}
        <div className="hidden lg:flex items-center">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowQuickActions(!showQuickActions)}
              aria-expanded={showQuickActions}
              aria-haspopup="menu"
              aria-controls="quick-actions-menu"
              className="flex items-center gap-2 rounded-lg border border-amber-400/25 bg-amber-400/10 px-4 py-2 text-sm font-medium text-amber-100 transition-colors hover:bg-amber-400/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="1"></circle>
                <circle cx="12" cy="5" r="1"></circle>
                <circle cx="12" cy="19" r="1"></circle>
              </svg>
              Quick Actions
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showQuickActions ? 'rotate-180' : ''}`}>
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            {showQuickActions && (
              <div id="quick-actions-menu" role="menu" className="absolute top-full mt-2 left-0 w-48 rounded-lg border border-amber-200 bg-white shadow-xl shadow-amber-950/10 py-1 z-50 dark:border-amber-500/20 dark:bg-stone-950 dark:shadow-black/30">
                <button
                  type="button"
                  onClick={() => { startNewContract(); setShowQuickActions(false); }}
                  role="menuitem"
                  className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"/>
                  </svg>
                  New Contract
                </button>
                <button
                  type="button"
                  onClick={() => { downloadPdf(); setShowQuickActions(false); }}
                  role="menuitem"
                  className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => { generateCalendarEvent(); setShowQuickActions(false); }}
                  role="menuitem"
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-amber-700 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900 dark:hover:text-amber-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Add to Calendar
                </button>
                <button
                  type="button"
                  onClick={() => { setShowTemplateLibrary(true); setShowQuickActions(false); }}
                  role="menuitem"
                  className="w-full px-4 py-2.5 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-amber-700 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900 dark:hover:text-amber-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                    <polyline points="10 9 9 9 8 9"/>
                  </svg>
                  Templates
                </button>
                <button
                  type="button"
                  onClick={() => { setShowAnalytics(true); setShowQuickActions(false); }}
                  role="menuitem"
                  className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  Analytics
                </button>
                <button
                  type="button"
                  onClick={() => { setFocusMode(!focusMode); setShowQuickActions(false); }}
                  role="menuitem"
                  className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                  </svg>
                  {focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
                </button>
                <button
                  type="button"
                  onClick={() => { setWizardMode(!wizardMode); setShowQuickActions(false); if (!wizardMode) setWizardStep(1); }}
                  role="menuitem"
                  className="w-full px-4 py-2 text-left text-sm text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="5 3 19 12 5 21 5 3"/>
                  </svg>
                  {wizardMode ? "Exit Wizard Mode" : "Enter Wizard Mode"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side - User */}
        <div className="flex items-center">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-300 text-stone-950 shadow-sm shadow-amber-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <p className="text-sm font-medium text-amber-100/90 hidden sm:block">{userEmail || "User"}</p>
            <button
              type="button"
              onClick={handleLogout}
              className="p-2 rounded-lg text-amber-100 hover:bg-amber-400/10 transition-all focus-visible:ring-2 focus-visible:ring-amber-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
              title="Sign out"
              aria-label="Sign out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
