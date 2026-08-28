"use client";

import React, {
  useState,
  useEffect,
  useRef,
  ChangeEvent,
  useMemo,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";
import Toast from "./components/Toast";
import InputField from "./components/InputField";
import SelectField from "./components/SelectField";
import TextareaField from "./components/TextareaField";
import RecentContracts from "./components/RecentContracts";
import StorageWarningBanner from "./components/StorageWarningBanner";
import Header from "./components/Header";
import FormPanel from "./components/FormPanel";
import CheckboxField from "./components/CheckboxField";
import CollapsibleSection from "./components/CollapsibleSection";
import ContractPreview from "./components/ContractPreview";
import ContractWizard from "./components/ContractWizard";
import ContractActions from "./components/ContractActions";
import ContractModals from "./components/ContractModals";
import { GroupedSection, FieldRow, ToggleSwitch } from "./components/iOSComponents";
import { getErrorMessage } from "./utils/errorHandling";
import { addPdfPageNumbers, downloadPdf } from "./utils/pdf";
import { generateCalendarEvent } from "./utils/calendar";
import { copyToClipboard } from "./utils/clipboard";
import { useContractAuth } from "./hooks/useContractAuth";
import { useContractWorkspace } from "./hooks/useContractWorkspace";
import { useContractAutosave } from "./hooks/useContractAutosave";
import { useContractTemplates } from "./hooks/useContractTemplates";
import { useOfflineDraft } from "./hooks/useOfflineDraft";
import { useContractForm } from "./hooks/useContractForm";
import { ContractForm } from "./types/contract";

// Custom scrollbar styles
const customScrollbarStyles = `
  /* Custom scrollbar for webkit browsers */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 3px;
    transition: background 0.2s ease;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.2);
  }

  ::-webkit-scrollbar-thumb:active {
    background: rgba(0, 0, 0, 0.3);
  }

  /* Hide scrollbar for Firefox */
  * {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
  }
`;

// Error Boundary component for graceful error handling
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
          <div className="max-w-md w-full bg-white rounded-xl border border-neutral-300 p-6 shadow-lg text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <h2 className="text-lg font-medium text-neutral-900 mb-2">Something went wrong</h2>
            <p className="text-sm text-neutral-600 mb-4">
              We encountered an unexpected error. Please refresh the page to try again.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center px-4 py-2 bg-neutral-900 text-white text-sm font-medium rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

type ContractRow = {
  id: string;
  workspace_id: string | null;
  created_at: string | null;
  artist_name: string | null;
  artist_email: string | null;
  artist_logo: string | null;
  client_name: string | null;
  representative_name: string | null;
  email: string | null;
  phone: string | null;
  event_name: string | null;
  event_dates: string | null;
  venue: string | null;
  services: string[] | null;
  total_fee: number | null;
  deposit_percentage: number | null;
  travel_required: boolean | null;
  status: string | null;
  booking_preset: string | null;
  contract_status: string | null;
  deposit_terms: string | null;
  travel_terms: string | null;
  cancellation_terms: string | null;
  technical_requirements: string | null;
  performance_duration: string | null;
  payment_method: string | null;
  date_of_agreement: string | null;
  media_rights_allowed: boolean | null;
  media_rights_terms: string | null;
  force_majeure_included: boolean | null;
  force_majeure_terms: string | null;
  independent_contractor_clause: string | null;
  artist_signer_name: string | null;
  client_signer_name: string | null;
  artist_signer_title: string | null;
  client_signer_title: string | null;
  artist_signature: string | null;
  client_signature: string | null;
  signed_date: string | null;
  delivery_subject: string | null;
  delivery_message: string | null;
  invoice_number: string | null;
  invoice_date: string | null;
  invoice_status: string | null;
  invoice_due_date: string | null;
  invoice_notes: string | null;
  // New fields for comprehensive contract
  rehearsal_required: boolean | null;
  rehearsal_details: string | null;
  sound_check_required: boolean | null;
  sound_check_details: string | null;
  hospitality_required: boolean | null;
  hospitality_details: string | null;
  late_payment_penalty: string | null;
  cancellation_fee: string | null;
  insurance_required: boolean | null;
  insurance_details: string | null;
  image_usage_allowed: boolean | null;
  image_usage_terms: string | null;
  merchandise_sales_allowed: boolean | null;
  merchandise_terms: string | null;
  guest_list_count: string | null;
  security_required: boolean | null;
  security_details: string | null;
  parking_provided: boolean | null;
  parking_details: string | null;
  governing_law: string | null;
  dispute_resolution: string | null;
  indemnification_clause: string | null;
  confidentiality_clause: string | null;
  equipment_liability_clause: string | null;
  attorney_fees_clause: string | null;
  // Phase 2 additions
  technical_rider_required: boolean | null;
  technical_rider_details: string | null;
  accommodation_required: boolean | null;
  accommodation_details: string | null;
  per_diem_required: boolean | null;
  per_diem_details: string | null;
  publicity_terms_required: boolean | null;
  publicity_terms: string | null;
};

type ArtistWorkspace = {
  id: string;
  owner_user_id: string | null;
  artist_name: string | null;
  artist_email: string | null;
  artist_logo: string | null;
  share_slug: string;
  created_at: string | null;
};

type ContractTextField = {
  [Key in keyof ContractForm]-?: NonNullable<ContractForm[Key]> extends string ? Key : never;
}[keyof ContractForm];

type ResettableTextareaConfig = {
  field: ContractTextField;
  label: string;
  defaultValue: string;
};

const serviceOptions = [
  "Live Vocals",
  "Lead Vocals",
  "Supporting Vocals",
  "Studio Vocals",
  "Rehearsals",
  "Touring Support",
];

const bookingPresets = [
  {
    label: "Standard Gig",
    services: ["Live Vocals", "Lead Vocals"],
    totalFee: "1200",
    depositPercentage: "50",
    performanceDuration: "2 sets of 45 minutes",
    travelRequired: false,
    soundCheckRequired: true,
    technicalRiderRequired: false,
    rehearsalRequired: false,
    description: "Standard live performance with basic requirements",
  },
  {
    label: "Live Performance",
    services: ["Live Vocals", "Lead Vocals", "Supporting Vocals"],
    totalFee: "1500",
    depositPercentage: "50",
    performanceDuration: "2 sets of 45 minutes, 7pm-10pm",
    travelRequired: true,
    soundCheckRequired: true,
    technicalRiderRequired: true,
    rehearsalRequired: false,
    description: "Full production with technical requirements",
  },
  {
    label: "Studio Session",
    services: ["Studio Vocals", "Lead Vocals", "Supporting Vocals"],
    totalFee: "500",
    depositPercentage: "100",
    performanceDuration: "4 hours",
    travelRequired: false,
    soundCheckRequired: false,
    technicalRiderRequired: false,
    rehearsalRequired: false,
    description: "Recording session with full payment upfront",
  },
  {
    label: "Touring",
    services: ["Touring Support", "Live Vocals", "Supporting Vocals"],
    totalFee: "3000",
    depositPercentage: "30",
    performanceDuration: "Full tour duration",
    travelRequired: true,
    accommodationRequired: true,
    perDiemRequired: true,
    technicalRiderRequired: true,
    rehearsalRequired: true,
    description: "Multi-date tour with accommodation and per diem",
  },
  {
    label: "Backing Vocals",
    services: ["Supporting Vocals", "Rehearsals"],
    totalFee: "800",
    depositPercentage: "50",
    performanceDuration: "1 set of 60 minutes",
    travelRequired: false,
    soundCheckRequired: true,
    rehearsalRequired: true,
    description: "Supporting role with rehearsal",
  },
  {
    label: "Rehearsal Package",
    services: ["Rehearsals", "Lead Vocals", "Supporting Vocals"],
    totalFee: "600",
    depositPercentage: "100",
    performanceDuration: "3 sessions of 2 hours",
    travelRequired: false,
    rehearsalRequired: true,
    description: "Multiple rehearsal sessions",
  },
];

const contractStatuses = ["Draft", "Ready", "Sent", "Signed"];

const defaultDepositTerms =
  "A deposit is required to confirm your booking. The remaining balance is due 7 days before the event, or when you receive the invoice. Late payments may have a 5% monthly fee.";
const defaultTravelTerms =
  "We'll agree on travel details at least 14 days before the event. You'll cover reasonable travel costs like transportation, lodging, and meals. I'll provide receipts for reimbursement.";
const defaultCancellationTerms =
  "Cancellations must be in writing. More than 30 days before = full refund. 14-30 days before = 50% refund. Less than 14 days before = no refund. If I cancel due to illness or emergency, I'll refund your deposit and try to find a substitute.";
const defaultTechnicalRequirements =
  "You'll provide proper sound equipment including a PA system, microphones, stage monitors, and sound check access at least 60 minutes before the show. I'll let you know of any special needs at least 7 days in advance.";
const defaultMediaRightsTerms =
  "You can't record, stream, or share my performance without my written permission. Any approved recordings can only be used for what we agreed on. I keep all rights to my performance.";
const defaultForceMajeureTerms =
  "Neither of us is responsible if we can't perform due to things beyond our control (illness, injury, venue closure, travel issues, etc.). We'll reschedule or refund the deposit if rescheduling isn't possible.";
const defaultIndependentContractorClause =
  "I work as an independent contractor, not your employee. I handle my own taxes and insurance. You don't need to withhold taxes for me.";

// New default clauses for comprehensive contract
const defaultRehearsalDetails =
  "Rehearsals will be scheduled at least 7 days before the event. Rehearsal time is included in the performance time unless we agree otherwise.";
const defaultSoundCheckDetails =
  "Sound check will be scheduled 1-2 hours before the show. I'll have access to the venue and sound system for sound check.";
const defaultHospitalityDetails =
  "You'll provide a private dressing room with mirror, seating, lighting, and restroom access. Refreshments and water will be provided.";
const defaultLatePaymentPenalty =
  "Late payments will have a 5% monthly fee on the outstanding balance, calculated from the due date until payment is received.";
const defaultCancellationFee =
  "If you cancel less than 30 days before the event, you may owe the full contract amount. Cancellations 30-60 days before the event incur a 50% fee.";
const defaultInsuranceDetails =
  "You'll maintain liability insurance for your venue and event. I maintain my own professional liability insurance.";
const defaultImageUsageTerms =
  "You can use photos and videos of me for promoting this specific event only. Any other commercial use needs my written permission first.";
const defaultMerchandiseTerms =
  "I can sell merchandise at the venue with your approval. You'll provide appropriate space for merchandise display and sales.";
const defaultSecurityDetails =
  "You'll provide appropriate security for the venue and me. Additional security personnel may be needed depending on venue size and audience.";
const defaultParkingDetails =
  "You'll provide complimentary parking for me and my equipment. Parking passes or a designated parking area will be provided in advance.";
const defaultGoverningLaw =
  "This agreement follows the laws of the jurisdiction where the performance takes place.";
const defaultDisputeResolution =
  "We'll resolve any disputes through good faith negotiation first. If that doesn't work, we'll use binding arbitration.";
const defaultIndemnification =
  "Each party agrees to indemnify and hold harmless the other party from and against any and all claims, demands, losses, damages, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to any breach of this agreement, negligence, or willful misconduct by the indemnifying party.";
const defaultConfidentiality =
  "Both parties agree to keep confidential all non-public information disclosed during the course of this engagement, including but not limited to financial terms, contact information, business strategies, and technical specifications. This obligation shall survive the termination of this agreement.";
const defaultEquipmentLiability =
  "The Client shall be responsible for any damage to the Artist's equipment caused by the Client, its employees, agents, or attendees. The Client shall provide adequate security and protection for all equipment. The Artist is not liable for damage to the Client's equipment or venue except in cases of willful misconduct or gross negligence.";
const defaultAttorneyFees =
  "In any legal proceeding arising out of or relating to this agreement, the prevailing party shall be entitled to recover reasonable attorneys' fees and costs from the non-prevailing party.";
const defaultTechnicalRider =
  "You'll provide: high-quality PA system with monitors, 2 microphones (1 handheld, 1 stand), mic stands, direct input box for acoustic instruments, and adequate power. All equipment must work properly and be set up before I arrive.";
const defaultAccommodationDetails =
  "For overnight stays, you'll provide accommodation at a minimum 3-star hotel or equivalent. This includes a private room with bathroom, WiFi access, and should be reasonably close to the venue.";
const defaultPerDiemDetails =
  "I'll receive $75 per day for meals and incidental expenses for engagements requiring travel. Transportation to and from the venue will be provided or reimbursed.";
const defaultPublicityTerms =
  "You'll credit me in all promotional materials and announcements for the event. Credit should include my name and/or stage name as specified. You'll get my approval for any promotional materials featuring my image or likeness.";

const financialLegalTextareaFields: ResettableTextareaConfig[] = [
  { field: "latePaymentPenalty", label: "Late Payment Penalty", defaultValue: defaultLatePaymentPenalty },
  { field: "cancellationFee", label: "Cancellation Fee Structure", defaultValue: defaultCancellationFee },
  { field: "governingLaw", label: "Governing Law", defaultValue: defaultGoverningLaw },
  { field: "disputeResolution", label: "Dispute Resolution", defaultValue: defaultDisputeResolution },
  { field: "indemnificationClause", label: "Indemnification", defaultValue: defaultIndemnification },
  { field: "confidentialityClause", label: "Confidentiality", defaultValue: defaultConfidentiality },
  { field: "equipmentLiabilityClause", label: "Equipment Liability", defaultValue: defaultEquipmentLiability },
  { field: "attorneyFeesClause", label: "Attorney's Fees", defaultValue: defaultAttorneyFees },
];

const contractLanguageTextareaFields: ResettableTextareaConfig[] = [
  { field: "depositTerms", label: "Deposit Terms", defaultValue: defaultDepositTerms },
  { field: "travelTerms", label: "Travel Terms", defaultValue: defaultTravelTerms },
  { field: "cancellationTerms", label: "Cancellation Terms", defaultValue: defaultCancellationTerms },
  { field: "technicalRequirements", label: "Technical Requirements", defaultValue: defaultTechnicalRequirements },
  { field: "mediaRightsTerms", label: "Media Rights Terms", defaultValue: defaultMediaRightsTerms },
  { field: "forceMajeureTerms", label: "Force Majeure Terms", defaultValue: defaultForceMajeureTerms },
  { field: "independentContractorClause", label: "Independent Contractor Clause", defaultValue: defaultIndependentContractorClause },
];

const initialForm: ContractForm = {
  artistName: "",
  artistEmail: "",
  artistLogo: "",
  bookingPreset: "",
  contractStatus: "Draft",
  clientName: "",
  representativeName: "",
  email: "",
  phoneNumber: "",
  eventName: "",
  eventDates: "",
  venueLocation: "",
  services: [],
  totalFee: "",
  depositPercentage: "50",
  travelRequired: false,
  depositTerms: defaultDepositTerms,
  travelTerms: defaultTravelTerms,
  cancellationTerms: defaultCancellationTerms,
  technicalRequirements: defaultTechnicalRequirements,
  performanceDuration: "",
  paymentMethod: "",
  dateOfAgreement: "",
  mediaRightsAllowed: false,
  mediaRightsTerms: defaultMediaRightsTerms,
  forceMajeureIncluded: true,
  forceMajeureTerms: defaultForceMajeureTerms,
  independentContractorClause: defaultIndependentContractorClause,
  artistSignerName: "",
  clientSignerName: "",
  artistSignerTitle: "",
  clientSignerTitle: "",
  artistSignature: "",
  clientSignature: "",
  signedDate: "",
  deliverySubject: "",
  deliveryMessage: "",
  invoiceNumber: "",
  invoiceDate: "",
  invoiceStatus: "Pending",
  invoiceDueDate: "",
  invoiceNotes: "",
  // New fields for comprehensive contract
  rehearsalRequired: false,
  rehearsalDetails: defaultRehearsalDetails,
  soundCheckRequired: true,
  soundCheckDetails: defaultSoundCheckDetails,
  hospitalityRequired: false,
  hospitalityDetails: defaultHospitalityDetails,
  latePaymentPenalty: defaultLatePaymentPenalty,
  cancellationFee: defaultCancellationFee,
  insuranceRequired: false,
  insuranceDetails: defaultInsuranceDetails,
  imageUsageAllowed: false,
  imageUsageTerms: defaultImageUsageTerms,
  merchandiseSalesAllowed: false,
  merchandiseTerms: defaultMerchandiseTerms,
  guestListCount: "2",
  securityRequired: false,
  securityDetails: defaultSecurityDetails,
  parkingProvided: true,
  parkingDetails: defaultParkingDetails,
  governingLaw: defaultGoverningLaw,
  disputeResolution: defaultDisputeResolution,
  indemnificationClause: defaultIndemnification,
  confidentialityClause: defaultConfidentiality,
  equipmentLiabilityClause: defaultEquipmentLiability,
  attorneyFeesClause: defaultAttorneyFees,
  // Phase 2 additions
  technicalRiderRequired: false,
  technicalRiderDetails: defaultTechnicalRider,
  accommodationRequired: false,
  accommodationDetails: defaultAccommodationDetails,
  perDiemRequired: false,
  perDiemDetails: defaultPerDiemDetails,
  publicityTermsRequired: true,
  publicityTerms: defaultPublicityTerms,
};

const contractRowToForm = (row: ContractRow): ContractForm => ({
  artistName: row.artist_name ?? "",
  artistEmail: row.artist_email ?? "",
  artistLogo: row.artist_logo ?? "",
  bookingPreset: row.booking_preset ?? "",
  contractStatus: (row.contract_status ?? row.status ?? "Draft") as "Draft" | "Ready" | "Sent" | "Signed",
  clientName: row.client_name ?? "",
  representativeName: row.representative_name ?? "",
  email: row.email ?? "",
  phoneNumber: row.phone ?? "",
  eventName: row.event_name ?? "",
  eventDates: row.event_dates ?? "",
  venueLocation: row.venue ?? "",
  services: row.services ?? [],
  totalFee: row.total_fee ? String(row.total_fee) : "",
  depositPercentage: row.deposit_percentage !== null && row.deposit_percentage !== undefined ? String(row.deposit_percentage) : "50",
  travelRequired: row.travel_required ?? false,
  depositTerms: row.deposit_terms ?? defaultDepositTerms,
  travelTerms: row.travel_terms ?? defaultTravelTerms,
  cancellationTerms: row.cancellation_terms ?? defaultCancellationTerms,
  technicalRequirements: row.technical_requirements ?? defaultTechnicalRequirements,
  performanceDuration: row.performance_duration ?? "",
  paymentMethod: row.payment_method ?? "",
  dateOfAgreement: row.date_of_agreement ?? new Date().toISOString().split('T')[0],
  mediaRightsAllowed: row.media_rights_allowed ?? false,
  mediaRightsTerms: row.media_rights_terms ?? defaultMediaRightsTerms,
  forceMajeureIncluded: row.force_majeure_included ?? true,
  forceMajeureTerms: row.force_majeure_terms ?? defaultForceMajeureTerms,
  independentContractorClause: row.independent_contractor_clause ?? defaultIndependentContractorClause,
  artistSignerName: row.artist_signer_name ?? "",
  clientSignerName: row.client_signer_name ?? "",
  artistSignerTitle: row.artist_signer_title ?? "",
  clientSignerTitle: row.client_signer_title ?? "",
  artistSignature: row.artist_signature ?? "",
  clientSignature: row.client_signature ?? "",
  signedDate: row.signed_date ?? "",
  deliverySubject: row.delivery_subject ?? "",
  deliveryMessage: row.delivery_message ?? "",
  invoiceNumber: row.invoice_number ?? "",
  invoiceDate: row.invoice_date ?? "",
  invoiceStatus: (row.invoice_status as "Pending" | "Paid" | "Overdue") ?? "Pending",
  invoiceDueDate: row.invoice_due_date ?? "",
  invoiceNotes: row.invoice_notes ?? "",
  // New fields for comprehensive contract
  rehearsalRequired: row.rehearsal_required ?? false,
  rehearsalDetails: row.rehearsal_details ?? defaultRehearsalDetails,
  soundCheckRequired: row.sound_check_required ?? true,
  soundCheckDetails: row.sound_check_details ?? defaultSoundCheckDetails,
  hospitalityRequired: row.hospitality_required ?? false,
  hospitalityDetails: row.hospitality_details ?? defaultHospitalityDetails,
  latePaymentPenalty: row.late_payment_penalty ?? defaultLatePaymentPenalty,
  cancellationFee: row.cancellation_fee ?? defaultCancellationFee,
  insuranceRequired: row.insurance_required ?? false,
  insuranceDetails: row.insurance_details ?? defaultInsuranceDetails,
  imageUsageAllowed: row.image_usage_allowed ?? false,
  imageUsageTerms: row.image_usage_terms ?? defaultImageUsageTerms,
  merchandiseSalesAllowed: row.merchandise_sales_allowed ?? false,
  merchandiseTerms: row.merchandise_terms ?? defaultMerchandiseTerms,
  guestListCount: row.guest_list_count ?? "2",
  securityRequired: row.security_required ?? false,
  securityDetails: row.security_details ?? defaultSecurityDetails,
  parkingProvided: row.parking_provided ?? true,
  parkingDetails: row.parking_details ?? defaultParkingDetails,
  governingLaw: row.governing_law ?? defaultGoverningLaw,
  disputeResolution: row.dispute_resolution ?? defaultDisputeResolution,
  indemnificationClause: row.indemnification_clause ?? defaultIndemnification,
  confidentialityClause: row.confidentiality_clause ?? defaultConfidentiality,
  equipmentLiabilityClause: row.equipment_liability_clause ?? defaultEquipmentLiability,
  attorneyFeesClause: row.attorney_fees_clause ?? defaultAttorneyFees,
  // Phase 2 additions
  technicalRiderRequired: row.technical_rider_required ?? false,
  technicalRiderDetails: row.technical_rider_details ?? defaultTechnicalRider,
  accommodationRequired: row.accommodation_required ?? false,
  accommodationDetails: row.accommodation_details ?? defaultAccommodationDetails,
  perDiemRequired: row.per_diem_required ?? false,
  perDiemDetails: row.per_diem_details ?? defaultPerDiemDetails,
  publicityTermsRequired: row.publicity_terms_required ?? true,
  publicityTerms: row.publicity_terms ?? defaultPublicityTerms,
});

function InvoicePreview({
  form,
  invoiceRef,
}: {
  form: ContractForm;
  invoiceRef: React.RefObject<HTMLDivElement>;
}) {
  const displayValue = (value: string) => value || "________";
  const artistName = displayValue(form.artistName);
  const artistEmail = displayValue(form.artistEmail);
  const totalFeeNumber = Number(form.totalFee) || 0;
  const depositPercentageNumber = form.depositPercentage !== "" ? Number(form.depositPercentage) : 50;
  const depositAmount = totalFeeNumber * (depositPercentageNumber / 100);
  const balanceAmount = totalFeeNumber - depositAmount;
  const money = (value: number) =>
    value.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
    });

  return (
    <article
      ref={invoiceRef}
      className="min-h-[1123px] bg-white px-10 py-14 text-sm sm:text-base sm:px-14 sm:py-18 sm:px-18 sm:py-22 font-sans text-neutral-900 shadow-lg shadow-neutral-200/50 border border-neutral-100"
    >
      <header className="border-b-2 border-neutral-900 pb-8 sm:pb-10">
        <div className="flex items-start justify-between gap-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-neutral-900">
              INVOICE
            </h2>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
              Invoice No. {form.invoiceNumber || "INV-" + (form.eventName || "DRAFT").slice(0, 6).toUpperCase()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 mb-1">
              Date
            </p>
            <p className="text-base font-medium text-neutral-900 sm:text-lg">
              {form.invoiceDate || new Date().toISOString().split('T')[0]}
            </p>
            <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 mb-1">
              Due Date
            </p>
            <p className="text-base font-medium text-neutral-900 sm:text-lg">
              {form.invoiceDueDate || "____________________"}
            </p>
          </div>
        </div>
      </header>

      <div className="mt-10 sm:mt-12 space-y-8 sm:space-y-10 text-sm sm:text-base leading-relaxed">
        <section>
          <h3 className="font-medium text-base sm:text-lg text-neutral-900 pl-0  mb-4">Bill To</h3>
          <p className="font-medium text-neutral-900">{displayValue(form.clientName)}</p>
          <p className="mt-2">{displayValue(form.representativeName)}</p>
          <p className="mt-2">{displayValue(form.email)}</p>
          <p className="mt-2">{displayValue(form.phoneNumber)}</p>
        </section>

        <section>
          <h3 className="font-medium text-base sm:text-lg text-neutral-900 pl-0  mb-4">Services</h3>
          <div className="mt-4 border border-neutral-100 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-600">Description</th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-600">Amount</th>
                </tr>
              </thead>
              <tbody>
                {form.services.length > 0 ? (
                  form.services.map((service) => (
                    <tr key={service} className="border-t border-neutral-300">
                      <td className="px-4 py-3">{service}</td>
                      <td className="px-4 py-3 text-right">{form.totalFee ? money(totalFeeNumber / form.services.length) : "____________________"}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="border-t border-neutral-300">
                    <td className="px-4 py-3">Vocal Performance Services</td>
                    <td className="px-4 py-3 text-right">{form.totalFee ? money(totalFeeNumber) : "____________________"}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3 className="font-medium text-base sm:text-lg text-neutral-900 pl-0  mb-4">Payment Details</h3>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span className="font-medium">{form.totalFee ? money(totalFeeNumber) : "____________________"}</span>
            </div>
            {form.depositPercentage && form.totalFee && (
              <div className="flex justify-between">
                <span className="text-neutral-600">Deposit Paid ({depositPercentageNumber}%)</span>
                <span className="font-medium text-emerald-600">-{money(depositAmount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-neutral-300 pt-2 mt-2">
              <span className="font-medium text-base sm:text-lg">Balance Due</span>
              <span className="font-medium text-base sm:text-lg">{form.totalFee ? money(balanceAmount) : "____________________"}</span>
            </div>
          </div>
        </section>

        {form.invoiceNotes && (
          <section>
            <h3 className="font-medium text-base sm:text-lg text-neutral-900 pl-0  mb-4">Notes</h3>
            <p className="mt-4 text-neutral-600">{form.invoiceNotes}</p>
          </section>
        )}

        <section className="border-t border-neutral-300 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 mb-1">
                Status
              </p>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                form.invoiceStatus === "Paid" ? "bg-emerald-100 text-emerald-700" :
                form.invoiceStatus === "Overdue" ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {form.invoiceStatus}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 mb-1">
                Payment Method
              </p>
              <p className="font-medium">{form.paymentMethod || "To be determined"}</p>
            </div>
          </div>
        </section>
      </div>
    </article>
  );
}

function ContractPage() {
  const router = useRouter();
  const [form, setForm] = useState<ContractForm>(initialForm);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [recentContracts, setRecentContracts] = useState<ContractRow[]>([]);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authStatus, setAuthStatus] = useState("Checking sign-in...");
  const [workspace, setWorkspace] = useState<ArtistWorkspace | null>(null);
  const [workspaceStatus, setWorkspaceStatus] = useState("Loading workspace...");
  const [saveStatus, setSaveStatus] = useState("Local draft");
  const [emailStatus, setEmailStatus] = useState("");
  const [activePanel, setActivePanel] = useState<"form" | "preview">("form");
  const [recentStatusFilter, setRecentStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showTemplateLibrary, setShowTemplateLibrary] = useState(false);
  const [templates, setTemplates] = useState<ContractForm[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [focusMode, setFocusMode] = useState(false);
  const [wizardMode, setWizardMode] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [wizardStep, setWizardStep] = useState(1);
  const [activeTab, setActiveTab] = useState("all");

  // Define wizard steps (memoized for performance)
  const wizardSteps = useMemo(
    () => [
      { id: 1, name: "Event Info", sections: ["eventInfo"] },
      { id: 2, name: "Services", sections: ["services"] },
      { id: 3, name: "Payment", sections: ["payment"] },
      { id: 4, name: "Options", sections: ["options", "rightsUsage", "operational"] },
      { id: 5, name: "Requirements", sections: ["performanceRequirements", "technicalRider"] },
      { id: 6, name: "Legal", sections: ["financialLegal", "contractLanguage"] },
      { id: 7, name: "Logistics", sections: ["accommodation", "perDiem", "publicity"] },
    ],
    []
  );

  // Define tabs (memoized for performance)
  const formTabs = useMemo(
    () => [
      { id: "all", name: "All Sections", sections: [] },
      { id: "event", name: "Event", sections: ["eventInfo"] },
      { id: "services", name: "Services", sections: ["services"] },
      { id: "payment", name: "Payment", sections: ["payment"] },
      { id: "options", name: "Options", sections: ["options"] },
      { id: "requirements", name: "Requirements", sections: ["performanceRequirements", "technicalRider"] },
      { id: "legal", name: "Legal", sections: ["financialLegal", "contractLanguage"] },
      { id: "logistics", name: "Logistics", sections: ["accommodation", "perDiem", "publicity"] },
    ],
    []
  );

  // Get sections for current wizard step
  const currentWizardSections = wizardMode ? wizardSteps.find(s => s.id === wizardStep)?.sections || [] : [];
  const [sessionTimeout, setSessionTimeout] = useState<NodeJS.Timeout | null>(null);
  const [collapsibleSections, setCollapsibleSections] = useState({
    eventInfo: false,
    services: false,
    payment: false,
    options: false,
    contractLanguage: false,
    performanceRequirements: false,
    financialLegal: false,
    technicalRider: false,
    accommodation: false,
    perDiem: false,
    publicity: false,
    rightsUsage: false,
    operational: false,
  });
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [showQuickStart, setShowQuickStart] = useState(false);
  const [quickStartArtistName, setQuickStartArtistName] = useState("");
  const [quickStartClientName, setQuickStartClientName] = useState("");
  const [quickStartFee, setQuickStartFee] = useState("");
  const [quickStartDate, setQuickStartDate] = useState("");
  const [quickStartBookingType, setQuickStartBookingType] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [showSaveVersionModal, setShowSaveVersionModal] = useState(false);
  const [showMailClientModal, setShowMailClientModal] = useState(false);
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false);
  const [workspaceArtistName, setWorkspaceArtistName] = useState("");
  const [workspaceArtistEmail, setWorkspaceArtistEmail] = useState("");
  const [versionNote, setVersionNote] = useState("");
  const [showRestoreConfirmation, setShowRestoreConfirmation] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<any>(null);
  const [activeVersionNumber, setActiveVersionNumber] = useState<number | null>(null);
  const [contractToDelete, setContractToDelete] = useState<string | null>(null);
  const [contractVersions, setContractVersions] = useState<any[]>([]);
  const [calendarEnabled, setCalendarEnabled] = useState(false);
  const [calendarSyncing, setCalendarSyncing] = useState(false);
  const skipRefreshRef = useRef(false);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const skipNextAutosaveRef = useRef(false);
  const versionSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedFormRef = useRef<string>("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Wrapper functions for extracted utilities
  const handleDownloadPdf = async () => {
    await downloadPdf(previewRef, form.eventName || "vocal-performance-agreement", showToast, getErrorMessage, setIsLoading);
  };

  const handleGenerateCalendarEvent = () => {
    generateCalendarEvent({
      eventName: form.eventName || "Performance",
      eventDates: form.eventDates || "",
      clientName: form.clientName || "Client",
      artistName: form.artistName || "Vocalist",
      showToast,
      getErrorMessage,
    });
  };

  // Check authentication on mount
  useEffect(() => {
    if (!supabase) {
      setAuthStatus("Add Supabase keys to enable secure artist login");
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setAuthUser(data.user);
      setUserEmail(data.user?.email || "");
      setAuthStatus(data.user ? `Signed in as ${data.user.email}` : "Sign in required");
      if (!data.user) {
        // Login route removed — do not redirect. Keep the app accessible in a signed-out state.
        setAuthStatus("Sign in required");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthUser(session?.user || null);
      setUserEmail(session?.user?.email || "");
      setAuthStatus(session?.user ? `Signed in as ${session.user.email}` : "Sign in required");
      if (!session?.user) {
        setWorkspace(null);
        setRecentContracts([]);
        setDraftId(null);
        setHasLoadedDraft(true);
        setSaveStatus("Sign in to save contracts");
        // Login route removed — do not redirect users. Keep workspace state cleared for signed-out users.
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Check email verification status
  useEffect(() => {
    if (authUser && !authUser.email_confirmed_at) {
      showToast("Please verify your email address", "info");
    }
  }, [authUser]);

  // Session timeout - auto-logout after 30 minutes of inactivity
  useEffect(() => {
    const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

    const resetTimeout = () => {
      if (sessionTimeout) clearTimeout(sessionTimeout);
      setSessionTimeout(
        setTimeout(() => {
          handleLogout();
          showToast("Session expired. Please sign in again.", "info");
        }, SESSION_TIMEOUT)
      );
    };

    const handleActivity = () => {
      resetTimeout();
    };

    // Track user activity
    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, handleActivity));

    resetTimeout();

    return () => {
      if (sessionTimeout) clearTimeout(sessionTimeout);
      events.forEach((event) => window.removeEventListener(event, handleActivity));
    };
  }, [sessionTimeout]);

  const handleLogout = async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      showToast(getErrorMessage(error, "auth"), "error");
    }
  };

  const showToast = (message: string, type: "success" | "error" | "info" = "info") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
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
      case "depositTerms":
        if (!value || value.trim() === "") errors.depositTerms = "Please specify the deposit payment terms";
        break;
      case "cancellationTerms":
        if (!value || value.trim() === "") errors.cancellationTerms = "Please specify the cancellation policy";
        break;
      case "technicalRequirements":
        if (!value || value.trim() === "") errors.technicalRequirements = "Please specify the technical requirements";
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

  const toggleSection = (key: keyof typeof collapsibleSections) => {
    setCollapsibleSections(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isSectionVisible = (section: keyof typeof collapsibleSections, tab: string) =>
    (!wizardMode || currentWizardSections.includes(section)) &&
    (collapsibleSections[section] || wizardMode) &&
    (activeTab === "all" || activeTab === tab);

  const collapsibleSectionProps = (section: keyof typeof collapsibleSections, tab: string) => ({
    isOpen: collapsibleSections[section],
    isVisible: isSectionVisible(section, tab),
    onToggle: () => toggleSection(section),
  });

  const renderResettableTextarea = ({ field, label, defaultValue }: ResettableTextareaConfig) => (
    <TextareaField
      key={field}
      label={label}
      value={form[field] ?? ""}
      onChange={handleTextareaChange(field)}
      onReset={() => resetClause(field, defaultValue)}
    />
  );

  const createWorkspaceSlug = (name: string) =>
    `${name || "artist"}-${Math.random().toString(36).slice(2, 8)}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const applyWorkspaceToForm = (artistWorkspace: ArtistWorkspace) => {
    setForm((currentForm) => ({
      ...currentForm,
      artistName: currentForm.artistName || artistWorkspace.artist_name || "",
      artistEmail: currentForm.artistEmail || artistWorkspace.artist_email || "",
      artistLogo: currentForm.artistLogo || artistWorkspace.artist_logo || "",
    }));
  };

  const signOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    router.push("/login");
    showToast("Signed out", "success");
  };

  const signInWithGoogle = async () => {
    if (!supabase) {
      showToast("Supabase not initialized", "error");
      return;
    }

    console.log("Initiating Google OAuth sign-in...");

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}${window.location.pathname}`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) {
      console.error("Google sign-in error:", error);
      showToast(getErrorMessage(error, "auth"), "error");
      return;
    }

  console.log("Google OAuth initiated successfully", data);
};

useEffect(() => {
  const today = new Date().toISOString().split("T")[0];
  setForm((prev) => ({ ...prev, eventDates: today }));
}, []);

  const createWorkspace = async (artistName: string, artistEmail: string) => {
    if (!supabase || !authUser) {
      showToast("Sign in before creating a workspace", "error");
      return;
    }

    const shareSlug = createWorkspaceSlug(artistName);
    const { data, error } = await supabase
      .from("artist_workspaces")
      .insert({
        owner_user_id: authUser.id,
        artist_name: artistName,
        artist_email: artistEmail,
        share_slug: shareSlug,
      })
      .select("*")
      .single<ArtistWorkspace>();

    if (error) {
      setWorkspaceStatus(getErrorMessage(error, "supabase"));
      showToast(getErrorMessage(error, "supabase"), "error");
      return;
    }

    setWorkspace(data);
    setWorkspaceStatus(`Workspace: ${data.artist_name || data.share_slug}`);
    applyWorkspaceToForm(data);
    setWorkspaceArtistName("");
    setWorkspaceArtistEmail("");
    setShowWorkspaceModal(false);
    showToast("Artist workspace ready", "success");
  };

  useEffect(() => {
    const loadWorkspace = async () => {
      if (!supabase) {
        setWorkspaceStatus("Add Supabase keys to enable workspaces");
        setHasLoadedDraft(true);
        return;
      }

      if (!authUser) {
        setWorkspaceStatus("Sign in to access your workspace");
        setSaveStatus("Sign in to save contracts");
        setHasLoadedDraft(true);
        return;
      }

      // Load workspace by owner_user_id
      const { data, error } = await supabase
        .from("artist_workspaces")
        .select("*")
        .eq("owner_user_id", authUser.id)
        .maybeSingle<ArtistWorkspace>();

      if (error) {
        setWorkspaceStatus(getErrorMessage(error, "supabase"));
        setHasLoadedDraft(true);
        return;
      }

      if (!data) {
        // Auto-create workspace if user doesn't have one
        const shareSlug = createWorkspaceSlug(authUser.email || "artist");
        const { data: newWorkspace, error: createError } = await supabase
          .from("artist_workspaces")
          .insert({
            owner_user_id: authUser.id,
            artist_name: authUser.email?.split("@")[0] || "Artist",
            artist_email: authUser.email,
            share_slug: shareSlug,
          })
          .select("*")
          .single<ArtistWorkspace>();

        if (createError) {
          setWorkspaceStatus(getErrorMessage(createError, "supabase"));
          setHasLoadedDraft(true);
          return;
        }

        setWorkspace(newWorkspace);
        setWorkspaceStatus(`Workspace: ${newWorkspace.artist_name || newWorkspace.share_slug}`);
        applyWorkspaceToForm(newWorkspace);
        showToast("Workspace created automatically", "success");
      } else {
        setWorkspace(data);
        setWorkspaceStatus(`Workspace: ${data.artist_name || data.share_slug}`);
        applyWorkspaceToForm(data);
      }

      setHasLoadedDraft(true);
    };

    loadWorkspace();
  }, [authUser]);

  const refreshRecentContracts = useCallback(async () => {
    if (!supabase || !workspace) {
      return;
    }

    const { data, error } = await supabase
      .from("contracts")
      .select("*")
      .eq("workspace_id", workspace.id)
      .order("created_at", { ascending: false })
      .limit(8);

    console.log("RefreshRecentContracts loaded:", data?.length || 0, "contracts", error || "Success");
    console.log("Contract IDs:", data?.map((c: any) => c.id));

    if (!error && data) {
      setRecentContracts(data as ContractRow[]);
    }
  }, [workspace]);

  useEffect(() => {
    const loadLatestDraft = async () => {
      if (!supabase) {
        setHasLoadedDraft(true);
        setSaveStatus("Add Supabase keys to enable autosave");
        return;
      }

      if (!workspace) {
        setSaveStatus("Create or open an artist workspace to enable autosave");
        return;
      }

      const { data, error } = await supabase
        .from("contracts")
        .select("*")
        .eq("workspace_id", workspace.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle<ContractRow>();

      if (error) {
        setSaveStatus(getErrorMessage(error, "load"));
        console.error("Load draft error:", error);
        setHasLoadedDraft(true);
        return;
      }

      if (data) {
        setDraftId(data.id);
        skipNextAutosaveRef.current = true;
        setForm(contractRowToForm(data));
        setSaveStatus("Latest draft loaded");
      }

      setHasLoadedDraft(true);
      refreshRecentContracts();
    };

    loadLatestDraft();
  }, [refreshRecentContracts, workspace]);

  useEffect(() => {
    if (!supabase || !hasLoadedDraft || !workspace) {
      return;
    }

    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return;
    }

    setSaveStatus("Saving draft...");
    const supabaseClient = supabase;

    const timeoutId = window.setTimeout(async () => {
      const payload = {
        workspace_id: workspace.id,
        artist_name: form.artistName,
        artist_email: form.artistEmail,
        artist_logo: form.artistLogo || null,
        booking_preset: form.bookingPreset,
        contract_status: form.contractStatus,
        client_name: form.clientName,
        representative_name: form.representativeName,
        email: form.email,
        phone: form.phoneNumber,
        event_name: form.eventName,
        event_dates: form.eventDates,
        venue: form.venueLocation,
        services: form.services,
        total_fee: Number(form.totalFee) || 0,
        deposit_percentage: form.depositPercentage !== "" ? Number(form.depositPercentage) : 50,
        travel_required: form.travelRequired,
        deposit_terms: form.depositTerms,
        travel_terms: form.travelTerms,
        cancellation_terms: form.cancellationTerms,
        technical_requirements: form.technicalRequirements,
        performance_duration: form.performanceDuration || null,
        payment_method: form.paymentMethod || null,
        date_of_agreement: form.dateOfAgreement || null,
        media_rights_allowed: form.mediaRightsAllowed,
        media_rights_terms: form.mediaRightsTerms,
        force_majeure_included: form.forceMajeureIncluded,
        force_majeure_terms: form.forceMajeureTerms,
        independent_contractor_clause: form.independentContractorClause,
        artist_signer_name: form.artistSignerName,
        client_signer_name: form.clientSignerName,
        artist_signer_title: form.artistSignerTitle,
        client_signer_title: form.clientSignerTitle,
        artist_signature: form.artistSignature,
        client_signature: form.clientSignature,
        signed_date: form.signedDate || null,
        delivery_subject: form.deliverySubject,
        delivery_message: form.deliveryMessage,
        invoice_number: form.invoiceNumber,
        invoice_date: form.invoiceDate || null,
        invoice_status: form.invoiceStatus,
        invoice_due_date: form.invoiceDueDate || null,
        invoice_notes: form.invoiceNotes,
        status: form.contractStatus.toLowerCase(),
        // New fields for comprehensive contract
        rehearsal_required: form.rehearsalRequired,
        rehearsal_details: form.rehearsalDetails,
        sound_check_required: form.soundCheckRequired,
        sound_check_details: form.soundCheckDetails,
        hospitality_required: form.hospitalityRequired,
        hospitality_details: form.hospitalityDetails,
        late_payment_penalty: form.latePaymentPenalty,
        cancellation_fee: form.cancellationFee,
        insurance_required: form.insuranceRequired,
        insurance_details: form.insuranceDetails,
        image_usage_allowed: form.imageUsageAllowed,
        image_usage_terms: form.imageUsageTerms,
        merchandise_sales_allowed: form.merchandiseSalesAllowed,
        merchandise_terms: form.merchandiseTerms,
        guest_list_count: form.guestListCount,
        security_required: form.securityRequired,
        security_details: form.securityDetails,
        parking_provided: form.parkingProvided,
        parking_details: form.parkingDetails,
        governing_law: form.governingLaw,
        dispute_resolution: form.disputeResolution,
        indemnification_clause: form.indemnificationClause,
        confidentiality_clause: form.confidentialityClause,
        equipment_liability_clause: form.equipmentLiabilityClause,
        attorney_fees_clause: form.attorneyFeesClause,
      };

      if (draftId) {
        const { error } = await supabaseClient
          .from("contracts")
          .update(payload)
          .eq("id", draftId)
          .eq("workspace_id", workspace.id);

        setSaveStatus(error ? getErrorMessage(error, "save") : "Draft saved");
        if (error) {
          console.error("Autosave error:", error);
        }
        if (!error) {
          saveContractVersion(draftId, form);
          if (!skipRefreshRef.current) {
            refreshRecentContracts();
          }
        }
        return;
      }

      const { data, error } = await supabaseClient
        .from("contracts")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        setSaveStatus(getErrorMessage(error, "save"));
        console.error("Autosave insert error:", error);
        return;
      }

      setDraftId(data.id);
      setSaveStatus("Draft saved");
      if (!skipRefreshRef.current) {
        refreshRecentContracts();
      }
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [draftId, form, hasLoadedDraft, refreshRecentContracts, workspace]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        setSaveStatus("Saving draft...");
        // Trigger autosave immediately
        skipNextAutosaveRef.current = true;
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        handleDownloadPdf();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        startNewContract();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [draftId, supabase]);

  // Load templates from localStorage
  useEffect(() => {
    const savedTemplates = localStorage.getItem("contractTemplates");
    if (savedTemplates) {
      try {
        setTemplates(JSON.parse(savedTemplates));
      } catch (e) {
        console.error("Failed to load templates:", e);
      }
    }
  }, []);

  // Detect online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      showToast("Back online - syncing with Supabase", "success");
    };
    const handleOffline = () => {
      setIsOnline(false);
      showToast("You're offline - saving to local storage", "info");
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-save to localStorage when offline
  useEffect(() => {
    if (!isOnline) {
      localStorage.setItem("offlineDraft", JSON.stringify(form));
      localStorage.setItem("offlineDraftTimestamp", Date.now().toString());
    }
  }, [form, isOnline]);

  // Load offline draft when coming back online
  useEffect(() => {
    if (isOnline && supabase) {
      const offlineDraft = localStorage.getItem("offlineDraft");
      const offlineTimestamp = localStorage.getItem("offlineDraftTimestamp");
      if (offlineDraft && offlineTimestamp) {
        const timeDiff = Date.now() - parseInt(offlineTimestamp);
        // If offline draft is less than 24 hours old, offer to restore
        if (timeDiff < 86400000) {
          showToast("Offline draft available - use Recent Contracts to restore", "info");
        }
      }
    }
  }, [isOnline, supabase]);

  const updateField = (field: keyof ContractForm, value: string | boolean) => {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));
  };

  const toggleService = (service: string) => {
    setForm((currentForm) => {
      const serviceSelected = currentForm.services.includes(service);

      return {
        ...currentForm,
        services: serviceSelected
          ? currentForm.services.filter((item) => item !== service)
          : [...currentForm.services, service],
      };
    });
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

  const applyBookingPreset = (presetLabel: string) => {
    const preset = bookingPresets.find((item) => item.label === presetLabel);

    setForm((currentForm) => ({
      ...currentForm,
      bookingPreset: presetLabel,
      services: preset ? preset.services : currentForm.services,
      totalFee: preset?.totalFee ?? currentForm.totalFee,
      depositPercentage: preset?.depositPercentage ?? currentForm.depositPercentage,
      performanceDuration: preset?.performanceDuration ?? currentForm.performanceDuration,
      travelRequired: preset?.travelRequired ?? currentForm.travelRequired,
      soundCheckRequired: preset?.soundCheckRequired ?? currentForm.soundCheckRequired,
      technicalRiderRequired: preset?.technicalRiderRequired ?? currentForm.technicalRiderRequired,
      accommodationRequired: preset?.accommodationRequired ?? currentForm.accommodationRequired,
      perDiemRequired: preset?.perDiemRequired ?? currentForm.perDiemRequired,
      rehearsalRequired: preset?.rehearsalRequired ?? currentForm.rehearsalRequired,
    }));
    showToast(`Applied ${presetLabel} preset`, "success");
  };

  const startNewContract = () => {
    skipNextAutosaveRef.current = true;
    setDraftId(null);
    setForm({
      ...initialForm,
      artistName: workspace?.artist_name || "",
      artistEmail: workspace?.artist_email || "",
      artistLogo: workspace?.artist_logo || "",
    });
    setSaveStatus("New draft started");
    showToast("New blank contract ready", "success");
  };

  const saveTemplate = () => {
    const templateName = prompt("Enter a name for this template:");
    if (!templateName) return;
    
    const newTemplate = { ...form, templateName };
    const updatedTemplates = [...templates, newTemplate];
    setTemplates(updatedTemplates);
    localStorage.setItem("contractTemplates", JSON.stringify(updatedTemplates));
    showToast("Template saved successfully", "success");
  };

  const loadTemplate = (template: ContractForm) => {
    setForm(template);
    setShowTemplateLibrary(false);
    showToast("Template loaded successfully", "success");
  };

  const deleteTemplate = (index: number) => {
    const updatedTemplates = templates.filter((_, i) => i !== index);
    setTemplates(updatedTemplates);
    localStorage.setItem("contractTemplates", JSON.stringify(updatedTemplates));
    showToast("Template deleted", "success");
  };

  const loadRecentContract = (contract: ContractRow) => {
    skipNextAutosaveRef.current = true;
    setDraftId(contract.id);
    setForm(contractRowToForm(contract));
    setSaveStatus("Contract loaded");
    showToast(`Loaded ${contract.client_name || "contract draft"}`, "success");
  };

  const deleteContract = async (id: string) => {
    setContractToDelete(id);
    setShowDeleteModal(true);
  };

  const saveContractVersion = async (contractId: string, contractData: ContractForm, manualNote?: string) => {
    if (!supabase || !contractId) return;

    // Check if form data has significantly changed
    const currentFormHash = JSON.stringify(contractData);
    if (!manualNote && currentFormHash === lastSavedFormRef.current) {
      return; // Skip saving if no significant changes
    }

    // Reset active version when form is modified
    if (!manualNote) {
      setActiveVersionNumber(null);
    }

    // Debounce version saves (wait 5 seconds after last change before saving)
    if (!manualNote) {
      if (versionSaveTimeoutRef.current) {
        clearTimeout(versionSaveTimeoutRef.current);
      }
      versionSaveTimeoutRef.current = setTimeout(async () => {
        await createVersion(contractId, contractData, manualNote);
        lastSavedFormRef.current = currentFormHash;
      }, 5000);
      return;
    }

    // Manual saves are immediate
    await createVersion(contractId, contractData, manualNote);
    lastSavedFormRef.current = currentFormHash;
  };

  const createVersion = async (contractId: string, contractData: ContractForm, manualNote?: string) => {
    if (!supabase || !contractId) return;

    // Get the current version number for this contract
    const { data: versions } = await supabase
      .from("contract_versions")
      .select("version_number")
      .eq("contract_id", contractId)
      .order("version_number", { ascending: false })
      .limit(1);

    const nextVersion = versions && versions.length > 0 ? versions[0].version_number + 1 : 1;

    // Save the version
    const { error } = await supabase
      .from("contract_versions")
      .insert({
        contract_id: contractId,
        workspace_id: workspace?.id || null,
        version_number: nextVersion,
        contract_data: contractData,
        created_by: form.artistName || "Unknown",
        version_note: manualNote || "Autosave",
      });

    if (error) {
      console.error("Version save error:", error);
      return;
    }

    // Limit to last 20 versions
    await limitVersions(contractId);
  };

  const limitVersions = async (contractId: string) => {
    if (!supabase || !contractId) return;

    // Get all versions for this contract
    const { data: versions } = await supabase
      .from("contract_versions")
      .select("id, version_number")
      .eq("contract_id", contractId)
      .order("version_number", { ascending: false });

    if (!versions || versions.length <= 20) return;

    // Delete versions older than the last 20
    const versionsToDelete = versions.slice(20);
    for (const version of versionsToDelete) {
      await supabase
        .from("contract_versions")
        .delete()
        .eq("id", version.id);
    }
  };

  const loadContractVersions = async (contractId: string) => {
    try {
      if (!supabase || !contractId) return;

      let query = supabase
        .from("contract_versions")
        .select("*")
        .eq("contract_id", contractId)
        .order("version_number", { ascending: false });

      if (workspace) {
        query = query.eq("workspace_id", workspace.id);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Version load error:", error);
        showToast(getErrorMessage(error, "load"), "error");
        return;
      }

      setContractVersions(data || []);
      setShowVersionHistory(true);
    } catch (error) {
      console.error("Version load error:", error);
      showToast(getErrorMessage(error, "load"), "error");
    }
  };

  const restoreContractVersion = async (version: any) => {
    setVersionToRestore(version);
    setShowRestoreConfirmation(true);
  };

  const confirmRestoreVersion = async () => {
    try {
      if (!versionToRestore || !versionToRestore.contract_data) return;

      setIsLoading(true);
      skipNextAutosaveRef.current = true;
      setForm(versionToRestore.contract_data);
      setSaveStatus(`Restored version ${versionToRestore.version_number}`);
      setActiveVersionNumber(versionToRestore.version_number);
      setShowVersionHistory(false);
      setShowRestoreConfirmation(false);
      showToast(`Restored version ${versionToRestore.version_number}`, "success");
      setVersionToRestore(null);
    } catch (error) {
      console.error("Restore version error:", error);
      showToast(getErrorMessage(error, "supabase"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDeleteContract = async () => {
    if (!contractToDelete) return;

    console.log("Deleting contract:", contractToDelete);

    if (supabase) {
      let deleteQuery = supabase
        .from("contracts")
        .delete()
        .eq("id", contractToDelete);

      if (workspace) {
        deleteQuery = deleteQuery.eq("workspace_id", workspace.id);
      }

      const { error } = await deleteQuery;
      
      console.log("Delete result:", error || "Success");
      
      if (error) {
        console.error("Supabase delete error:", error);
        showToast(getErrorMessage(error, "supabase"), "error");
        setShowDeleteModal(false);
        setContractToDelete(null);
        return;
      }
    }

    // If the deleted contract was the active draft, reset the form
    if (draftId === contractToDelete) {
      setDraftId("");
      setForm({
        ...initialForm,
        artistName: workspace?.artist_name || "",
        artistEmail: workspace?.artist_email || "",
        artistLogo: workspace?.artist_logo || "",
      });
      setSaveStatus("Local draft");
    }

    // Remove the contract from the local state
    setRecentContracts((prev) => prev.filter((c) => c.id !== contractToDelete));
    
    // Skip the next refresh to prevent the deleted contract from reappearing
    skipRefreshRef.current = true;
    setTimeout(() => {
      skipRefreshRef.current = false;
    }, 1000);
    
    showToast("Contract deleted", "success");
    setShowDeleteModal(false);
    setContractToDelete(null);
  };

  const handleQuickStart = (data: {
    artistName: string;
    clientName: string;
    fee: string;
    date: string;
    preset: string;
  }) => {
    skipNextAutosaveRef.current = true;
    const preset = bookingPresets.find((p) => p.label === data.preset) || bookingPresets[0];
    
    setForm((prev) => ({
      ...initialForm,
      artistName: data.artistName,
      clientName: data.clientName,
      eventName: "Performance",
      eventDates: data.date,
      totalFee: data.fee,
      bookingPreset: data.preset,
      services: preset.services,
      depositPercentage: preset.depositPercentage,
      performanceDuration: preset.performanceDuration,
      travelRequired: preset.travelRequired,
      soundCheckRequired: preset.soundCheckRequired || false,
      technicalRiderRequired: preset.technicalRiderRequired || false,
      accommodationRequired: preset.accommodationRequired || false,
      perDiemRequired: preset.perDiemRequired || false,
      contractStatus: "Draft",
    }));
    
    setShowQuickStart(false);
    setSaveStatus("Contract created");
    showToast("Contract created with smart defaults", "success");
    showToast("Fill in additional details as needed", "info");
  };

  const copyEmailMessage = async () => {
    const greeting =
      form.representativeName || form.clientName || "there";
    const eventReference = form.eventName || "the upcoming engagement";
    const artistName = form.artistName || "the artist";
    const subject =
      form.deliverySubject ||
      `Vocal Performance Agreement - ${form.eventName || "Booking"}`;
    const message = `Hi ${greeting},

Thank you for considering ${artistName} for ${eventReference}. Attached is the vocal performance agreement for your review.

Please review the contract and let me know if you have any questions or need any adjustments. Once you're ready to proceed, we can finalize the booking.

Best regards,
${artistName}`;

    try {
      await navigator.clipboard.writeText(message);
      setEmailStatus("Email copied");
      showToast("Email message copied to clipboard", "success");
    } catch (err) {
      showToast(getErrorMessage(err, "copy"), "error");
    }
    window.setTimeout(() => setEmailStatus(""), 2000);
  };

  const buildEmailDraft = () => {
    const recipient = form.email || "";
    const subject = form.deliverySubject || `Vocal Performance Agreement - ${form.eventName || "Booking"}`;
    const body = form.deliveryMessage || `Hi ${form.representativeName || form.clientName || "there"},

The vocal performance agreement for ${form.eventName || "the upcoming engagement"} is ready for review and signature.

Please attach the downloaded contract PDF (${form.eventName || "vocal-performance-agreement"}.pdf) to this email and let me know if you have any questions.

Best,
${form.artistName || "the artist"}`;

    return { recipient, subject, body };
  };

  const sendEmail = async () => {
    try {
      setIsLoading(true);
      await handleDownloadPdf();
      setShowMailClientModal(true);
    } catch (error) {
      console.error("Error sending email:", error);
      showToast(getErrorMessage(error, "email"), "error");
    } finally {
      setIsLoading(false);
    }
  };

  const openDefaultMailClient = () => {
    const { recipient, subject, body } = buildEmailDraft();
    const mailtoLink = `mailto:${encodeURIComponent(recipient)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_self");
    setShowMailClientModal(false);
  };

  const openGmailDraft = () => {
    const { recipient, subject, body } = buildEmailDraft();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(recipient)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank", "noopener,noreferrer");
    setShowMailClientModal(false);
  };

  const generateShareLink = () => {
    if (!draftId) {
      showToast("Please save the contract first", "error");
      return;
    }
    const shareLink = `${window.location.origin}/contract/share/${draftId}`;
    navigator.clipboard.writeText(shareLink);
    showToast("Share link copied to clipboard", "success");
    setShowShareModal(false);
  };

  const resetClause = (field: keyof ContractForm, value: string) => {
    updateField(field, value);
    showToast("Clause reset to default", "info");
  };

  const validationItems = [
    !form.artistName && "Add artist name before exporting.",
    !form.clientName && "Add client or organization name.",
    form.services.length === 0 && "Select at least one vocal service.",
    !form.totalFee && "Add the total fee.",
  ].filter(Boolean) as string[];

  const readinessChecks = [
    { label: "Artist name", complete: Boolean(form.artistName), field: "artistName", sectionId: "section-artist" },
    { label: "Artist email", complete: Boolean(form.artistEmail), field: "artistEmail", sectionId: "section-artist" },
    { label: "Client name", complete: Boolean(form.clientName), field: "clientName", sectionId: "section-artist" },
    { label: "Client email", complete: Boolean(form.email), field: "email", sectionId: "section-artist" },
    { label: "Event name", complete: Boolean(form.eventName), field: "eventName", sectionId: "section-event" },
    { label: "Event dates", complete: Boolean(form.eventDates), field: "eventDates", sectionId: "section-event" },
    { label: "Venue location", complete: Boolean(form.venueLocation), field: "venueLocation", sectionId: "section-event" },
    { label: "Services", complete: form.services.length > 0, field: "services", sectionId: "section-services" },
    { label: "Total fee", complete: Boolean(form.totalFee), field: "totalFee", sectionId: "section-payment" },
    { label: "Deposit terms", complete: Boolean(form.depositTerms), field: "depositTerms", sectionId: "section-payment" },
    { label: "Cancellation terms", complete: Boolean(form.cancellationTerms), field: "cancellationTerms", sectionId: "section-payment" },
    { label: "Technical requirements", complete: Boolean(form.technicalRequirements), field: "technicalRequirements", sectionId: "section-technical" },
  ];
  const readinessScore = Math.round(
    (readinessChecks.filter((item) => item.complete).length / readinessChecks.length) * 100,
  );
  const filteredContracts =
    recentStatusFilter === "All"
      ? recentContracts.filter(contract => {
          if (!searchQuery) return true;
          const query = searchQuery.toLowerCase();
          return (
            (contract.client_name || "").toLowerCase().includes(query) ||
            (contract.event_name || "").toLowerCase().includes(query) ||
            (contract.contract_status || contract.status || "").toLowerCase().includes(query)
          );
        })
      : recentContracts
          .filter(
            (contract) =>
              (contract.contract_status || contract.status || "Draft").toLowerCase() ===
              recentStatusFilter.toLowerCase(),
          )
          .filter(contract => {
            if (!searchQuery) return true;
            const query = searchQuery.toLowerCase();
            return (
              (contract.client_name || "").toLowerCase().includes(query) ||
              (contract.event_name || "").toLowerCase().includes(query) ||
              (contract.contract_status || contract.status || "").toLowerCase().includes(query)
            );
          });

  const markReady = (status: string) => {
    if (readinessScore < 100) {
      showToast("Complete the readiness checklist before marking ready", "error");
      return;
    }
    updateField("contractStatus", status as ContractForm["contractStatus"]);
    showToast(`Contract marked as ${status}`, "success");
  };

  const updateContractStatus = (status: string) => {
    if (status === "Ready" && readinessScore < 100) {
      showToast("Complete the readiness checklist before marking ready", "error");
      return;
    }

    updateField("contractStatus", status);
    showToast(`Contract marked as ${status}`, "success");
  };

  const prepareSendPackage = async () => {
    const subject = `Vocal Performance Agreement - ${form.eventName || "Booking"}`;
    const artistName = form.artistName || "the artist";
    const message = `Hi ${form.representativeName || form.clientName || "there"},

The vocal performance agreement for ${form.eventName || "the upcoming engagement"} is ready for review and signature.

Suggested attachment: ${form.eventName || "vocal-performance-agreement"}.pdf

Best,
${artistName}`;

    setForm((currentForm) => ({
      ...currentForm,
      contractStatus: readinessScore === 100 ? "Ready" : currentForm.contractStatus,
      deliverySubject: subject,
      deliveryMessage: message,
    }));
    await navigator.clipboard.writeText(`Subject: ${subject}\n\n${message}`);
    showToast("Send package prepared successfully", "success");
  };

  return (
    <>
      <style>{customScrollbarStyles}</style>
      <main className="min-h-screen bg-gray-100 dark:bg-gray-900 text-stone-950 dark:text-stone-100">
      {/* Global Header */}
      <header className="sticky top-0 z-50 h-16 bg-stone-950/90 backdrop-blur-xl border-b border-gray-400/20 px-4 text-gray-50 shadow-lg shadow-gray-900/10 lg:px-8">
        <div className="flex h-full items-center justify-between max-w-[1600px] mx-auto">
          {/* Left side - Branding */}
          <div className="flex items-center gap-4">
            <div className="flex h-9 w-9 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-medium text-gray-50 tracking-normal font-heading">Setlist</h1>
              <span className="text-caption font-medium text-gray-400/70 tracking-wide uppercase">{readinessScore}% ready</span>
            </div>
          </div>

          {/* Center - Quick Actions */}
          <div className="hidden lg:flex items-center">
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowQuickActions(!showQuickActions)}
                aria-expanded={showQuickActions}
                aria-haspopup="menu"
                aria-controls="quick-actions-menu"
                className="flex items-center gap-2 rounded-lg border border-gray-400/25 bg-gray-400/10 px-4 py-2 text-body font-medium text-gray-100 tracking-normal transition-colors hover:bg-gray-400/20"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="1"></circle>
                  <circle cx="12" cy="5" r="1"></circle>
                  <circle cx="12" cy="19" r="1"></circle>
                </svg>
                Quick Actions
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform ${showQuickActions ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              {showQuickActions && (
                <div id="quick-actions-menu" role="menu" className="absolute top-full mt-2 left-0 w-48 rounded-lg border border-gray-200 bg-white shadow-xl shadow-gray-950/10 py-1 z-50 dark:border-gray-500/20 dark:bg-stone-950 dark:shadow-black/30">
                  <button
                    type="button"
                    onClick={() => { startNewContract(); setShowQuickActions(false); }}
                    role="menuitem"
                    className="w-full px-4 py-2 text-left text-body font-regular text-neutral-700 tracking-normal hover:bg-neutral-50 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    New Contract
                  </button>
                  <button
                    type="button"
                    onClick={() => { handleDownloadPdf(); setShowQuickActions(false); }}
                    role="menuitem"
                    className="w-full px-4 py-2 text-left text-body font-regular text-neutral-700 tracking-normal hover:bg-neutral-50 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    Download PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => { handleGenerateCalendarEvent(); setShowQuickActions(false); }}
                    role="menuitem"
                    className="w-full px-4 py-2.5 text-left text-body font-medium text-neutral-700 tracking-normal hover:bg-neutral-50 hover:text-neutral-900 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900 dark:hover:text-stone-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Add to Calendar
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowTemplateLibrary(true); setShowQuickActions(false); }}
                    role="menuitem"
                    className="w-full px-4 py-2.5 text-left text-body font-medium text-neutral-700 tracking-normal hover:bg-neutral-50 hover:text-neutral-900 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900 dark:hover:text-stone-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    Templates
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAnalytics(true); setShowQuickActions(false); }}
                    role="menuitem"
                    className="w-full px-4 py-2 text-left text-body font-regular text-neutral-700 tracking-normal hover:bg-neutral-50 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                    Analytics
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFocusMode(!focusMode); setShowQuickActions(false); }}
                    role="menuitem"
                    className="w-full px-4 py-2 text-left text-body font-regular text-neutral-700 tracking-normal hover:bg-neutral-50 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <line x1="12" y1="8" x2="12" y2="16"/>
                      <line x1="8" y1="12" x2="16" y2="12"/>
                    </svg>
                    {focusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setWizardMode(!wizardMode); setShowQuickActions(false); if (!wizardMode) setWizardStep(1); }}
                    role="menuitem"
                    className="w-full px-4 py-2 text-left text-body font-regular text-neutral-700 tracking-normal hover:bg-neutral-50 transition-colors flex items-center gap-3 dark:text-stone-200 dark:hover:bg-stone-900"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                    {wizardMode ? "Exit Wizard Mode" : "Enter Wizard Mode"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right side - User */}
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-stone-950 shadow-sm shadow-gray-500/30">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <p className="text-body font-medium text-gray-100/90 tracking-normal hidden sm:block">{userEmail || "User"}</p>
              <button
                type="button"
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-100 hover:bg-gray-400/10 transition-all focus-visible:ring-2 focus-visible:ring-gray-300 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
                title="Sign out"
                aria-label="Sign out"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" y1="12" x2="9" y2="12"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className={`mx-auto flex max-w-[1400px] flex-col gap-6 px-4 py-6 lg:h-[calc(100vh-64px)] lg:flex-row lg:overflow-hidden lg:gap-6 transition-all duration-300 ${
        focusMode ? 'lg:gap-0' : ''
      }`}>
        {focusMode && (
          <button
            type="button"
            onClick={() => setFocusMode(false)}
            className="fixed top-20 right-4 z-[55] flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white text-sm font-medium shadow-lg hover:bg-neutral-800 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            Exit Focus Mode
          </button>
        )}
        <div className={`grid grid-cols-2 rounded-xl border border-gray-200/70 bg-white/70 p-1 text-sm font-medium shadow-sm shadow-gray-950/5 backdrop-blur dark:border-gray-500/20 dark:bg-stone-900/70 lg:hidden gap-1 ${focusMode ? 'hidden' : ''}`}>
            <button
              type="button"
              onClick={() => setActivePanel("form")}
              className={`rounded-md px-3 py-3 text-base transition-all duration-200 ease-out min-h-[48px] ${
              activePanel === "form" ? "bg-stone-950 text-gray-100 shadow-sm dark:bg-gray-200 dark:text-stone-950" : "text-stone-600 hover:bg-gray-50 dark:text-stone-300 dark:hover:bg-stone-800"
            }`}
          >
            Form
          </button>
            <button
              type="button"
              onClick={() => setActivePanel("preview")}
              className={`rounded-md px-3 py-3 text-base transition-all duration-200 ease-out min-h-[48px] ${
                activePanel === "preview" ? "bg-stone-950 text-gray-100 shadow-sm dark:bg-gray-200 dark:text-stone-950" : "text-stone-600 hover:bg-gray-50 dark:text-stone-300 dark:hover:bg-stone-800"
              }`}
            >
              Preview
            </button>
        </div>

        <section
          className={`rounded-2xl border border-gray-300/60 bg-white/60 backdrop-blur-2xl p-4 shadow-2xl shadow-gray-900/10 dark:border-gray-600/40 dark:bg-stone-900/60 dark:shadow-black/50 sm:p-6 lg:w-[380px] lg:overflow-y-auto lg:p-6 lg:sticky lg:top-[64px] lg:h-[calc(100vh-64px)] lg:self-start relative ${
            activePanel === "preview" ? "hidden lg:block" : ""
          } ${focusMode ? "hidden" : ""}`}
          ref={formRef}
        >
          {/* Enhanced glassmorphism shine effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/70 via-transparent to-white/30 dark:from-white/20 dark:via-transparent dark:to-white/10 pointer-events-none" />
          <div className="relative z-10">
          <ContractActions
            draftId={draftId}
            supabase={supabase}
            showTemplateLibrary={showTemplateLibrary}
            showAnalytics={showAnalytics}
            setShowQuickStart={setShowQuickStart}
            setShowSaveVersionModal={setShowSaveVersionModal}
            setShowTemplateLibrary={setShowTemplateLibrary}
            setShowAnalytics={setShowAnalytics}
            startNewContract={startNewContract}
            loadContractVersions={loadContractVersions}
            handleGenerateCalendarEvent={handleGenerateCalendarEvent}
            saveStatus={saveStatus}
            isOnline={isOnline}
          />
          </div>
          <div className="mb-4 rounded-lg border border-gray-300/60 bg-white/60 px-4 py-3 shadow-sm shadow-gray-900/10 dark:border-gray-600/40 dark:bg-stone-900/60">
            <div className="flex items-center justify-between gap-3 mb-3">
              <span className="text-xs font-medium uppercase tracking-[0.12em] text-stone-600 dark:text-stone-300">Progress</span>
              <span className="text-xs font-medium text-gray-800 dark:text-gray-300">{readinessScore}% ready</span>
            </div>
            {/* Premium progress bar */}
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3 dark:bg-gray-700">
              <div
                className="h-full bg-gradient-to-r from-gray-600 to-gray-900 rounded-full transition-all duration-500 ease-out dark:from-gray-500 dark:to-gray-300"
                style={{ width: `${readinessScore}%` }}
              />
            </div>
            {readinessScore < 100 && (
              <div className="space-y-2">
                {readinessChecks.filter((item) => !item.complete).slice(0, 3).map((item) => (
                  <div key={item.field} className="flex items-center justify-between gap-2 text-xs text-neutral-600 dark:text-stone-400 group">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400 group-hover:bg-gray-600 transition-colors dark:bg-gray-600 dark:group-hover:bg-gray-400" />
                      <span className="truncate">{item.label}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        // Scroll to section
                        if (item.sectionId) {
                          const element = document.getElementById(item.sectionId);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                        // Auto-fill for specific fields
                        if (item.field === "services") {
                          setForm((prev) => ({ ...prev, services: ["Solo Vocal Performance"] }));
                        } else if (item.field === "depositTerms") {
                          updateField("depositTerms", "A 50% deposit is required to confirm the booking.");
                        } else if (item.field === "cancellationTerms") {
                          updateField("cancellationTerms", "Cancellations must be made at least 14 days before the event for a full refund.");
                        } else if (item.field === "technicalRequirements") {
                          updateField("technicalRequirements", "PA system with at least 2 microphones and monitor speakers required.");
                        }
                        showToast(`Navigated to ${item.label}`, "success");
                      }}
                      className="px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 hover:text-gray-900 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-1 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-100"
                    >
                      Add
                    </button>
                  </div>
                ))}
                {readinessChecks.filter((item) => !item.complete).length > 3 && (
                  <button
                    type="button"
                    onClick={() => {
                      const firstIncomplete = readinessChecks.find((item) => !item.complete);
                      if (firstIncomplete?.sectionId) {
                        const element = document.getElementById(firstIncomplete.sectionId);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="text-[11px] text-stone-500 hover:text-stone-700 transition-colors dark:text-stone-500 dark:hover:text-stone-300"
                  >
                    +{readinessChecks.filter((item) => !item.complete).length - 3} more remaining
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="mb-4 rounded-xl border border-gray-200 bg-white/80 p-3 shadow-md shadow-gray-950/5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-gray-700 mb-2">Search</p>
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-stone-800 outline-none transition-all hover:border-gray-400 focus:border-gray-500 focus:ring-2 focus:ring-amber-200"
            />
          </div>
          <RecentContracts
            activeDraftId={draftId}
            contracts={filteredContracts}
            onLoadContract={loadRecentContract}
            onDeleteContract={deleteContract}
            onStatusFilterChange={setRecentStatusFilter}
            statusFilter={recentStatusFilter}
            supabaseEnabled={Boolean(supabase)}
          />
          {showTemplateLibrary && (
            <div className="mt-4 rounded-xl border border-neutral-300 bg-white p-5 shadow-md">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-base font-medium text-neutral-900 lg:text-lg">
                  Template Library
                </h2>
                <button
                  type="button"
                  onClick={saveTemplate}
                  className="rounded-full bg-stone-950 px-4 py-2 text-xs font-medium text-gray-100 dark:bg-gray-200 dark:text-stone-950 transition hover:bg-stone-900 dark:hover:bg-gray-100 hover:shadow-lg hover:shadow-stone-950/10 hover:scale-105 focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 border border-gray-400"
                >
                  Save as Template
                </button>
              </div>
              {templates.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                  </div>
                  <p className="text-base font-medium text-neutral-900 mb-2">No templates saved yet</p>
                  <p className="text-sm text-neutral-500 mb-4">Save your current contract as a template to reuse it later</p>
                </div>
              ) : (
                <div className="grid gap-2">
                  {templates.map((template, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg border border-neutral-300 bg-white px-4 py-3 hover:border-gray-400 hover:bg-gray-50 hover:shadow-md transition-all"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-900">
                          {(template as any).templateName || `Template ${index + 1}`}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {template.clientName || "No client"} · {template.totalFee ? `$${template.totalFee} CAD` : "No fee"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => loadTemplate(template)}
                          className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                        >
                          Load
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteTemplate(index)}
                          className="rounded-full border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-700 hover:border-red-500 hover:bg-red-50 transition-all focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {showAnalytics && (
            <div className="mt-4 rounded-xl border border-neutral-300 bg-white p-5 shadow-md">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="text-base font-medium text-neutral-900 lg:text-lg">
                  Contract Analytics
                </h2>
              </div>
              {recentContracts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                      <line x1="18" y1="20" x2="18" y2="10"/>
                      <line x1="12" y1="20" x2="12" y2="4"/>
                      <line x1="6" y1="20" x2="6" y2="14"/>
                    </svg>
                  </div>
                  <p className="text-base font-medium text-neutral-900 mb-2">No contracts to analyze</p>
                  <p className="text-sm text-neutral-500 mb-4">Create contracts to see analytics and insights</p>
                  <button
                    type="button"
                    onClick={startNewContract}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-950 text-gray-100 dark:bg-gray-200 dark:text-stone-950 text-body font-medium tracking-normal hover:bg-stone-900 dark:hover:bg-gray-100 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14"/>
                    </svg>
                    Create First Contract
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4 mb-4">
                    <div className="rounded-lg border border-neutral-300 bg-white p-4 hover:shadow-md transition-all">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400 mb-1">Total Contracts</p>
                      <p className="text-2xl font-medium text-neutral-900">{recentContracts.length}</p>
                    </div>
                    <div className="rounded-lg border border-neutral-300 bg-white p-4 hover:shadow-md transition-all">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400 mb-1">Total Revenue</p>
                      <p className="text-2xl font-medium text-neutral-900">
                        ${recentContracts.reduce((sum, c) => sum + (c.total_fee || 0), 0).toLocaleString("en-CA")}
                      </p>
                    </div>
                    <div className="rounded-lg border border-neutral-300 bg-white p-4 hover:shadow-md transition-all">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400 mb-1">Signed</p>
                      <p className="text-2xl font-medium text-emerald-600">
                        {recentContracts.filter(c => c.contract_status === "Signed" || c.status === "Signed").length}
                      </p>
                    </div>
                    <div className="rounded-lg border border-neutral-300 bg-white p-4 hover:shadow-md transition-all">
                      <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400 mb-1">Avg Fee</p>
                      <p className="text-2xl font-medium text-neutral-900">
                        ${recentContracts.length > 0 
                          ? Math.round(recentContracts.reduce((sum, c) => sum + (c.total_fee || 0), 0) / recentContracts.length).toLocaleString("en-CA")
                          : "0"}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-lg border border-neutral-300 bg-white p-4 hover:shadow-md transition-all">
                    <p className="text-xs font-medium uppercase tracking-[0.12em] text-neutral-400 mb-3">Contracts by Status</p>
                    <div className="space-y-2">
                      {["Draft", "Ready", "Sent", "Signed"].map((status) => {
                        const count = recentContracts.filter(c => c.contract_status === status || c.status === status).length;
                        const percentage = recentContracts.length > 0 ? Math.round((count / recentContracts.length) * 100) : 0;
                        return (
                          <div key={status} className="flex items-center gap-3">
                            <span className="text-sm font-medium text-neutral-800 w-16">{status}</span>
                            <div className="flex-1 h-2 rounded-full bg-neutral-200 overflow-hidden">
                              <div
                                className={`h-2 rounded-full ${
                                  status === "Draft" ? "bg-neutral-400" :
                                  status === "Ready" ? "bg-emerald-500" :
                                  status === "Sent" ? "bg-blue-500" :
                                  "bg-purple-500"
                                }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-neutral-900 w-12 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          <div className="mb-4 rounded-xl border border-neutral-300 bg-white p-3 shadow-md">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 mb-2">Quick Navigation</p>
            <div className="flex flex-wrap gap-2">
              {["Event Info", "Services", "Payment", "Options", "Performance", "Technical", "Financial"].map((section) => (
                <button
                  key={section}
                  type="button"
                  onClick={() => {
                    const sectionIdMap: Record<string, string> = {
                      "Event Info": "section-event-info",
                      "Services": "section-services",
                      "Payment": "section-payment",
                      "Options": "section-options",
                      "Performance": "section-performance",
                      "Technical": "section-technical",
                      "Financial": "section-financial",
                    };
                    const sectionMap: Record<string, keyof typeof collapsibleSections> = {
                      "Event Info": "eventInfo",
                      "Services": "services",
                      "Payment": "payment",
                      "Options": "options",
                      "Performance": "performanceRequirements",
                      "Technical": "technicalRider",
                      "Financial": "financialLegal",
                    };
                    const key = sectionMap[section];
                    const id = sectionIdMap[section];
                    if (key) {
                      toggleSection(key);
                      if (!showAdvancedOptions) setShowAdvancedOptions(true);
                      // Scroll to the section after a short delay to allow it to expand
                      setTimeout(() => {
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }, 100);
                    }
                  }}
                  className="rounded-full border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 hover:border-gray-400 hover:bg-gray-50 hover:text-gray-700 hover:shadow-md transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                >
                  {section}
                </button>
              ))}
            </div>
          </div>
          <form className="space-y-6 md:space-y-8">
            {!wizardMode && (
              <div className="mb-6">
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {formTabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        // Auto-expand sections when switching tabs
                        if (tab.id !== "all") {
                          tab.sections.forEach(section => {
                            if (!collapsibleSections[section as keyof typeof collapsibleSections]) {
                              toggleSection(section as keyof typeof collapsibleSections);
                            }
                          });
                        }
                      }}
                      className={`px-4 py-2 rounded-lg text-body font-medium tracking-normal whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'bg-stone-950 text-gray-100 dark:bg-gray-200 dark:text-stone-950'
                          : 'bg-white/80 text-stone-700 hover:bg-gray-50 border border-gray-200'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <ContractWizard
              wizardMode={wizardMode}
              wizardStep={wizardStep}
              setWizardStep={setWizardStep}
              wizardSteps={wizardSteps}
            />
            <fieldset id="section-artist" className="space-y-6">
              <legend className="text-section-header font-medium text-neutral-900 tracking-normal font-display">
                1. Artist Information
              </legend>
              <InputField
                label="Artist Name"
                placeholder="Avery Simone"
                value={form.artistName}
                onChange={handleTextChange("artistName")}
              />
              <InputField
                label="Artist Email"
                type="email"
                placeholder="artist@example.com"
                value={form.artistEmail}
                onChange={handleTextChange("artistEmail")}
              />
              <div>
                <span className="mb-2.5 block text-sm font-medium text-neutral-900 lg:text-base">
                  Artist Logo (Optional)
                </span>
                <div className="flex items-center gap-4">
                  {form.artistLogo && (
                    <div className="h-16 w-16 rounded-lg border border-neutral-300 overflow-hidden bg-neutral-50 flex items-center justify-center">
                      <img src={form.artistLogo} alt="Artist Logo" className="h-full w-full object-contain" />
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          updateField("artistLogo", event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="block w-full text-sm text-neutral-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-800 hover:file:bg-gray-100"
                  />
                </div>
              </div>
            </fieldset>

            <fieldset id="section-event" className="space-y-6">
              <legend className="text-section-header font-medium text-neutral-900 tracking-normal font-display">
                2. Event Details
              </legend>
              <div className="grid gap-5 sm:grid-cols-2 lg:gap-4">
                <SelectField
                  label="Booking Preset"
                  value={form.bookingPreset}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    applyBookingPreset(event.target.value)
                  }
                  options={bookingPresets.map((preset) => preset.label)}
                  placeholder="Choose a preset"
                />
                <SelectField
                  label="Contract Status"
                  value={form.contractStatus}
                  onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                    updateField("contractStatus", event.target.value)
                  }
                  options={contractStatuses}
                />
              </div>
            </fieldset>

            <fieldset className="space-y-6">
              <legend className="text-section-header font-medium text-neutral-900 tracking-normal font-display">
                3. Client Information
              </legend>
              <InputField
                label="Client / Organization Name"
                placeholder="Blue Note Events"
                value={form.clientName}
                onChange={handleTextChange("clientName")}
              />
              <InputField
                label="Representative Name"
                placeholder="Jordan Lee"
                value={form.representativeName}
                onChange={handleTextChange("representativeName")}
              />
              <InputField
                label="Email"
                type="email"
                placeholder="booking@example.com"
                value={form.email}
                onChange={handleTextChange("email")}
              />
              <InputField
                label="Phone Number"
                type="tel"
                placeholder="+1 555 123 4567"
                value={form.phoneNumber}
                onChange={handleTextChange("phoneNumber")}
              />
            </fieldset>

            <button
              type="button"
              onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/70 px-4 py-3 text-body font-medium text-stone-700 tracking-normal hover:border-gray-400 hover:bg-gray-50 transition-all shadow-sm shadow-gray-950/5"
            >
              <span className="text-neutral-400 transition-transform">
                {showAdvancedOptions ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </span>
              {showAdvancedOptions ? "Hide Advanced Options" : "Show Advanced Options"}
            </button>

            {showAdvancedOptions && (
              <div className="space-y-8 sm:space-y-10 lg:space-y-8 xl:space-y-10">

            <CollapsibleSection
              id="section-event-info"
              title="4. Event Information"
              {...collapsibleSectionProps("eventInfo", "event")}
            >
                <>
                  <InputField
                    label="Event / Project Name"
                    placeholder="Summer Jazz Gala"
                    value={form.eventName}
                    onChange={handleTextChange("eventName")}
                  />
                  <InputField
                    label="Event Date(s)"
                    placeholder="August 22, 2026"
                    value={form.eventDates}
                    onChange={handleTextChange("eventDates")}
                  />
                  <InputField
                    label="Venue / Location"
                    placeholder="Massey Hall, Toronto"
                    value={form.venueLocation}
                    onChange={handleTextChange("venueLocation")}
                  />
                  <InputField
                    label="Performance Duration"
                    placeholder="e.g., 2 sets of 45 minutes, 7pm-10pm"
                    value={form.performanceDuration}
                    onChange={handleTextChange("performanceDuration")}
                  />
                </>
            </CollapsibleSection>

            <CollapsibleSection
              id="section-services"
              title="5. Services"
              {...collapsibleSectionProps("services", "services")}
            >
                <div className="grid gap-3 sm:grid-cols-2">
                  {serviceOptions.map((service) => (
                    <label
                      key={service}
                      className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/40 px-4 py-3.5 text-body font-medium text-stone-700 min-h-[48px] cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-all tracking-normal"
                    >
                      <input
                        type="checkbox"
                        checked={form.services.includes(service)}
                        onChange={() => toggleService(service)}
                        className="h-5 w-5 rounded border-gray-300 text-gray-600 focus:ring-amber-500"
                      />
                      {service}
                    </label>
                  ))}
                </div>
            </CollapsibleSection>

            <CollapsibleSection
              id="section-payment"
              title="6. Payment"
              {...collapsibleSectionProps("payment", "payment")}
            >
                <>
                  <InputField
                    label="Total Fee (CAD)"
                    type="number"
                    placeholder="1500"
                    value={form.totalFee}
                    onChange={handleTextChange("totalFee")}
                  />
                  <InputField
                    label="Deposit Percentage (%)"
                    type="number"
                    placeholder="50"
                    value={form.depositPercentage}
                    onChange={handleTextChange("depositPercentage")}
                  />
                  <SelectField
                    label="Payment Method"
                    value={form.paymentMethod}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) => updateField("paymentMethod", e.target.value)}
                    options={["E-transfer", "Bank Transfer", "Cheque", "Cash", "Other"]}
                    placeholder="Select payment method"
                  />
                  <InputField
                    label="Date of Agreement"
                    type="date"
                    value={form.dateOfAgreement}
                    onChange={handleTextChange("dateOfAgreement")}
                  />
                </>
            </CollapsibleSection>

            <CollapsibleSection
              id="section-options"
              title="7. Options"
              {...collapsibleSectionProps("options", "options")}
            >
                <>
                  <GroupedSection title="Travel & Media" subtitle="Configure travel and recording options">
                    <FieldRow label="Travel Required">
                      <ToggleSwitch
                        checked={form.travelRequired}
                        onChange={(checked) => updateField("travelRequired", checked)}
                      />
                    </FieldRow>
                    <FieldRow label="Media Rights Allowed" divider={false}>
                      <ToggleSwitch
                        checked={form.mediaRightsAllowed}
                        onChange={(checked) => updateField("mediaRightsAllowed", checked)}
                      />
                    </FieldRow>
                  </GroupedSection>
                  <GroupedSection title="Legal Protections" subtitle="Additional contract clauses">
                    <FieldRow label="Force Majeure Clause" divider={false}>
                      <ToggleSwitch
                        checked={form.forceMajeureIncluded}
                        onChange={(checked) => updateField("forceMajeureIncluded", checked)}
                      />
                    </FieldRow>
                  </GroupedSection>
                </>
            </CollapsibleSection>

            <CollapsibleSection
              id="section-performance"
              title="8. Performance Requirements"
              {...collapsibleSectionProps("performanceRequirements", "requirements")}
            >
                <>
                  <GroupedSection title="Pre-Performance" subtitle="Rehearsal and sound check requirements">
                    <FieldRow label="Rehearsal Required">
                      <ToggleSwitch
                        checked={form.rehearsalRequired}
                        onChange={(checked) => updateField("rehearsalRequired", checked)}
                      />
                    </FieldRow>
                    <FieldRow label="Sound Check Required" divider={false}>
                      <ToggleSwitch
                        checked={form.soundCheckRequired}
                        onChange={(checked) => updateField("soundCheckRequired", checked)}
                      />
                    </FieldRow>
                  </GroupedSection>
                  {form.rehearsalRequired && (
                    <div className="mb-4">
                      <TextareaField
                        label="Rehearsal Details"
                        value={form.rehearsalDetails}
                        onChange={handleTextareaChange("rehearsalDetails")}
                        onReset={() => resetClause("rehearsalDetails", defaultRehearsalDetails)}
                      />
                    </div>
                  )}
                  {form.soundCheckRequired && (
                    <div className="mb-4">
                      <TextareaField
                        label="Sound Check Details"
                        value={form.soundCheckDetails}
                        onChange={handleTextareaChange("soundCheckDetails")}
                        onReset={() => resetClause("soundCheckDetails", defaultSoundCheckDetails)}
                      />
                    </div>
                  )}
                  <GroupedSection title="Hospitality" subtitle="Food and accommodation needs">
                    <FieldRow label="Hospitality Required" divider={false}>
                      <ToggleSwitch
                        checked={form.hospitalityRequired}
                        onChange={(checked) => updateField("hospitalityRequired", checked)}
                      />
                    </FieldRow>
                  </GroupedSection>
                  {form.hospitalityRequired && (
                    <div className="mb-4">
                      <TextareaField
                        label="Hospitality Details"
                        value={form.hospitalityDetails}
                        onChange={handleTextareaChange("hospitalityDetails")}
                        onReset={() => resetClause("hospitalityDetails", defaultHospitalityDetails)}
                      />
                    </div>
                  )}
                </>
            </CollapsibleSection>

            <CollapsibleSection
              id="section-financial"
              title="9. Financial & Legal"
              {...collapsibleSectionProps("financialLegal", "legal")}
            >
                <>
                  {financialLegalTextareaFields.slice(0, 2).map(renderResettableTextarea)}
                  <GroupedSection title="Insurance" subtitle="Insurance requirements and coverage details">
                    <FieldRow label="Insurance Required" divider={false}>
                      <ToggleSwitch
                        checked={form.insuranceRequired}
                        onChange={(checked) => updateField("insuranceRequired", checked)}
                      />
                    </FieldRow>
                  </GroupedSection>
                  {form.insuranceRequired && (
                    <div className="mb-4">
                      <TextareaField
                        label="Insurance Details"
                        value={form.insuranceDetails}
                        onChange={handleTextareaChange("insuranceDetails")}
                        onReset={() => resetClause("insuranceDetails", defaultInsuranceDetails)}
                      />
                    </div>
                  )}
                  {financialLegalTextareaFields.slice(2).map(renderResettableTextarea)}
                </>
            </CollapsibleSection>

            <CollapsibleSection
              id="section-technical"
              title="10. Technical Rider"
              {...collapsibleSectionProps("technicalRider", "requirements")}
            >
                <>
                  <GroupedSection title="Technical Requirements" subtitle="Equipment and technical specifications">
                    <FieldRow label="Technical Rider Required" divider={false}>
                      <ToggleSwitch
                        checked={form.technicalRiderRequired}
                        onChange={(checked) => updateField("technicalRiderRequired", checked)}
                      />
                    </FieldRow>
                  </GroupedSection>
                  {form.technicalRiderRequired && (
                    <div className="mb-4">
                      <TextareaField
                        label="Technical Rider Details"
                        value={form.technicalRiderDetails}
                        onChange={handleTextareaChange("technicalRiderDetails")}
                        onReset={() => resetClause("technicalRiderDetails", defaultTechnicalRider)}
                      />
                    </div>
                  )}
                </>
            </CollapsibleSection>

            <CollapsibleSection
              title="11. Accommodation"
              {...collapsibleSectionProps("accommodation", "logistics")}
            >
                <>
                  <GroupedSection title="Lodging" subtitle="Accommodation requirements for overnight stays">
                    <FieldRow label="Accommodation Required" divider={false}>
                      <ToggleSwitch
                        checked={form.accommodationRequired}
                        onChange={(checked) => updateField("accommodationRequired", checked)}
                      />
                    </FieldRow>
                  </GroupedSection>
                  {form.accommodationRequired && (
                    <div className="mb-4">
                      <TextareaField
                        label="Accommodation Details"
                        value={form.accommodationDetails}
                        onChange={handleTextareaChange("accommodationDetails")}
                        onReset={() => resetClause("accommodationDetails", defaultAccommodationDetails)}
                      />
                    </div>
                  )}
                </>
            </CollapsibleSection>

            <CollapsibleSection
              title="12. Per Diem & Expenses"
              {...collapsibleSectionProps("perDiem", "logistics")}
            >
                <>
                  <GroupedSection title="Daily Expenses" subtitle="Meal and incidental expense allowances">
                    <FieldRow label="Per Diem Required" divider={false}>
                      <ToggleSwitch
                        checked={form.perDiemRequired}
                        onChange={(checked) => updateField("perDiemRequired", checked)}
                      />
                    </FieldRow>
                  </GroupedSection>
                  {form.perDiemRequired && (
                    <div className="mb-4">
                      <TextareaField
                        label="Per Diem Details"
                        value={form.perDiemDetails}
                        onChange={handleTextareaChange("perDiemDetails")}
                        onReset={() => resetClause("perDiemDetails", defaultPerDiemDetails)}
                      />
                    </div>
                  )}
                </>
            </CollapsibleSection>

            <CollapsibleSection
              title="13. Credit & Publicity"
              {...collapsibleSectionProps("publicity", "logistics")}
            >
                <>
                  <GroupedSection title="Promotional Credit" subtitle="Credit and publicity requirements">
                    <FieldRow label="Publicity Terms Required" divider={false}>
                      <ToggleSwitch
                        checked={form.publicityTermsRequired}
                        onChange={(checked) => updateField("publicityTermsRequired", checked)}
                      />
                    </FieldRow>
                  </GroupedSection>
                  {form.publicityTermsRequired && (
                    <div className="mb-4">
                      <TextareaField
                        label="Publicity Terms"
                        value={form.publicityTerms}
                        onChange={handleTextareaChange("publicityTerms")}
                        onReset={() => resetClause("publicityTerms", defaultPublicityTerms)}
                      />
                    </div>
                  )}
                </>
            </CollapsibleSection>

            <CollapsibleSection
              title="14. Rights & Usage"
              {...collapsibleSectionProps("rightsUsage", "options")}
            >
                <>
                  <GroupedSection title="Image & Merchandise" subtitle="Usage rights for promotional materials">
                    <FieldRow label="Image Usage Allowed">
                      <ToggleSwitch
                        checked={form.imageUsageAllowed}
                        onChange={(checked) => updateField("imageUsageAllowed", checked)}
                      />
                    </FieldRow>
                    <FieldRow label="Merchandise Sales Allowed" divider={false}>
                      <ToggleSwitch
                        checked={form.merchandiseSalesAllowed}
                        onChange={(checked) => updateField("merchandiseSalesAllowed", checked)}
                      />
                    </FieldRow>
                  </GroupedSection>
                  {form.imageUsageAllowed && (
                    <div className="mb-4">
                      <TextareaField
                        label="Image Usage Terms"
                        value={form.imageUsageTerms}
                        onChange={handleTextareaChange("imageUsageTerms")}
                        onReset={() => resetClause("imageUsageTerms", defaultImageUsageTerms)}
                      />
                    </div>
                  )}
                  {form.merchandiseSalesAllowed && (
                    <div className="mb-4">
                      <TextareaField
                        label="Merchandise Terms"
                        value={form.merchandiseTerms}
                        onChange={handleTextareaChange("merchandiseTerms")}
                        onReset={() => resetClause("merchandiseTerms", defaultMerchandiseTerms)}
                      />
                    </div>
                  )}
                </>
            </CollapsibleSection>

            <CollapsibleSection
              title="15. Operational Details"
              {...collapsibleSectionProps("operational", "options")}
            >
                <>
                  <GroupedSection title="Guest List" subtitle="Complimentary tickets allocation">
                    <FieldRow label="Guest List Count" divider={false}>
                      <input
                        type="number"
                        placeholder="2"
                        value={form.guestListCount}
                        onChange={(e) => handleTextChange("guestListCount")(e)}
                        className="w-20 px-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                      />
                    </FieldRow>
                  </GroupedSection>
                  <GroupedSection title="Venue Services" subtitle="Security and parking arrangements">
                    <FieldRow label="Security Required">
                      <ToggleSwitch
                        checked={form.securityRequired}
                        onChange={(checked) => updateField("securityRequired", checked)}
                      />
                    </FieldRow>
                    <FieldRow label="Parking Provided" divider={false}>
                      <ToggleSwitch
                        checked={form.parkingProvided}
                        onChange={(checked) => updateField("parkingProvided", checked)}
                      />
                    </FieldRow>
                  </GroupedSection>
                  {form.securityRequired && (
                    <div className="mb-4">
                      <TextareaField
                        label="Security Details"
                        value={form.securityDetails}
                        onChange={handleTextareaChange("securityDetails")}
                        onReset={() => resetClause("securityDetails", defaultSecurityDetails)}
                      />
                    </div>
                  )}
                  {form.parkingProvided && (
                    <div className="mb-4">
                      <TextareaField
                        label="Parking Details"
                        value={form.parkingDetails}
                        onChange={handleTextareaChange("parkingDetails")}
                        onReset={() => resetClause("parkingDetails", defaultParkingDetails)}
                      />
                    </div>
                  )}
                </>
            </CollapsibleSection>

            <CollapsibleSection
              title="16. Contract Language"
              subtitle="Customize legal terms and clauses"
              variant="compact"
              contentClassName="mt-5 space-y-4"
              {...collapsibleSectionProps("contractLanguage", "legal")}
            >
                  {contractLanguageTextareaFields.map(renderResettableTextarea)}
            </CollapsibleSection>
            <fieldset className="space-y-6 rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm shadow-gray-950/5">
              <legend className="px-2 text-section-header font-medium text-neutral-900 tracking-normal font-display">
                Delivery
              </legend>
              <button
                type="button"
                onClick={sendEmail}
                className="rounded-full bg-stone-950 px-5 py-3.5 text-sm font-medium text-gray-100 dark:bg-gray-200 dark:text-stone-950 transition-all duration-200 ease-out hover:bg-stone-900 dark:hover:bg-gray-100 hover:shadow-md hover:shadow-stone-950/10 hover:scale-105 active:scale-95 min-h-[44px]"
              >
                Send Email
              </button>
              <InputField
                label="Email Subject"
                value={form.deliverySubject}
                onChange={handleTextChange("deliverySubject")}
                placeholder="Vocal Performance Agreement - Event Name"
              />
              <TextareaField
                label="Email Body"
                value={form.deliveryMessage}
                onChange={handleTextareaChange("deliveryMessage")}
              />
            </fieldset>
            <fieldset className="space-y-6 rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm shadow-gray-950/5">
              <legend className="px-2 text-section-header font-medium text-neutral-900 tracking-normal font-display">
                Invoice
              </legend>
              <button
                type="button"
                onClick={() => {
                  const invoiceNumber = "INV-" + (form.eventName || "DRAFT").slice(0, 6).toUpperCase() + "-" + Date.now().toString().slice(-4);
                  updateField("invoiceNumber", invoiceNumber);
                  updateField("invoiceDate", new Date().toISOString().split('T')[0]);
                  showToast("Invoice generated successfully", "success");
                }}
                className="rounded-full bg-neutral-950 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-neutral-800 hover:scale-105 min-h-[44px]"
              >
                Generate Invoice
              </button>
              <InputField
                label="Invoice Number"
                value={form.invoiceNumber}
                onChange={handleTextChange("invoiceNumber")}
                placeholder="INV-001"
              />
              <InputField
                label="Invoice Date"
                type="date"
                value={form.invoiceDate}
                onChange={handleTextChange("invoiceDate")}
              />
              <InputField
                label="Due Date"
                type="date"
                value={form.invoiceDueDate}
                onChange={handleTextChange("invoiceDueDate")}
              />
              <SelectField
                label="Invoice Status"
                value={form.invoiceStatus}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => updateField("invoiceStatus", e.target.value as "Pending" | "Paid" | "Overdue")}
                options={["Pending", "Paid", "Overdue"]}
                placeholder="Select status"
              />
              <TextareaField
                label="Invoice Notes"
                value={form.invoiceNotes}
                onChange={handleTextareaChange("invoiceNotes")}
              />
              <button
                type="button"
                onClick={async () => {
                  if (!invoiceRef.current) return;
                  try {
                    const html2pdf = require("html2pdf.js");
                    const pdfWorker = html2pdf()
                      .set({
                        margin: [15, 15, 15, 15],
                        filename: `${form.invoiceNumber || "invoice"}.pdf`,
                        image: { type: "jpeg", quality: 0.98 },
                        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
                        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
                      })
                      .from(invoiceRef.current)
                      .toPdf();

                    await pdfWorker.get("pdf").then((pdf: any) => {
                      addPdfPageNumbers(pdf);
                    });

                    await pdfWorker.save();
                    showToast("Invoice PDF downloaded", "success");
                  } catch (error: any) {
                    showToast(`Invoice PDF generation failed: ${error?.message || "Unknown error"}`, "error");
                  }
                }}
                className="rounded-full border border-neutral-300 px-5 py-3.5 text-sm font-medium text-neutral-950 transition hover:border-neutral-950 hover:bg-neutral-50 hover:scale-105 min-h-[44px]"
              >
                Download Invoice PDF
              </button>
            </fieldset>
            <fieldset className="space-y-6 rounded-2xl border border-gray-200/80 bg-white/80 p-5 shadow-sm shadow-gray-950/5">
              <legend className="px-2 text-section-header font-medium text-neutral-900 tracking-normal font-display">
                17. Signatures
              </legend>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField
                  label="Artist Signer Name"
                  value={form.artistSignerName}
                  onChange={handleTextChange("artistSignerName")}
                  placeholder="Artist legal name"
                />
                <InputField
                  label="Client Signer Name"
                  value={form.clientSignerName}
                  onChange={handleTextChange("clientSignerName")}
                  placeholder="Client signer name"
                />
                <InputField
                  label="Artist Signer Title"
                  value={form.artistSignerTitle}
                  onChange={handleTextChange("artistSignerTitle")}
                  placeholder="e.g., CEO, Manager, Director"
                />
                <InputField
                  label="Client Signer Title"
                  value={form.clientSignerTitle}
                  onChange={handleTextChange("clientSignerTitle")}
                  placeholder="e.g., CEO, Manager, Director"
                />
                <InputField
                  label="Artist Typed Signature"
                  value={form.artistSignature}
                  onChange={handleTextChange("artistSignature")}
                  placeholder="Typed artist signature"
                />
                <InputField
                  label="Client Typed Signature"
                  value={form.clientSignature}
                  onChange={handleTextChange("clientSignature")}
                  placeholder="Typed client signature"
                />
              </div>
              <InputField
                label="Signed Date"
                value={form.signedDate}
                onChange={handleTextChange("signedDate")}
                placeholder="September 1, 2026"
              />
            </fieldset>
              </div>
            )}
            {wizardMode && (
              <div className="flex items-center justify-between pt-6 border-t border-neutral-300 mt-8">
                <button
                  type="button"
                  onClick={() => setWizardStep(Math.max(1, wizardStep - 1))}
                  disabled={wizardStep === 1}
                  className="px-6 py-3 rounded-lg border border-neutral-300 bg-white text-body font-medium text-neutral-700 tracking-normal hover:bg-neutral-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setWizardStep(Math.min(wizardSteps.length, wizardStep + 1))}
                  disabled={wizardStep === wizardSteps.length}
                  className="px-6 py-3 rounded-lg bg-stone-950 text-body font-medium text-gray-100 tracking-normal dark:bg-gray-200 dark:text-stone-950 hover:bg-stone-900 dark:hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {wizardStep === wizardSteps.length ? "Complete" : "Next"}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
              </div>
            )}
          </form>
        </section>

        <section
          className={`print-contract-container rounded-2xl border border-gray-300/60 bg-white/60 backdrop-blur-2xl p-6 shadow-2xl shadow-gray-900/10 dark:border-gray-600/40 dark:bg-stone-900/60 dark:shadow-black/50 sm:p-8 lg:flex-1 lg:overflow-y-auto lg:p-8 xl:p-10 transition-all duration-300 relative ${
            activePanel === "form" ? "hidden lg:block" : ""
          }`}
          ref={previewRef}
        >
          {/* Enhanced glassmorphism shine effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/70 via-transparent to-white/30 dark:from-white/20 dark:via-transparent dark:to-white/10 pointer-events-none" />
          <div className="relative z-10">
          <div className="mx-auto max-w-[950px] px-1 sm:px-0">
            <div className="print:hidden mb-4">
              <p className="text-xs font-medium uppercase tracking-widest text-gray-800 sm:text-sm mb-3">
                Live Contract Preview
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.max(50, zoomLevel - 10))}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                  disabled={zoomLevel <= 50}
                >
                  −
                </button>
                <span className="text-xs font-medium text-neutral-700 min-w-[50px] text-center">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel(Math.min(150, zoomLevel + 10))}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                  disabled={zoomLevel >= 150}
                >
                  +
                </button>
                <button
                  type="button"
                  onClick={() => setZoomLevel(100)}
                  className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 hover:border-neutral-900 hover:text-neutral-900 transition-all focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPdf}
                  className="rounded-lg bg-stone-950 px-4 py-1.5 text-xs font-medium text-gray-100 dark:bg-gray-200 dark:text-stone-950 transition-all hover:bg-stone-900 dark:hover:bg-gray-100 flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
            <div style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center', transition: 'transform 0.2s ease' }}>
              <div className="bg-white shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
                <ContractPreview form={form} previewRef={previewRef} draftId={draftId} />
              </div>
            </div>
          </div>
          {form.invoiceNumber && (
            <div className="print:hidden mx-auto max-w-[950px] px-1 sm:px-0 mt-8">
              <p className="mb-4 text-xs font-medium uppercase tracking-widest text-neutral-500 sm:text-sm">
                Delivery Package
              </p>
              <div className="bg-white shadow-lg" style={{ fontFamily: 'Georgia, serif' }}>
                <InvoicePreview form={form} invoiceRef={invoiceRef} />
              </div>
            </div>
          )}
        </div>
        </section>
      </div>
      <ContractModals
        showDeleteModal={showDeleteModal}
        showWorkspaceModal={showWorkspaceModal}
        showMailClientModal={showMailClientModal}
        showQuickStart={showQuickStart}
        showSaveVersionModal={showSaveVersionModal}
        showRestoreConfirmation={showRestoreConfirmation}
        showVersionHistory={showVersionHistory}
        workspaceArtistName={workspaceArtistName}
        workspaceArtistEmail={workspaceArtistEmail}
        versionNote={versionNote}
        quickStartArtistName={quickStartArtistName}
        quickStartClientName={quickStartClientName}
        quickStartFee={quickStartFee}
        quickStartDate={quickStartDate}
        quickStartBookingType={quickStartBookingType}
        versionToRestore={versionToRestore}
        contractVersions={contractVersions}
        activeVersionNumber={activeVersionNumber}
        draftId={draftId}
        supabase={supabase}
        bookingPresets={bookingPresets}
        setShowDeleteModal={setShowDeleteModal}
        setShowWorkspaceModal={setShowWorkspaceModal}
        setShowMailClientModal={setShowMailClientModal}
        setShowQuickStart={setShowQuickStart}
        setShowSaveVersionModal={setShowSaveVersionModal}
        setShowRestoreConfirmation={setShowRestoreConfirmation}
        setShowVersionHistory={setShowVersionHistory}
        setWorkspaceArtistName={setWorkspaceArtistName}
        setWorkspaceArtistEmail={setWorkspaceArtistEmail}
        setVersionNote={setVersionNote}
        setQuickStartArtistName={setQuickStartArtistName}
        setQuickStartClientName={setQuickStartClientName}
        setQuickStartFee={setQuickStartFee}
        setQuickStartDate={setQuickStartDate}
        setQuickStartBookingType={setQuickStartBookingType}
        setVersionToRestore={setVersionToRestore}
        confirmDeleteContract={confirmDeleteContract}
        createWorkspace={createWorkspace}
        openGmailDraft={openGmailDraft}
        openDefaultMailClient={openDefaultMailClient}
        handleQuickStart={handleQuickStart}
        saveContractVersion={saveContractVersion}
        loadContractVersions={loadContractVersions}
        restoreContractVersion={restoreContractVersion}
        confirmRestoreVersion={confirmRestoreVersion}
        form={form}
        showToast={showToast}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] animate-in slide-in-from-bottom-5 fade-in duration-300" role={toast.type === "error" ? "alert" : "status"} aria-live={toast.type === "error" ? "assertive" : "polite"}>
          <div className={`rounded-xl border px-5 py-4 shadow-lg flex items-center gap-3 min-w-[320px] max-w-md ${
            toast.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-900" 
              : toast.type === "error"
              ? "bg-red-50 border-red-200 text-red-900"
              : "bg-gray-50 border-gray-200 text-gray-900"
          }`}>
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
              toast.type === "success"
                ? "bg-emerald-500"
                : toast.type === "error"
                ? "bg-red-500"
                : "bg-gray-500"
            }`}>
              {toast.type === "success" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : toast.type === "error" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              )}
            </div>
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 transition-colors"
              aria-label="Dismiss notification"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
    </>
  );
}

// Wrap the main component with Error Boundary
export default function ContractPageWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <ContractPage />
    </ErrorBoundary>
  );
}

