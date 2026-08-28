import { ChangeEvent } from "react";
import { FONT_SIZE_CLASSES, FONT_FAMILY_CLASSES, FONT_WEIGHT_CLASSES } from "../../components/GlobalTypography";

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
      <span className={`mb-2 block ${FONT_SIZE_CLASSES.uiMd} ${FONT_WEIGHT_CLASSES.semibold} text-black tracking-wide lg:text-base ${FONT_FAMILY_CLASSES.heading}`}>
        {label}
      </span>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className={`w-full appearance-none rounded-lg border border-stone-300 bg-white px-4 py-3 pr-10 ${FONT_SIZE_CLASSES.uiLg} text-black outline-none transition-all duration-200 ease-out hover:border-stone-400 hover:bg-stone-50 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:shadow-sm min-h-[44px] lg:text-base lg:py-3.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2 ${FONT_FAMILY_CLASSES.body}`}
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
