import { ChangeEvent, useState } from "react";
import { FONT_SIZE_CLASSES, LINE_HEIGHT_CLASSES, FONT_FAMILY_CLASSES, FONT_WEIGHT_CLASSES } from "../../components/GlobalTypography";

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  fieldName?: string;
  error?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  fieldName,
  error,
}: InputFieldProps) {
  const [touched, setTouched] = useState(false);
  const [localError, setLocalError] = useState<string>("");

  const validateField = (val: string) => {
    if (required && !val.trim()) {
      return `${label} is required`;
    }
    if (type === "email" && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        return "Please enter a valid email address";
      }
    }
    if (type === "tel" && val) {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      if (!phoneRegex.test(val)) {
        return "Please enter a valid phone number";
      }
    }
    if (type === "number" && val && parseFloat(val) < 0) {
      return "Value must be positive";
    }
    return "";
  };

  const handleBlur = () => {
    setTouched(true);
    setLocalError(validateField(value));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e);
    if (touched) {
      setLocalError(validateField(e.target.value));
    }
  };

  const currentError = error || localError;
  const isValid = value.length > 0 && !currentError;
  const showValidation = touched && (currentError || isValid);

  return (
    <label className="block">
      <span className="mb-2.5 flex items-center justify-between gap-3">
        <span className={`${FONT_SIZE_CLASSES.uiMd} ${FONT_WEIGHT_CLASSES.semibold} text-black lg:text-base ${FONT_FAMILY_CLASSES.heading}`}>{label}{required && <span className="text-red-500 ml-1">*</span>}</span>
        {showValidation && (
          <span className={`${FONT_SIZE_CLASSES.uiXs} ${FONT_WEIGHT_CLASSES.medium} ${currentError ? 'text-red-600' : 'text-emerald-600'}`}>
            {currentError ? currentError : '✓ Valid'}
          </span>
        )}
      </span>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white px-4 py-3.5 ${FONT_SIZE_CLASSES.uiLg} text-black outline-none transition-all hover:border-stone-400 focus:border-stone-500 focus:ring-2 focus:ring-stone-200 min-h-[48px] lg:text-base lg:py-4 ${FONT_FAMILY_CLASSES.body} ${
          currentError ? 'border-red-500 focus:border-red-600 focus:ring-red-100' : showValidation && isValid ? 'border-emerald-500 focus:border-emerald-600 focus:ring-emerald-100' : 'border-stone-300'
        }`}
      />
      {currentError && (
        <p className={`mt-1 ${FONT_SIZE_CLASSES.uiXs} text-red-600 ${FONT_FAMILY_CLASSES.body}`}>{currentError}</p>
      )}
    </label>
  );
}
