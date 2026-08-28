import React from "react";

type CollapsibleSectionProps = {
  children: React.ReactNode;
  isOpen: boolean;
  isVisible: boolean;
  onToggle: () => void;
  title: string;
  contentClassName?: string;
  id?: string;
  subtitle?: string;
  variant?: "default" | "compact";
};

const defaultFieldsetClassName =
  "space-y-6 rounded-xl border border-stone-600 bg-stone-800 p-6 pt-8 shadow-md";

const compactFieldsetClassName =
  "rounded-2xl border border-stone-600 bg-stone-800 p-5 pt-7 shadow-md";

function Chevron({ isOpen }: { isOpen: boolean }) {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={isOpen ? "M19 9l-7 7-7-7" : "M9 5l7 7-7 7"}
      />
    </svg>
  );
}

export default function CollapsibleSection({
  children,
  contentClassName,
  id,
  isOpen,
  isVisible,
  onToggle,
  subtitle,
  title,
  variant = "default",
}: CollapsibleSectionProps) {
  return (
    <fieldset
      id={id}
      className={variant === "compact" ? compactFieldsetClassName : defaultFieldsetClassName}
    >
      <legend
        className="flex items-center justify-between text-lg font-semibold text-white tracking-normal cursor-pointer select-none hover:text-stone-200 transition-colors"
        onClick={onToggle}
      >
        <span>
          <span className="block">{title}</span>
          {subtitle && <span className="mt-1 block text-sm font-medium text-stone-300">{subtitle}</span>}
        </span>
        <span className="text-stone-300 transition-transform duration-200 ml-2">
          <Chevron isOpen={isOpen} />
        </span>
      </legend>
      {isVisible && (
        contentClassName ? <div className={contentClassName}>{children}</div> : <>{children}</>
      )}
    </fieldset>
  );
}
