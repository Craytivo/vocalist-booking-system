// Contract Form Types for Production-Ready Contract System

export type ContractStatus = "Draft" | "Negotiating" | "Confirmed" | "Completed" | "Cancelled" | "Ready" | "Sent" | "Signed";

export interface ContractForm {
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
  contractStatus: ContractStatus;
  totalFee: string;
  depositPercentage: string;
  paymentMethod: string;
  depositTerms: string;
  latePaymentPenalty: string;
  cancellationFee: string;
  insuranceRequired: boolean;
  insuranceDetails: string;
  services: string[];
  performanceDuration: string;
  travelRequired: boolean;
  travelTerms: string;
  accommodationRequired: boolean;
  accommodationDetails: string;
  perDiemRequired: boolean;
  perDiemDetails: string;
  technicalRiderRequired: boolean;
  technicalRiderDetails: string;
  technicalRequirements: string;
  rehearsalRequired: boolean;
  rehearsalDetails: string;
  soundCheckRequired: boolean;
  soundCheckDetails: string;
  hospitalityRequired: boolean;
  hospitalityDetails: string;
  imageUsageAllowed: boolean;
  imageUsageTerms: string;
  merchandiseSalesAllowed: boolean;
  merchandiseTerms: string;
  mediaRightsAllowed: boolean;
  mediaRightsTerms: string;
  publicityTermsRequired: boolean;
  publicityTerms: string;
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
  securityRequired: boolean;
  securityDetails: string;
  parkingProvided: boolean;
  parkingDetails: string;
  guestListCount: string;
  artistSignerName: string;
  artistSignerTitle: string;
  artistSignature: string;
  clientSignerName: string;
  clientSignerTitle: string;
  clientSignature: string;
  signedDate: string;
  severabilityClause?: string;
  entireAgreementClause?: string;
  electronicSignatureClause?: string;
  amendmentClause?: string;
  waiverClause?: string;
  governingJurisdiction?: string;
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

export const DEFAULT_LEGAL_TEXT = {
  depositTerms: "A deposit of the stated percentage is payable upon acceptance of this Agreement and is applied toward the total Fee. The remaining balance is due on or before the date specified in the Compensation section. Amounts paid and obligations arising under this Agreement are subject to the cancellation provisions below.",
  latePaymentPenalty: "Any overdue undisputed amount may accrue interest at a rate of 1.5% per month, calculated monthly, or the maximum rate permitted by applicable law, whichever is lower. The Artist may suspend further services where an undisputed payment remains overdue after written notice.",
  cancellationFee: "Cancellation charges are the amounts expressly stated in this Agreement and are intended to compensate the Artist for reserved dates, preparation, rehearsal time, and other committed costs. No cancellation charge will exceed the amount permitted by applicable law.",
  insuranceDetails: "The Client shall maintain commercially reasonable liability insurance appropriate to the venue and event and shall comply with all insurance requirements imposed by the venue or applicable law. Evidence of coverage shall be provided upon reasonable request.",
  travelTerms: "The Client shall reimburse the Artist for reasonable, pre-approved travel expenses required to perform the engagement, including transportation, accommodation, and meals, in accordance with the amounts or limits stated in this Agreement. Travel arrangements requiring the Artist's approval must be confirmed in writing before booking.",
  accommodationDetails: "Where accommodation is required, the Client shall provide or reimburse the Artist for clean, safe, commercially reasonable accommodation for the agreed engagement period. Accommodation arrangements must be confirmed in advance and shall be reasonably suitable for the Artist's professional obligations.",
  perDiemDetails: "Where a per diem is provided, the Client shall pay the agreed daily amount for meals and reasonable incidental expenses for each approved travel day. Any applicable per diem shall be paid in accordance with the payment schedule in this Agreement.",
  technicalRiderDetails: "The technical rider forms part of the performance requirements where identified in this Agreement. The Client shall use commercially reasonable efforts to provide the equipment, personnel, access, power, staging, and technical conditions specified in the rider.",
  rehearsalDetails: "Rehearsals shall occur at the dates, times, locations, and durations agreed by the parties. Additional rehearsal time outside the stated allowance requires the parties' written approval and may be billed at the applicable rate.",
  soundCheckDetails: "The Client shall provide reasonable access to the venue and production system for sound check at the agreed time before the performance. Material delays caused by the Client or venue may affect the scheduled performance time without reducing the Artist's agreed Fee.",
  hospitalityDetails: "Where hospitality is required, the Client shall provide the agreed dressing-room, refreshments, water, meals, and secure storage arrangements in a clean and reasonably safe condition.",
  imageUsageTerms: "The Client may use approved photographs or recordings featuring the Artist solely for the promotional purposes expressly described in this Agreement. Commercial licensing, paid advertising, endorsements, or other uses require the Artist's prior written consent unless expressly included in this Agreement.",
  merchandiseTerms: "The Artist may sell merchandise at the engagement where permitted by the venue. The Client shall not take a commission or other deduction unless that amount is expressly stated in this Agreement and accepted by the Artist in writing.",
  mediaRightsTerms: "No recording, livestream, broadcast, synchronization, commercial exploitation, or other fixation of the Artist's performance is authorized except to the extent expressly permitted by this Agreement. All rights not expressly granted remain with the Artist.",
  publicityTerms: "The Client shall use the Artist's approved name, likeness, biography, and promotional materials accurately and only in connection with the engagement. The Client shall provide any agreed Artist credit in event listings and promotional materials.",
  cancellationTerms: "A cancellation must be communicated in writing. The parties' respective payment and refund obligations on cancellation are governed by the cancellation provisions stated in this Agreement. Any amount retained or payable on cancellation is subject to applicable law.",
  independentContractorClause: "The Artist is engaged as an independent contractor and not as an employee, partner, agent, or joint venturer of the Client. The Artist is responsible for the Artist's own income taxes, registrations, insurance, and other statutory obligations arising from the Artist's business, except where applicable law requires otherwise. Nothing in this Agreement creates an employment relationship.",
  forceMajeureTerms: "Neither party shall be liable for a failure or delay in performing an obligation, other than an obligation to pay money already due, to the extent caused by an event beyond that party's reasonable control, including severe weather, natural disaster, epidemic or pandemic, war, civil disturbance, government order, venue closure, transportation disruption, or serious illness or injury. The affected party shall promptly notify the other party and the parties shall use reasonable efforts to reschedule the engagement. If rescheduling is not reasonably possible, the parties shall settle any refund or payment obligations in accordance with this Agreement and applicable law.",
  governingLaw: "This Agreement shall be governed by and construed in accordance with the laws of the Province of Alberta and the federal laws of Canada applicable therein, without regard to conflict-of-law rules.",
  disputeResolution: "The parties shall first attempt in good faith to resolve any dispute arising from this Agreement through written notice and direct negotiation. If the dispute is not resolved within a reasonable period, either party may pursue any remedy available under applicable Alberta law. Where the parties expressly agree to arbitration, the arbitration shall be conducted in Alberta in accordance with the applicable provisions of the Arbitration Act (Alberta).",
  indemnificationClause: "Each party shall indemnify and hold harmless the other party, and its directors, officers, employees, and agents, from third-party claims, losses, damages, liabilities, and reasonable costs to the extent caused by the indemnifying party's breach of this Agreement, negligence, wilful misconduct, or violation of applicable law. Neither party assumes liability for matters caused by the other party's acts or omissions.",
  confidentialityClause: "Each party shall keep confidential non-public business, financial, personal, and technical information received from the other party in connection with this engagement and shall use such information only for purposes of performing this Agreement. This obligation does not apply to information that is public through no breach, was lawfully known before disclosure, is independently developed, or must be disclosed by law. Where applicable, personal information shall be handled in accordance with Alberta privacy legislation and other applicable privacy laws.",
  equipmentLiabilityClause: "The Client is responsible for loss of or physical damage to the Artist's equipment while the equipment is under the Client's, venue's, or event personnel's control, except to the extent caused by the Artist's negligence or wilful misconduct. The Artist is not responsible for loss or damage to Client or venue property except to the extent caused by the Artist's negligence or wilful misconduct.",
  attorneyFeesClause: "Each party is responsible for its own legal fees and costs unless a court or arbitrator with jurisdiction orders otherwise or the parties expressly agree otherwise in writing. Nothing in this clause limits any statutory or contractual right to recover costs.",
  securityDetails: "The Client shall provide reasonable security appropriate to the venue and event to protect the Artist, attendees, and equipment and shall comply with all venue safety requirements and applicable law.",
  parkingDetails: "Where parking is included, the Client shall provide or reimburse reasonable parking for the Artist and agreed personnel near the performance venue, subject to the terms stated in this Agreement.",
  severabilityClause: "If a provision of this Agreement is determined by a court or arbitrator with jurisdiction to be invalid or unenforceable, that provision shall be severed or limited to the minimum extent necessary, and the remaining provisions shall continue in full force and effect.",
  entireAgreementClause: "This Agreement, including any schedules or riders expressly incorporated into it, constitutes the entire agreement between the parties concerning the engagement and supersedes prior discussions, representations, and understandings concerning the same subject matter.",
  electronicSignatureClause: "The parties consent to electronic execution and delivery of this Agreement. An electronic signature or electronic record intended to authenticate a party's acceptance shall have the same effect as a handwritten signature to the extent permitted by applicable law, including the Electronic Transactions Act (Alberta).",
  amendmentClause: "Any amendment, waiver, or modification of this Agreement must be recorded in writing and accepted by both parties, including by an electronic record where permitted by applicable law.",
  waiverClause: "A failure or delay by either party to enforce a provision of this Agreement does not constitute a waiver of that provision or of the right to enforce it later. Any waiver must be express and applies only to the specific circumstance for which it is given.",
  governingJurisdiction: "Subject to any arbitration agreement contained in this Agreement, the parties attorn to the jurisdiction of the courts of Alberta and agree that proceedings may be brought in the Alberta judicial district having jurisdiction over the matter.",
} as const;
