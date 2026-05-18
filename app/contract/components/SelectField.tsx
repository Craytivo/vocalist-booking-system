import { ChangeEvent } from "react";

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  placeholder?: string;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: SelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-neutral-700 tracking-wide dark:text-stone-200 lg:text-base">
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-lg border border-amber-200 bg-white/80 px-4 py-3 pr-10 text-sm text-stone-900 outline-none transition-all duration-200 ease-out hover:border-amber-400 hover:bg-amber-50 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 focus:shadow-sm min-h-[44px] dark:border-amber-500/20 dark:bg-stone-900/70 dark:text-stone-100 dark:hover:bg-stone-900 lg:text-base lg:py-3.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
          <svg className="h-4 w-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </label>
  );
}
