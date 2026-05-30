import React from "react";

// iOS-style Section Header with title and optional subtitle
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="px-4 py-3 sm:px-5 sm:py-4">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      {subtitle && (
        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}
    </div>
  );
}

// iOS-style Field Row with label on left and control on right
interface FieldRowProps {
  label: string;
  children: React.ReactNode;
  divider?: boolean;
  onClick?: () => void;
}

export function FieldRow({ label, children, divider = true, onClick }: FieldRowProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 bg-white dark:bg-gray-800 ${
        divider ? "border-b border-gray-100 dark:border-gray-700" : ""
      } ${onClick ? "cursor-pointer active:bg-gray-50 dark:active:bg-gray-700" : ""}`}
      onClick={onClick}
    >
      <span className="text-sm text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

// iOS-style Toggle Switch for checkboxes
interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function ToggleSwitch({ checked, onChange, disabled = false }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
      className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 ${
        checked ? "bg-gray-900 dark:bg-gray-100" : "bg-gray-200 dark:bg-gray-600"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      role="switch"
      aria-checked={checked}
    >
      <span
        className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}

// iOS-style Grouped Section container
interface GroupedSectionProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function GroupedSection({ title, subtitle, children, className = "" }: GroupedSectionProps) {
  return (
    <section className={`rounded-2xl bg-white/90 dark:bg-gray-800/90 border border-black/5 dark:border-white/10 overflow-hidden mb-4 ${className}`}>
      {title && <SectionHeader title={title} subtitle={subtitle} />}
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {children}
      </div>
    </section>
  );
}
