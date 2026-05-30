import { ContractForm } from "../types/contract";

export interface SectionDefinition {
  id: string;
  title: string;
  isVisible: (form: ContractForm) => boolean;
  baseNumber: number;
}

// Define all possible contract sections with their visibility conditions
export const CONTRACT_SECTIONS: SectionDefinition[] = [
  {
    id: "engagement",
    title: "Engagement Details",
    isVisible: () => true,
    baseNumber: 1,
  },
  {
    id: "scope",
    title: "Scope of Services",
    isVisible: () => true,
    baseNumber: 2,
  },
  {
    id: "compensation",
    title: "Compensation",
    isVisible: () => true,
    baseNumber: 3,
  },
  {
    id: "travel",
    title: "Travel & Expenses",
    isVisible: (form) => form.travelRequired,
    baseNumber: 4,
  },
  {
    id: "cancellation",
    title: "Cancellation Terms",
    isVisible: () => true,
    baseNumber: 5,
  },
  {
    id: "technical",
    title: "Technical Requirements",
    isVisible: () => true,
    baseNumber: 6,
  },
  {
    id: "technicalRider",
    title: "Technical Rider",
    isVisible: (form) => form.technicalRiderRequired,
    baseNumber: 7,
  },
  {
    id: "mediaRights",
    title: "Media Rights",
    isVisible: (form) => form.mediaRightsAllowed,
    baseNumber: 8,
  },
  {
    id: "forceMajeure",
    title: "Force Majeure",
    isVisible: (form) => form.forceMajeureIncluded,
    baseNumber: 9,
  },
  {
    id: "independentContractor",
    title: "Independent Contractor Status",
    isVisible: () => true,
    baseNumber: 10,
  },
  {
    id: "performanceRequirements",
    title: "Performance Requirements",
    isVisible: (form) => 
      form.rehearsalRequired || 
      form.soundCheckRequired || 
      form.hospitalityRequired,
    baseNumber: 11,
  },
  {
    id: "financialLegal",
    title: "Financial & Legal Terms",
    isVisible: () => true,
    baseNumber: 12,
  },
  {
    id: "rightsUsage",
    title: "Rights & Usage",
    isVisible: (form) => 
      form.imageUsageAllowed || 
      form.merchandiseSalesAllowed,
    baseNumber: 13,
  },
  {
    id: "accommodation",
    title: "Accommodation",
    isVisible: (form) => form.accommodationRequired,
    baseNumber: 14,
  },
  {
    id: "perDiem",
    title: "Per Diem & Expenses",
    isVisible: (form) => form.perDiemRequired,
    baseNumber: 15,
  },
  {
    id: "publicity",
    title: "Credit & Publicity",
    isVisible: (form) => form.publicityTermsRequired,
    baseNumber: 16,
  },
  {
    id: "operational",
    title: "Operational Details",
    isVisible: (form) => 
      form.securityRequired || 
      form.parkingProvided,
    baseNumber: 17,
  },
  {
    id: "standardLegalProtections",
    title: "Standard Legal Protections",
    isVisible: (form) => 
      form.severabilityClause !== undefined ||
      form.entireAgreementClause !== undefined ||
      form.electronicSignatureClause !== undefined,
    baseNumber: 18,
  },
  {
    id: "signatures",
    title: "Signatures",
    isVisible: () => true,
    baseNumber: 19,
  },
];

/**
 * Calculate the actual section number for a given section ID
 * based on which sections are visible in the form
 */
export function getSectionNumber(sectionId: string, form: ContractForm): number {
  const targetSection = CONTRACT_SECTIONS.find(s => s.id === sectionId);
  if (!targetSection) return 1;

  // Count how many visible sections come before this one
  let visibleCount = 0;
  for (const section of CONTRACT_SECTIONS) {
    if (section.baseNumber < targetSection.baseNumber && section.isVisible(form)) {
      visibleCount++;
    }
  }

  // The actual number is the count of visible sections before it, plus 1
  return visibleCount + 1;
}

/**
 * Get all visible sections for a given form
 */
export function getVisibleSections(form: ContractForm): SectionDefinition[] {
  return CONTRACT_SECTIONS.filter(section => section.isVisible(form));
}

/**
 * Get the total number of visible sections (excluding signatures)
 */
export function getVisibleSectionCount(form: ContractForm): number {
  return getVisibleSections(form).filter(s => s.id !== "signatures").length;
}

/**
 * Get estimated page count for print/PDF
 */
export function getEstimatedPageCount(form: ContractForm): number {
  const sectionCount = getVisibleSectionCount(form);
  
  // Base calculation: ~1 section per page, adjusted for content density
  let pages = Math.max(1, Math.ceil(sectionCount / 2));
  
  // Add pages for complex sections
  if (form.travelRequired) pages += 0.5;
  if (form.technicalRiderRequired) pages += 0.5;
  if (form.accommodationRequired) pages += 0.3;
  if (form.perDiemRequired) pages += 0.3;
  if (form.rehearsalRequired) pages += 0.3;
  if (form.hospitalityRequired) pages += 0.3;
  if (form.imageUsageAllowed) pages += 0.3;
  if (form.merchandiseSalesAllowed) pages += 0.3;
  if (form.technicalRiderRequired) pages += 0.4;
  
  return Math.ceil(pages);
}
