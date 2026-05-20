import { ChangeEvent } from "react";
import { FONT_SIZE_CLASSES, FONT_FAMILY_CLASSES, FONT_WEIGHT_CLASSES } from "../../components/GlobalTypography";

interface TextareaFieldProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onReset?: () => void;
}

export default function TextareaField({
  label,
  value,
  onChange,
  onReset,
}: TextareaFieldProps) {
  return (
    <label className="block">
      <span className="mb-2.5 flex items-center justify-between gap-3">
        <span className={`${FONT_SIZE_CLASSES.uiMd} ${FONT_WEIGHT_CLASSES.semibold} text-neutral-800 dark:text-stone-200 lg:text-base ${FONT_FAMILY_CLASSES.heading}`}>{label}</span>
        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className={`${FONT_SIZE_CLASSES.uiXs} ${FONT_WEIGHT_CLASSES.semibold} uppercase tracking-[0.14em] text-neutral-500 hover:text-neutral-950 transition-all hover:underline ${FONT_FAMILY_CLASSES.heading}`}
          >
            Reset
          </button>
        )}
      </span>
      <textarea
        value={value}
        onChange={onChange}
        rows={4}
        className={`w-full resize-y rounded-lg border border-amber-200 bg-white/80 px-4 py-3 ${FONT_SIZE_CLASSES.uiLg} text-stone-900 outline-none transition-all duration-200 ease-out hover:border-amber-400 hover:bg-amber-50 focus:border-amber-600 focus:ring-2 focus:ring-amber-200 focus:shadow-sm min-h-[44px] dark:border-amber-500/20 dark:bg-stone-900/70 dark:text-stone-100 dark:hover:bg-stone-900 lg:text-base lg:py-3.5 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 ${FONT_FAMILY_CLASSES.body}`}
      />
    </label>
  );
}
