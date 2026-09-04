import { useState, useEffect, ChangeEvent } from "react";
import { ContractForm, DEFAULT_LEGAL_TEXT } from "../types/contract";

interface UseContractFormProps { initialForm: ContractForm; }

function migrateLegalDefaults(form: ContractForm): ContractForm {
  const next = { ...form };
  const migrations: Array<[keyof ContractForm, string, string]> = [
    ["governingLaw", "This agreement follows the laws of the jurisdiction where the performance takes place.", DEFAULT_LEGAL_TEXT.governingLaw],
    ["disputeResolution", "We'll resolve any disputes through good faith negotiation first. If that doesn't work, we'll use binding arbitration.", DEFAULT_LEGAL_TEXT.disputeResolution],
    ["independentContractorClause", "I work as an independent contractor, not your employee. I handle my own taxes and insurance. You don't need to withhold taxes for me.", DEFAULT_LEGAL_TEXT.independentContractorClause],
    ["forceMajeureTerms", "Neither of us is responsible if we can't perform due to things beyond our control (illness, injury, venue closure, travel issues, etc.). We'll reschedule or refund the deposit if rescheduling isn't possible.", DEFAULT_LEGAL_TEXT.forceMajeureTerms],
    ["attorneyFeesClause", "In any legal proceeding arising out of or relating to this agreement, the prevailing party shall be entitled to recover reasonable attorneys' fees and costs from the non-prevailing party.", DEFAULT_LEGAL_TEXT.attorneyFeesClause],
    ["severabilityClause", "If any provision of this agreement is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.", DEFAULT_LEGAL_TEXT.severabilityClause],
    ["entireAgreementClause", "This agreement constitutes the entire understanding between the parties and supersedes all prior discussions, agreements, or understandings, whether written or oral.", DEFAULT_LEGAL_TEXT.entireAgreementClause],
    ["electronicSignatureClause", "The parties agree that electronic signatures, digital signatures, and electronic records shall have the same legal effect as handwritten signatures and paper records.", DEFAULT_LEGAL_TEXT.electronicSignatureClause],
    ["amendmentClause", "Any modifications to this agreement must be made in writing and signed by both parties to be effective.", DEFAULT_LEGAL_TEXT.amendmentClause],
    ["waiverClause", "No waiver of any provision of this agreement shall be deemed a waiver of any other provision or of the same provision on any other occasion.", DEFAULT_LEGAL_TEXT.waiverClause],
    ["governingJurisdiction", "Any legal proceedings arising from this agreement shall be brought exclusively in the courts of the jurisdiction where the event takes place.", DEFAULT_LEGAL_TEXT.governingJurisdiction],
  ];
  migrations.forEach(([field, legacy, replacement]) => {
    if (next[field] === legacy) (next as any)[field] = replacement;
  });
  return next;
}

const WIZARD_FIELD_MAP: Record<string, keyof ContractForm> = {
  "Artist Name": "artistName",
  "Artist Email": "artistEmail",
  "Client / Organization Name": "clientName",
  "Representative Name": "representativeName",
  "Email": "email",
  "Phone Number": "phoneNumber",
  "Event / Project Name": "eventName",
  "Event Date(s)": "eventDates",
  "Venue / Location": "venueLocation",
  "Performance Duration": "performanceDuration",
  "Total Fee": "totalFee",
  "Deposit Percentage (%)": "depositPercentage",
  "Payment Method": "paymentMethod",
  "Travel Terms": "travelTerms",
  "Cancellation Terms": "cancellationTerms",
  "Booking Preset": "bookingPreset",
};

function normalizedLabel(value: string) {
  return value.replace(/[\*•:]/g, " ").replace(/\s+/g, " ").trim().toLowerCase();
}

export function useContractForm({ initialForm }: UseContractFormProps) {
  const [form, setForm] = useState<ContractForm>(() => migrateLegalDefaults(initialForm));
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof ContractForm, value: string | boolean) => setForm((currentForm) => ({ ...currentForm, [field]: value }));
  const handleTextChange = (field: keyof ContractForm) => (event: ChangeEvent<HTMLInputElement>) => updateField(field, event.target.value);
  const handleTextareaChange = (field: keyof ContractForm) => (event: ChangeEvent<HTMLTextAreaElement>) => updateField(field, event.target.value);

  // The booking wizard is rendered inside the existing contract form. Its
  // controls mirror into the legacy DOM fields via native input/change events.
  // Capture those events here so the preview's React state updates immediately.
  useEffect(() => {
    const handleWizardInput = (event: Event) => {
      const target = event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (!target || !target.closest("main") || target instanceof HTMLInputElement && target.type === "checkbox") return;

      const label = target.closest("label");
      const labelText = label?.querySelector(":scope > span")?.textContent || label?.textContent || "";
      const normalized = normalizedLabel(labelText);
      const entry = Object.entries(WIZARD_FIELD_MAP).find(([name]) => normalizedLabel(name) === normalized);
      if (!entry) return;

      const [, field] = entry;
      updateField(field, target.value);
    };

    document.addEventListener("input", handleWizardInput, true);
    document.addEventListener("change", handleWizardInput, true);
    return () => {
      document.removeEventListener("input", handleWizardInput, true);
      document.removeEventListener("change", handleWizardInput, true);
    };
  }, []);

  const validateField = (fieldName: string, value: any) => {
    const errors: Record<string, string> = {};
    switch (fieldName) {
      case "artistName": if (!value || value.trim() === "") errors.artistName = "Please enter your artist or stage name"; else if (value.trim().length > 100) errors.artistName = "Name is too long (max 100 characters)"; break;
      case "artistEmail": if (!value || value.trim() === "") errors.artistEmail = "Please enter your email address"; else if (!/^([^\s@]+)@([^\s@]+)\.([^\s@]+)$/.test(value)) errors.artistEmail = "Please enter a valid email address"; else if (value.trim().length > 255) errors.artistEmail = "Email is too long (max 255 characters)"; break;
      case "clientName": if (!value || value.trim() === "") errors.clientName = "Please enter the client or organization name"; else if (value.trim().length > 100) errors.clientName = "Name is too long (max 100 characters)"; break;
      case "email": if (!value || value.trim() === "") errors.email = "Please enter the client's email address"; else if (!/^([^\s@]+)@([^\s@]+)\.([^\s@]+)$/.test(value)) errors.email = "Please enter a valid email address"; break;
      case "eventName": if (!value || value.trim() === "") errors.eventName = "Please enter the event or performance name"; else if (value.trim().length > 200) errors.eventName = "Event name is too long (max 200 characters)"; break;
      case "eventDates": if (!value || value.trim() === "") errors.eventDates = "Please enter the event date(s)"; break;
      case "venueLocation": if (!value || value.trim() === "") errors.venueLocation = "Please enter the venue location or address"; else if (value.trim().length > 200) errors.venueLocation = "Location is too long (max 200 characters)"; break;
      case "totalFee": if (!value || value.trim() === "") errors.totalFee = "Please enter the total performance fee"; else if (isNaN(Number(value)) || Number(value) < 0) errors.totalFee = "Please enter a valid positive number"; break;
      case "phoneNumber": if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) errors.phoneNumber = "Invalid phone number format"; break;
    }
    return errors;
  };

  const sanitizeInput = (input: string): string => !input ? "" : input.trim().replace(/[<>]/g, "");
  return { form, setForm, updateField, handleTextChange, handleTextareaChange, validateField, sanitizeInput, fieldErrors, setFieldErrors };
}
