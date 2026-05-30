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
  "space-y-6 rounded-xl border border-gray-200/80 bg-white/80 p-6 shadow-sm shadow-gray-950/5";

const compactFieldsetClassName =
  "rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm shadow-gray-950/5";

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
        className="flex items-center justify-between text-section-header font-medium text-neutral-900 tracking-normal font-display cursor-pointer"
        onClick={onToggle}
      >
        <span>
          <span className="block">{title}</span>
          {subtitle && <span className="mt-1 block text-sm text-neutral-500">{subtitle}</span>}
        </span>
        <span className="text-neutral-400 transition-transform ml-2">
          <Chevron isOpen={isOpen} />
        </span>
      </legend>
      {isVisible && (
        contentClassName ? <div className={contentClassName}>{children}</div> : <>{children}</>
      )}
    </fieldset>
  );
}
