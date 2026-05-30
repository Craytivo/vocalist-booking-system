interface CheckboxFieldProps {
  checked: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}

export default function CheckboxField({ checked, label, onChange }: CheckboxFieldProps) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3.5 text-body font-medium text-stone-700 min-h-[48px] cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all tracking-normal">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-gray-300 text-gray-600 focus:ring-amber-500"
      />
    </label>
  );
}
