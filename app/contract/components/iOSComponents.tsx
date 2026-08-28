import React from "react";

// iOS-style Section Header with title and optional subtitle
interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <div className="px-4 py-3 sm:px-5 sm:py-4">
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      {subtitle && (
        <p className="mt-0.5 text-xs text-stone-300">{subtitle}</p>
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
      className={`flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 bg-stone-700 ${
        divider ? "border-b border-stone-600" : ""
      } ${onClick ? "cursor-pointer active:bg-stone-600" : ""}`}
      onClick={onClick}
    >
      <span className="text-sm text-white">{label}</span>
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
    <section className={`rounded-2xl bg-stone-800 border border-stone-600 overflow-hidden mb-4 ${className}`}>
      {title && <SectionHeader title={title} subtitle={subtitle} />}
      <div className="divide-y divide-stone-700">
        {children}
      </div>
    </section>
  );
}
