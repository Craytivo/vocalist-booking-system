// Contract Form Types for Production-Ready SaaS Contract System

export interface ContractForm {
  // Basic Information
  artistName: string;
  artistEmail: string;
  artistLogo: string;
  clientName: string;
  email: string;
  phoneNumber: string;
  representativeName: string;
  eventName: string;
  eventDates: string;
  venueLocation: string;
  dateOfAgreement: string;
  contractStatus: "Draft" | "Ready" | "Sent" | "Signed";

  // Financial Details
  totalFee: string;
  depositPercentage: string;
  paymentMethod: string;
  depositTerms: string;
  latePaymentPenalty: string;
  cancellationFee: string;
  insuranceRequired: boolean;
  insuranceDetails: string;

  // Services
  services: string[];
  performanceDuration: string;

  // Travel & Expenses
  travelRequired: boolean;
  travelTerms: string;
  accommodationRequired: boolean;
  accommodationDetails: string;
  perDiemRequired: boolean;
  perDiemDetails: string;

  // Technical & Performance
  technicalRiderRequired: boolean;
  technicalRiderDetails: string;
  technicalRequirements: string;
  rehearsalRequired: boolean;
  rehearsalDetails: string;
  soundCheckRequired: boolean;
  soundCheckDetails: string;
  hospitalityRequired: boolean;
  hospitalityDetails: string;

  // Rights & Usage
  imageUsageAllowed: boolean;
  imageUsageTerms: string;
  merchandiseSalesAllowed: boolean;
  merchandiseTerms: string;
  mediaRightsAllowed: boolean;
  mediaRightsTerms: string;
  publicityTermsRequired: boolean;
  publicityTerms: string;

  // Legal Terms
  cancellationTerms: string;
  independentContractorClause: string;
  forceMajeureIncluded: boolean;
  forceMajeureTerms: string;
  governingLaw: string;
  disputeResolution: string;
  indemnificationClause: string;
  confidentialityClause: string;
  equipmentLiabilityClause: string;
  attorneyFeesClause: string;

  // Operational
  securityRequired: boolean;
  securityDetails: string;
  parkingProvided: boolean;
  parkingDetails: string;
  guestListCount: string;

  // Signatures
  artistSignerName: string;
  artistSignerTitle: string;
  artistSignature: string;
  clientSignerName: string;
  clientSignerTitle: string;
  clientSignature: string;
  signedDate: string;

  // Standard Legal Protections (new)
  severabilityClause?: string;
  entireAgreementClause?: string;
  electronicSignatureClause?: string;
  amendmentClause?: string;
  waiverClause?: string;
  governingJurisdiction?: string;

  // UI/Operational fields (not part of contract document)
  bookingPreset: string;
  deliverySubject: string;
  deliveryMessage: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceStatus: "Pending" | "Paid" | "Overdue";
  invoiceDueDate: string;
  invoiceNotes: string;
}

export interface ContractSection {
  id: string;
  title: string;
  number: number;
  isVisible: boolean;
  content: React.ReactNode;
}

export interface SignatureMetadata {
  signerName: string;
  signerTitle?: string;
  signature?: string;
  signedDate?: string;
  ipAddress?: string;
  userAgent?: string;
  timestamp?: string;
  type: "artist" | "client";
}

export interface ContractPreviewProps {
  form: ContractForm;
  previewRef: React.RefObject<HTMLDivElement>;
  draftId: string | null;
  showStandardClauses?: boolean;
}

// Default legal text for fallbacks
export const DEFAULT_LEGAL_TEXT = {
  depositTerms: "A non-refundable deposit equal to fifty percent (50%) of the Fee is due within seven (7) calendar days of signing to secure the date. The remaining balance is due no later than five (5) business days prior to the Performance Date.",
  latePaymentPenalty: "Late payments will incur a 1.5% monthly fee on the outstanding balance.",
  cancellationFee: "If the Client cancels more than 60 days prior to the Performance Date the Deposit is retained; cancellations 30–60 days prior incur 50% of the Fee; cancellations within 30 days incur 100% of the Fee.",
  insuranceDetails: "",
  travelTerms: "The Client will provide and pay for reasonable travel expenses including economy round-trip transportation, ground transport to/from the venue and airports, and any agreed travel-related costs.",
  accommodationDetails: "The Client will provide one (1) single-occupancy hotel room (minimum 3-star or equivalent) for required nights for the Artist and any approved personnel.",
  perDiemDetails: "The Client will provide a per diem of CAD $75 per day for meals and incidental expenses for travel and performance days unless otherwise agreed.",
  technicalRiderDetails: "Technical specifications and equipment requirements are outlined in the attached Technical Rider (Schedule A).",
  rehearsalDetails: "A rehearsal time will be scheduled as mutually agreed by the parties prior to the Performance.",
  soundCheckDetails: "Sound check shall be scheduled no later than two (2) hours before the Performance for a minimum of 45 minutes.",
  hospitalityDetails: "The Client will provide reasonable hospitality including a private dressing room, refreshments and secure storage for personal items.",
  imageUsageTerms: "The Client may use images and short promotional clips of the Artist solely to promote the specific Event; any other commercial use requires the Artist's prior written consent.",
  merchandiseTerms: "The Artist retains 100% of merchandise sales unless otherwise agreed in writing. The Client will provide a secure merchandise area.",
  mediaRightsTerms: "No audio or video recording, broadcast or live-streaming is permitted without the Artist's prior written consent and a separate license specifying compensation and permitted uses.",
  publicityTerms: "The Client will credit the Artist in promotional materials and seek Artist approval for any promotional materials prominently featuring the Artist.",
  cancellationTerms: "Cancellation and rescheduling follow the financial schedule set out in the Compensation and Cancellation sections of this agreement.",
  independentContractorClause: "The Artist is an independent contractor and not an employee of the Client. The Artist is responsible for all taxes, contributions and benefits for the Artist and Artist's personnel.",
  forceMajeureTerms: "Neither party shall be liable for delay or failure to perform due to events beyond its reasonable control, including acts of God, epidemics/pandemics, government orders, severe weather, strikes, or terrorism. If a Force Majeure event continues for more than thirty (30) days, either party may terminate.",
  governingLaw: "This agreement shall be governed by the laws of the Province of Alberta and the federal laws of Canada applicable therein.",
  disputeResolution: "Parties shall first attempt good-faith negotiation and mediation. If unresolved within thirty (30) days, disputes shall be resolved by binding arbitration under the Arbitration Act (Alberta) with the seat of arbitration in Calgary, Alberta.",
  indemnificationClause: "Each party agrees to indemnify and hold harmless the other from claims, losses or liabilities arising from its breach, negligence, or willful misconduct.",
  confidentialityClause: "Both parties agree to keep confidential non-public information such as financial terms and private business details; this obligation survives termination for two (2) years.",
  equipmentLiabilityClause: "The Client is responsible for loss or damage to the Artist's equipment caused by the Client, its staff, or attendees, except where caused by the Artist's gross negligence or willful misconduct.",
  attorneyFeesClause: "In any legal proceeding arising out of this agreement, the prevailing party shall be entitled to recover reasonable attorneys' fees and costs from the non-prevailing party.",
  securityDetails: "The Client will provide adequate security personnel as required for the Event to ensure the safety of the Artist and attendees.",
  parkingDetails: "The Client will provide designated parking or passes for the Artist and their entourage near the venue.",
  severabilityClause: "If any provision of this agreement is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.",
  entireAgreementClause: "This agreement constitutes the entire understanding between the parties and supersedes all prior discussions or agreements.",
  electronicSignatureClause: "This Agreement may be executed by electronic signature; electronic signatures have the same force and effect as original signatures.",
  amendmentClause: "Any modification to this Agreement must be in writing and signed by both parties to be effective.",
  waiverClause: "No waiver of any provision shall be deemed a waiver of any other provision or of the same provision on any other occasion.",
  governingJurisdiction: "Any legal proceedings arising from this agreement shall be brought exclusively in the courts of the Province of Alberta.",
} as const;
