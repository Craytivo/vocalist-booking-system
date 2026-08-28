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
        <span className={`${FONT_SIZE_CLASSES.uiMd} ${FONT_WEIGHT_CLASSES.semibold} text-black lg:text-base ${FONT_FAMILY_CLASSES.heading}`}>{label}</span>
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
        className={`w-full resize-y rounded-lg border border-stone-300 bg-white px-4 py-3 ${FONT_SIZE_CLASSES.uiLg} text-black outline-none transition-all duration-200 ease-out hover:border-stone-400 hover:bg-stone-50 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 focus:shadow-sm min-h-[44px] lg:text-base lg:py-3.5 focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2 ${FONT_FAMILY_CLASSES.body}`}
      />
    </label>
  );
}
