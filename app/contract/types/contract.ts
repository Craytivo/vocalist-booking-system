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
  depositTerms: "A 50% deposit is required to confirm the booking. The remaining balance is due 7 days prior to the event date.",
  latePaymentPenalty: "Late payments will incur a 1.5% monthly fee on the outstanding balance.",
  cancellationFee: "Cancellations made 30+ days before the event receive a full refund. Cancellations 14-29 days before receive 50% refund. Cancellations within 14 days receive no refund.",
  insuranceDetails: "The Client maintains appropriate liability insurance for the event venue and activities.",
  travelTerms: "The Client will provide reimbursement for reasonable travel expenses including transportation, lodging, and meals as outlined in the engagement agreement.",
  accommodationDetails: "The Client will provide suitable accommodation for the Artist and their entourage for the duration of the engagement.",
  perDiemDetails: "The Client will provide a daily per diem allowance for meals and incidental expenses as outlined in the engagement agreement.",
  technicalRiderDetails: "Technical specifications and equipment requirements are outlined in the attached technical rider document.",
  rehearsalDetails: "One rehearsal session will be scheduled prior to the event date as mutually agreed by both parties.",
  soundCheckDetails: "Sound check will be scheduled 2 hours prior to performance start time.",
  hospitalityDetails: "The Client will provide appropriate hospitality including green room access, refreshments, and secure storage for personal items.",
  imageUsageTerms: "The Client may use images of the Artist for promotional purposes related to the specific event only, with Artist approval.",
  merchandiseTerms: "The Artist may sell merchandise at the venue subject to venue regulations and Client approval.",
  mediaRightsTerms: "Media rights for recording and broadcast are exclusively held by the Artist unless otherwise agreed in writing.",
  publicityTerms: "The Client will provide appropriate credit to the Artist in all promotional materials and announcements related to the engagement.",
  cancellationTerms: "Either party may cancel this agreement with written notice. Cancellation fees apply as outlined in the Financial Terms section.",
  independentContractorClause: "The Artist is an independent contractor and not an employee of the Client. The Artist is responsible for their own taxes, insurance, and benefits.",
  forceMajeureTerms: "Neither party shall be liable for failure to perform due to circumstances beyond their reasonable control, including acts of God, war, labor disputes, or government restrictions.",
  governingLaw: "This agreement shall be governed by and construed in accordance with the laws of the jurisdiction where the event takes place.",
  disputeResolution: "Any disputes arising from this agreement shall be resolved through good faith negotiation, followed by mediation if necessary.",
  securityDetails: "The Client will provide adequate security personnel to ensure the safety of the Artist, their equipment, and attendees.",
  parkingDetails: "The Client will provide designated parking for the Artist and their entourage near the performance venue.",
  severabilityClause: "If any provision of this agreement is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.",
  entireAgreementClause: "This agreement constitutes the entire understanding between the parties and supersedes all prior discussions, agreements, or understandings, whether written or oral.",
  electronicSignatureClause: "The parties agree that electronic signatures, digital signatures, and electronic records shall have the same legal effect as handwritten signatures and paper records.",
  amendmentClause: "Any modifications to this agreement must be made in writing and signed by both parties to be effective.",
  waiverClause: "No waiver of any provision of this agreement shall be deemed a waiver of any other provision or of the same provision on any other occasion.",
  governingJurisdiction: "Any legal proceedings arising from this agreement shall be brought exclusively in the courts of the jurisdiction where the event takes place.",
} as const;
