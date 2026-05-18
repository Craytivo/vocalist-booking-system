/**
 * Validation and sanitization utilities for production readiness
 */

export const validateEmail = (email: string): boolean => {
  if (!email || email.trim() === "") return false;
  if (email.trim().length > 255) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phone: string): boolean => {
  if (!phone) return true; // Optional field
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  return phoneRegex.test(phone);
};

export const validatePositiveNumber = (value: string): boolean => {
  if (!value || value.trim() === "") return false;
  const num = Number(value);
  return !isNaN(num) && num >= 0;
};

export const sanitizeInput = (input: string): string => {
  if (!input) return "";
  return input.trim().replace(/[<>]/g, "");
};

export const validateStringLength = (
  value: string,
  minLength: number = 0,
  maxLength: number = 100
): boolean => {
  if (!value) return minLength === 0;
  const trimmed = value.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
};
