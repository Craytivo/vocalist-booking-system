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
  primary: "rounded-lg border border-amber-300/70 bg-stone-950 text-amber-100 shadow-md shadow-stone-950/10 transition-all duration-200 ease-out hover:border-amber-400 hover:bg-stone-900 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2 dark:border-amber-400/40 dark:bg-amber-200 dark:text-stone-950 dark:hover:bg-amber-100",
  secondary: "rounded-lg border border-amber-200 bg-white/70 text-stone-800 transition-all duration-200 ease-out hover:border-amber-400 hover:bg-amber-50 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
  ghost: "rounded-lg border border-neutral-300 bg-white text-neutral-700 transition-all duration-200 ease-out hover:border-neutral-900 hover:bg-neutral-50 hover:text-neutral-900 active:scale-95 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2",
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
