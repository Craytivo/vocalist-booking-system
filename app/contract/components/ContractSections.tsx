import React from "react";
import { ContractForm } from "../types/contract";
import { DEFAULT_LEGAL_TEXT } from "../types/contract";
import { FONT_SIZE_CLASSES, LINE_HEIGHT_CLASSES, FONT_FAMILY_CLASSES } from "./ContractTypography";

// Reusable section wrapper with consistent styling and accessibility
interface ContractSectionProps {
  number: number;
  title: string;
  children: React.ReactNode;
  className?: string;
  breakAfter?: boolean;
}

export function ContractSection({
  number,
  title,
  children,
  className = "",
  breakAfter = true,
}: ContractSectionProps) {
  return (
    <section
      className={`border-b border-neutral-300 pb-4 sm:pb-6 md:pb-8 lg:pb-12 break-inside-avoid print:break-inside-avoid ${
        breakAfter ? "break-after-avoid print:break-after-avoid" : ""
      } print:pb-8 ${className}`}
      aria-labelledby={`section-${number}`}
    >
      <h3
        id={`section-${number}`}
        className={`font-bold ${FONT_SIZE_CLASSES.sectionHeader} text-neutral-900 pl-0 mb-2 sm:mb-3 md:mb-4 lg:mb-6 tracking-tight ${FONT_FAMILY_CLASSES.heading} ${LINE_HEIGHT_CLASSES.heading}`}
      >
        {number}. {title}
      </h3>
      <div className={`text-neutral-700 ${FONT_SIZE_CLASSES.bodyCompact} md:${FONT_SIZE_CLASSES.bodyText} lg:${FONT_SIZE_CLASSES.bodyText} break-words ${LINE_HEIGHT_CLASSES.body}`}>
        {children}
      </div>
    </section>
  );
}

// Reusable paragraph with label and value
interface ContractParagraphProps {
  label: string;
  value: string | React.ReactNode;
  className?: string;
}

export function ContractParagraph({ label, value, className = "" }: ContractParagraphProps) {
  return (
    <p
      className={`mt-3 sm:mt-4 text-neutral-700 ${FONT_SIZE_CLASSES.bodyCompact} md:${FONT_SIZE_CLASSES.bodyText} lg:${FONT_SIZE_CLASSES.bodyText} ${className} ${LINE_HEIGHT_CLASSES.body}`}
    >
      <span className="font-semibold text-neutral-900">{label}:</span> {value}
    </p>
  );
}

// Reusable list for services
interface ContractListProps {
  items: string[];
  className?: string;
}

export function ContractList({ items, className = "" }: ContractListProps) {
  return (
    <ul
      className={`mt-2 sm:mt-3 md:mt-4 list-disc space-y-1 sm:space-y-2 pl-4 sm:pl-6 md:pl-8 text-neutral-700 ${FONT_SIZE_CLASSES.bodyCompact} md:${FONT_SIZE_CLASSES.bodyText} lg:${FONT_SIZE_CLASSES.bodyText} ${className} ${LINE_HEIGHT_CLASSES.body}`}
    >
      {items.map((item, index) => (
        <li key={index} className="break-words">
          {item}
        </li>
      ))}
    </ul>
  );
}

// Specific section components

export function EngagementDetailsSection({ form, number }: { form: ContractForm; number: number }) {
  const displayValue = (value: string) => value || "________";
  const artistName = displayValue(form.artistName);

  const hasMultipleStops = (form.eventDates || "").trim().includes("\n");
  const parsedStops = (form.eventDates || "").split(/\r?\n/).map(s => s.trim()).filter(Boolean);

  return (
    <ContractSection number={number} title="Engagement Details">
      {!hasMultipleStops ? (
        <p>
          This Vocal Performance Agreement is entered into between {artistName}{" "}
          and {displayValue(form.clientName)}, represented by{" "}
          {displayValue(form.representativeName)}. The engagement is for{" "}
          {displayValue(form.eventName)} taking place on{" "}
          {displayValue(form.eventDates)} at {displayValue(form.venueLocation)}.
        </p>
      ) : (
        <div>
          <p>
            This Vocal Performance Agreement is entered into between {artistName} and {displayValue(form.clientName)}, represented by {displayValue(form.representativeName)}. The engagement is for {displayValue(form.eventName)} and includes the following engagement stops:
          </p>
          <ul className="mt-3 list-disc pl-6 space-y-1">
            {parsedStops.map((line, idx) => (
              <li key={idx} className="break-words">{line}</li>
            ))}
          </ul>
        </div>
      )}

      {form.performanceDuration && (
        <ContractParagraph label="Performance Duration" value={form.performanceDuration} />
      )}

      <p className={`mt-3 sm:mt-4 text-neutral-700 ${FONT_SIZE_CLASSES.bodyCompact} md:${FONT_SIZE_CLASSES.bodyText} lg:${FONT_SIZE_CLASSES.bodyText} ${LINE_HEIGHT_CLASSES.body}`}>
        Client contact details: {displayValue(form.email)} / {displayValue(form.phoneNumber)}.
      </p>
    </ContractSection>
  );
}

export function ScopeOfServicesSection({ form, number }: { form: ContractForm; number: number }) {
  const displayValue = (value: string) => value || "________";

  return (
    <ContractSection number={number} title="Scope of Services">
      {form.services.length > 0 ? (
        <ContractList items={form.services} />
      ) : (
        <p className={`mt-2 sm:mt-3 md:mt-4 text-neutral-700 ${FONT_SIZE_CLASSES.bodyCompact} md:${FONT_SIZE_CLASSES.bodyText} lg:${FONT_SIZE_CLASSES.bodyText} break-words ${LINE_HEIGHT_CLASSES.body}`}>
          Services to be provided: ____________________.
        </p>
      )}
    </ContractSection>
  );
}

export function CompensationSection({ form, number }: { form: ContractForm; number: number }) {
  const displayValue = (value: string) => value || "________";
  const totalFeeNumber = Number(form.totalFee) || 0;
  const depositPercentageNumber = form.depositPercentage !== "" ? Number(form.depositPercentage) : 50;
  const depositAmount = totalFeeNumber * (depositPercentageNumber / 100);
  const balanceAmount = totalFeeNumber - depositAmount;

  const money = (value: number) =>
    value.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
    });

  const totalFee = form.totalFee ? money(totalFeeNumber) : "________ CAD";

  let compensationText = "";
  if (form.totalFee && Number(form.totalFee) > 0) {
    compensationText = `The Client agrees to pay the Artist a total fee of ${totalFee} for the services outlined in this agreement.`;
    if (depositPercentageNumber > 0) {
      compensationText += ` A deposit of ${money(depositAmount)} (${depositPercentageNumber}%) is due to confirm the booking, with the remaining balance of ${money(balanceAmount)} due as agreed by both parties.`;
    } else {
      compensationText += ` No deposit is required. The full payment of ${money(totalFeeNumber)} is due as agreed by both parties.`;
    }
  } else if (form.totalFee === "" || Number(form.totalFee) === 0) {
    compensationText = "The services outlined in this agreement are provided at no charge to the Client.";
  } else {
    compensationText = "Payment terms will be calculated once the total fee is confirmed.";
  }

  return (
    <ContractSection number={number} title="Compensation">
      <p>{compensationText}</p>
      {form.paymentMethod && (
        <ContractParagraph label="Payment Method" value={form.paymentMethod} />
      )}
      {depositPercentageNumber > 0 && (
        <p className={`mt-3 sm:mt-4 text-neutral-700 ${FONT_SIZE_CLASSES.bodyCompact} md:${FONT_SIZE_CLASSES.bodyText} lg:${FONT_SIZE_CLASSES.bodyText} ${LINE_HEIGHT_CLASSES.body}`}>
          {form.depositTerms || DEFAULT_LEGAL_TEXT.depositTerms}
        </p>
      )}
    </ContractSection>
  );
}

export function TravelExpensesSection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Travel & Expenses">
      <p>{form.travelTerms || DEFAULT_LEGAL_TEXT.travelTerms}</p>
    </ContractSection>
  );
}

export function CancellationTermsSection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Cancellation Terms">
      <p>{form.cancellationTerms || DEFAULT_LEGAL_TEXT.cancellationTerms}</p>
    </ContractSection>
  );
}

export function TechnicalRequirementsSection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Technical Requirements">
      <p>{form.technicalRequirements}</p>
    </ContractSection>
  );
}

export function TechnicalRiderSection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Technical Rider">
      <p>{form.technicalRiderDetails || DEFAULT_LEGAL_TEXT.technicalRiderDetails}</p>
    </ContractSection>
  );
}

export function MediaRightsSection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Media Rights">
      <p>{form.mediaRightsTerms || DEFAULT_LEGAL_TEXT.mediaRightsTerms}</p>
    </ContractSection>
  );
}

export function ForceMajeureSection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Force Majeure">
      <p>{form.forceMajeureTerms || DEFAULT_LEGAL_TEXT.forceMajeureTerms}</p>
    </ContractSection>
  );
}

export function IndependentContractorSection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Independent Contractor Status">
      <p>{form.independentContractorClause || DEFAULT_LEGAL_TEXT.independentContractorClause}</p>
    </ContractSection>
  );
}

export function PerformanceRequirementsSection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Performance Requirements">
      {form.rehearsalRequired && (
        <ContractParagraph label="Rehearsal" value={form.rehearsalDetails || DEFAULT_LEGAL_TEXT.rehearsalDetails} />
      )}
      {form.soundCheckRequired && (
        <ContractParagraph label="Sound Check" value={form.soundCheckDetails || DEFAULT_LEGAL_TEXT.soundCheckDetails} />
      )}
      {form.hospitalityRequired && (
        <ContractParagraph label="Hospitality" value={form.hospitalityDetails || DEFAULT_LEGAL_TEXT.hospitalityDetails} />
      )}
    </ContractSection>
  );
}

export function FinancialLegalTermsSection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Financial & Legal Terms">
      <ContractParagraph label="Late Payment Penalty" value={form.latePaymentPenalty || DEFAULT_LEGAL_TEXT.latePaymentPenalty} />
      <ContractParagraph label="Cancellation Fees" value={form.cancellationFee || DEFAULT_LEGAL_TEXT.cancellationFee} />
      {form.insuranceRequired && (
        <ContractParagraph label="Insurance" value={form.insuranceDetails || DEFAULT_LEGAL_TEXT.insuranceDetails} />
      )}
      <ContractParagraph label="Governing Law" value={form.governingLaw || DEFAULT_LEGAL_TEXT.governingLaw} />
      <ContractParagraph label="Dispute Resolution" value={form.disputeResolution || DEFAULT_LEGAL_TEXT.disputeResolution} />
      <ContractParagraph label="Indemnification" value={form.indemnificationClause || DEFAULT_LEGAL_TEXT.indemnificationClause} />
      <ContractParagraph label="Confidentiality" value={form.confidentialityClause || DEFAULT_LEGAL_TEXT.confidentialityClause} />
      <ContractParagraph label="Equipment Liability" value={form.equipmentLiabilityClause || DEFAULT_LEGAL_TEXT.equipmentLiabilityClause} />
      <ContractParagraph label="Attorney's Fees" value={form.attorneyFeesClause || DEFAULT_LEGAL_TEXT.attorneyFeesClause} />
    </ContractSection>
  );
}

export function RightsUsageSection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Rights & Usage">
      {form.imageUsageAllowed && (
        <ContractParagraph label="Image Usage" value={form.imageUsageTerms || DEFAULT_LEGAL_TEXT.imageUsageTerms} />
      )}
      {form.merchandiseSalesAllowed && (
        <ContractParagraph label="Merchandise Sales" value={form.merchandiseTerms || DEFAULT_LEGAL_TEXT.merchandiseTerms} />
      )}
    </ContractSection>
  );
}

export function AccommodationSection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Accommodation">
      <p>{form.accommodationDetails || DEFAULT_LEGAL_TEXT.accommodationDetails}</p>
    </ContractSection>
  );
}

export function PerDiemSection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Per Diem & Expenses">
      <p>{form.perDiemDetails || DEFAULT_LEGAL_TEXT.perDiemDetails}</p>
    </ContractSection>
  );
}

export function CreditPublicitySection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Credit & Publicity">
      <p>{form.publicityTerms || DEFAULT_LEGAL_TEXT.publicityTerms}</p>
    </ContractSection>
  );
}

export function OperationalDetailsSection({ form, number }: { form: ContractForm; number: number }) {
  return (
    <ContractSection number={number} title="Operational Details">
      {form.guestListCount && (
        <ContractParagraph label="Guest List" value={`${form.guestListCount} complimentary tickets`} />
      )}
      {form.securityRequired && (
        <ContractParagraph label="Security" value={form.securityDetails || DEFAULT_LEGAL_TEXT.securityDetails} />
      )}
      {form.parkingProvided && (
        <ContractParagraph label="Parking" value={form.parkingDetails || DEFAULT_LEGAL_TEXT.parkingDetails} />
      )}
    </ContractSection>
  );
}

export function StandardLegalProtectionsSection({ form, number }: { form: ContractForm; number: number }) {
  const hasAnyClause = 
    form.severabilityClause !== undefined ||
    form.entireAgreementClause !== undefined ||
    form.electronicSignatureClause !== undefined ||
    form.amendmentClause !== undefined ||
    form.waiverClause !== undefined ||
    form.governingJurisdiction !== undefined;

  if (!hasAnyClause) return null;

  return (
    <ContractSection number={number} title="Standard Legal Protections">
      {form.severabilityClause && (
        <ContractParagraph label="Severability" value={form.severabilityClause} />
      )}
      {form.entireAgreementClause && (
        <ContractParagraph label="Entire Agreement" value={form.entireAgreementClause} />
      )}
      {form.electronicSignatureClause && (
        <ContractParagraph label="Electronic Signatures" value={form.electronicSignatureClause} />
      )}
      {form.amendmentClause && (
        <ContractParagraph label="Amendments" value={form.amendmentClause} />
      )}
      {form.waiverClause && (
        <ContractParagraph label="Waiver" value={form.waiverClause} />
      )}
      {form.governingJurisdiction && (
        <ContractParagraph label="Governing Jurisdiction" value={form.governingJurisdiction} />
      )}
    </ContractSection>
  );
}
