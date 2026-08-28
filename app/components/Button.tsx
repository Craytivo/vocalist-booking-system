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
  primary: "rounded-lg border border-slate-800 bg-slate-900 text-white shadow-md shadow-slate-900/10 transition-all duration-200 ease-out hover:border-slate-700 hover:bg-slate-800 active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2",
  secondary: "rounded-lg border border-slate-200 bg-white/80 text-slate-800 transition-all duration-200 ease-out hover:border-slate-300 hover:bg-slate-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2",
  ghost: "rounded-lg border border-slate-200 bg-white text-slate-700 transition-all duration-200 ease-out hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2",
  danger: "rounded-lg border border-red-500 bg-red-600 text-white transition-all duration-200 ease-out hover:border-red-700 hover:bg-red-700 active:scale-95 focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2",
};

const sizeClasses: Record<ButtonSize, string> = {
  xs: BUTTON_SIZE_CLASSES.primary.xs,
  sm: BUTTON_SIZE_CLASSES.primary.sm,
  md: BUTTON_SIZE_CLASSES.primary.md,
  lg: BUTTON_SIZE_CLASSES.primary.lg,
};

export default function Button({
  variant = "secondary",
  size = "md",
  fullWidth = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={`${variantClasses[variant]} ${sizeClasses[size]} ${FONT_FAMILY_CLASSES.body} ${FONT_WEIGHT_CLASSES.semibold} ${fullWidth ? "w-full" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
