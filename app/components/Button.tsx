import React from "react";
import { BUTTON_SIZE_CLASSES, FONT_FAMILY_CLASSES, FONT_WEIGHT_CLASSES } from "./GlobalTypography";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "xs" | "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "rounded-lg border border-slate-950 bg-slate-950 text-white shadow-sm shadow-slate-900/10 transition-all duration-200 ease-out hover:bg-slate-800 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2",
  secondary: "rounded-lg border border-slate-200 bg-white text-slate-700 shadow-sm transition-all duration-200 ease-out hover:border-slate-300 hover:bg-slate-50 hover:text-slate-950 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2",
  ghost: "rounded-lg border border-transparent bg-transparent text-slate-600 transition-all duration-200 ease-out hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2",
  danger: "rounded-lg border border-red-200 bg-red-50 text-red-700 transition-all duration-200 ease-out hover:border-red-300 hover:bg-red-100 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: BUTTON_SIZE_CLASSES.primary.xs,
  sm: BUTTON_SIZE_CLASSES.primary.sm,
  md: BUTTON_SIZE_CLASSES.primary.md,
  lg: BUTTON_SIZE_CLASSES.primary.lg,
};

export default function Button({ variant = "secondary", size = "md", fullWidth = false, className = "", children, disabled, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${FONT_FAMILY_CLASSES.body} ${FONT_WEIGHT_CLASSES.semibold} ${fullWidth ? "w-full" : ""} ${disabled ? "cursor-not-allowed opacity-50" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
