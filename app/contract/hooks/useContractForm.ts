import { useState, ChangeEvent } from "react";

interface ContractForm {
  // Artist Information
  artistName: string;
  artistEmail: string;
  artistLogo: string;
  
  // Booking & Contract Status
  bookingPreset: string;
  contractStatus: string;
  
  // Client Information
  clientName: string;
  representativeName: string;
  email: string;
  phoneNumber: string;
  
  // Event Details
  eventName: string;
  eventDates: string;
  venueLocation: string;
  services: string[];
  totalFee: string;
  depositPercentage: string;
  travelRequired: boolean;
  
  // Contract Terms
  depositTerms: string;
  travelTerms: string;
  cancellationTerms: string;
  technicalRequirements: string;
  performanceDuration: string;
  paymentMethod: string;
  dateOfAgreement: string;
  
  // Media & Rights
  mediaRightsAllowed: boolean;
  mediaRightsTerms: string;
  
  // Legal Clauses
  forceMajeureIncluded: boolean;
  forceMajeureTerms: string;
  independentContractorClause: string;
  
  // Signatures
  artistSignerName: string;
  clientSignerName: string;
  artistSignerTitle: string;
  clientSignerTitle: string;
  artistSignature: string;
  clientSignature: string;
  signedDate: string;
  
  // Delivery Package
  deliverySubject: string;
  deliveryMessage: string;
  
  // Invoice
  invoiceNumber: string;
  invoiceDate: string;
  invoiceStatus: string;
  invoiceDueDate: string;
  invoiceNotes: string;
  
  // Additional Contract Fields
  rehearsalRequired: boolean;
  rehearsalDetails: string;
  soundCheckRequired: boolean;
  soundCheckDetails: string;
  hospitalityRequired: boolean;
  hospitalityDetails: string;
  latePaymentPenalty: string;
  cancellationFee: string;
  insuranceRequired: boolean;
  insuranceDetails: string;
  imageUsageAllowed: boolean;
  imageUsageTerms: string;
  merchandiseSalesAllowed: boolean;
  merchandiseTerms: string;
  guestListCount: string;
  securityRequired: boolean;
  securityDetails: string;
  parkingProvided: boolean;
  parkingDetails: string;
  governingLaw: string;
  disputeResolution: string;
  technicalRiderRequired: boolean;
  technicalRiderDetails: string;
  accommodationRequired: boolean;
  accommodationDetails: string;
  perDiemRequired: boolean;
  perDiemDetails: string;
  publicityTermsRequired: boolean;
  publicityTerms: string;
}

interface UseContractFormProps {
  initialForm: ContractForm;
}

export function useContractForm({ initialForm }: UseContractFormProps) {
  const [form, setForm] = useState<ContractForm>(initialForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const updateField = (field: keyof ContractForm, value: string | boolean) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const handleTextChange =
    (field: keyof ContractForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      updateField(field, event.target.value);
    };

  const handleTextareaChange =
    (field: keyof ContractForm) =>
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      updateField(field, event.target.value);
    };

  const validateField = (fieldName: string, value: any) => {
    const errors: Record<string, string> = {};
    
    switch (fieldName) {
      case "artistName":
        if (!value || value.trim() === "") errors.artistName = "Please enter your artist or stage name";
        else if (value.trim().length > 100) errors.artistName = "Name is too long (max 100 characters)";
        break;
      case "artistEmail":
        if (!value || value.trim() === "") errors.artistEmail = "Please enter your email address";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.artistEmail = "Please enter a valid email address (e.g., name@example.com)";
        else if (value.trim().length > 255) errors.artistEmail = "Email is too long (max 255 characters)";
        break;
      case "clientName":
        if (!value || value.trim() === "") errors.clientName = "Please enter the client or organization name";
        else if (value.trim().length > 100) errors.clientName = "Name is too long (max 100 characters)";
        break;
      case "email":
        if (!value || value.trim() === "") errors.email = "Please enter the client's email address";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errors.email = "Please enter a valid email address (e.g., name@example.com)";
        else if (value.trim().length > 255) errors.email = "Email is too long (max 255 characters)";
        break;
      case "eventName":
        if (!value || value.trim() === "") errors.eventName = "Please enter the event or performance name";
        else if (value.trim().length > 200) errors.eventName = "Event name is too long (max 200 characters)";
        break;
      case "eventDates":
        if (!value || value.trim() === "") errors.eventDates = "Please enter the event date(s)";
        break;
      case "venueLocation":
        if (!value || value.trim() === "") errors.venueLocation = "Please enter the venue location or address";
        else if (value.trim().length > 200) errors.venueLocation = "Location is too long (max 200 characters)";
        break;
      case "totalFee":
        if (!value || value.trim() === "") errors.totalFee = "Please enter the total performance fee";
        else if (isNaN(Number(value)) || Number(value) < 0) errors.totalFee = "Please enter a valid positive number";
        break;
      case "phoneNumber":
        if (value && !/^[\d\s\-\+\(\)]+$/.test(value)) errors.phoneNumber = "Invalid phone number format";
        break;
    }
    
    return errors;
  };

  const sanitizeInput = (input: string): string => {
    if (!input) return "";
    return input.trim().replace(/[<>]/g, "");
  };

  return {
    form,
    setForm,
    updateField,
    handleTextChange,
    handleTextareaChange,
    validateField,
    sanitizeInput,
    fieldErrors,
    setFieldErrors,
  };
}
