import React from "react";
import { ContractForm, ContractPreviewProps } from "../types/contract";
import { getSectionNumber, getEstimatedPageCount } from "../utils/sectionNumbering";
import { PRINT_CLASSES } from "./ContractPrintStyles";
import { FONT_SIZE_CLASSES, LINE_HEIGHT_CLASSES, FONT_FAMILY_CLASSES } from "./ContractTypography";
import {
  EngagementDetailsSection,
  ScopeOfServicesSection,
  CompensationSection,
  TravelExpensesSection,
  CancellationTermsSection,
  TechnicalRequirementsSection,
  TechnicalRiderSection,
  MediaRightsSection,
  ForceMajeureSection,
  IndependentContractorSection,
  PerformanceRequirementsSection,
  FinancialLegalTermsSection,
  RightsUsageSection,
  AccommodationSection,
  PerDiemSection,
  CreditPublicitySection,
  OperationalDetailsSection,
  StandardLegalProtectionsSection,
} from "./ContractSections";
import { ContractSignatures } from "./ContractSignatures";

export default function ContractPreview({ form, previewRef, draftId, showStandardClauses = true }: ContractPreviewProps) {
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
  const totalFee = form.totalFee ? money(totalFeeNumber) : "________ CAD";

  // Use dynamic section numbering
  const estimatedPages = getEstimatedPageCount(form);

  // Get section numbers dynamically
  const engagementNumber = getSectionNumber("engagement", form);
  const scopeNumber = getSectionNumber("scope", form);
  const compensationNumber = getSectionNumber("compensation", form);
  const travelNumber = getSectionNumber("travel", form);
  const cancellationNumber = getSectionNumber("cancellation", form);
  const technicalNumber = getSectionNumber("technical", form);
  const technicalRiderNumber = getSectionNumber("technicalRider", form);
  const mediaRightsNumber = getSectionNumber("mediaRights", form);
  const forceMajeureNumber = getSectionNumber("forceMajeure", form);
  const independentContractorNumber = getSectionNumber("independentContractor", form);
  const performanceRequirementsNumber = getSectionNumber("performanceRequirements", form);
  const financialLegalNumber = getSectionNumber("financialLegal", form);
  const rightsUsageNumber = getSectionNumber("rightsUsage", form);
  const accommodationNumber = getSectionNumber("accommodation", form);
  const perDiemNumber = getSectionNumber("perDiem", form);
  const publicityNumber = getSectionNumber("publicity", form);
  const operationalNumber = getSectionNumber("operational", form);
  const standardLegalNumber = getSectionNumber("standardLegalProtections", form);
  const signaturesNumber = getSectionNumber("signatures", form);

  return (
    <article
      ref={previewRef}
      className={`min-h-[1123px] bg-white px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-14 lg:py-16 xl:px-20 xl:py-24 text-neutral-900 shadow-lg shadow-neutral-200/50 border border-neutral-100 relative ${LINE_HEIGHT_CLASSES.body} ${PRINT_CLASSES.container}`}
      role="document"
      aria-label="Vocal Performance Agreement Contract"
      style={{ fontFamily: 'var(--font-legal)' }}
    >
      {form.contractStatus === "Draft" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] print:hidden" aria-hidden="true">
          <div className={`rotate-[-45deg] ${FONT_SIZE_CLASSES.contractTitle} font-bold text-neutral-900 uppercase tracking-[0.2em] whitespace-nowrap ${FONT_FAMILY_CLASSES.heading}`}>
            DRAFT
          </div>
        </div>
      )}
      <header className="border-b-2 border-neutral-900 pb-6 sm:pb-8 lg:pb-12 print:pb-8">
        {form.artistLogo && (
          <div className="mb-4 sm:mb-6 flex justify-center">
            <img src={form.artistLogo} alt="Artist Logo" className="h-16 w-auto max-w-[150px] sm:h-20 sm:max-w-[200px] md:h-24 md:max-w-[250px] object-contain" />
          </div>
        )}
        <div className={`mb-2 sm:mb-3 ${FONT_SIZE_CLASSES.labelSmall} font-semibold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-neutral-400 ${FONT_FAMILY_CLASSES.heading}`}>
          Contract No. {draftId ? draftId.slice(0, 8).toUpperCase() : "DRAFT"}
        </div>
        <h1 className={`${FONT_SIZE_CLASSES.contractTitle} font-bold tracking-tight text-neutral-900 mb-2 sm:mb-3 md:mb-4 ${FONT_FAMILY_CLASSES.heading} ${LINE_HEIGHT_CLASSES.heading}`}>
          Vocal Performance Agreement
        </h1>
        <p className={`${FONT_SIZE_CLASSES.label} text-neutral-500 italic mb-4 sm:mb-6 md:mb-8 lg:mb-12 ${FONT_FAMILY_CLASSES.heading}`}>Professional Artist Services Contract</p>
        <div className="grid gap-3 sm:gap-4 md:gap-6 sm:grid-cols-2 sm:gap-8 border-t border-neutral-300 pt-4 sm:pt-6 md:pt-8">
          <div className="text-left">
            <p className={`${FONT_SIZE_CLASSES.labelSmall} font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-neutral-400 mb-1.5 sm:mb-2 md:mb-3 ${FONT_FAMILY_CLASSES.heading}`}>
              ARTIST
            </p>
            <p className={`${FONT_SIZE_CLASSES.bodyCompact} font-semibold text-neutral-900 mb-0.5 sm:mb-1 break-words`}>{artistName}</p>
            <p className={`${FONT_SIZE_CLASSES.label} text-neutral-600 break-words`}>{artistEmail}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className={`${FONT_SIZE_CLASSES.labelSmall} font-semibold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-neutral-400 mb-1.5 sm:mb-2 md:mb-3 ${FONT_FAMILY_CLASSES.heading}`}>
              CLIENT
            </p>
            <p className={`${FONT_SIZE_CLASSES.bodyCompact} font-semibold text-neutral-900 mb-0.5 sm:mb-1 break-words`}>{displayValue(form.clientName)}</p>
            <p className={`${FONT_SIZE_CLASSES.label} text-neutral-600 break-words`}>{displayValue(form.email)}</p>
          </div>
        </div>
        {form.dateOfAgreement && (
          <div className="mt-4 sm:mt-6 md:mt-8 text-center">
            <p className={`${FONT_SIZE_CLASSES.label} font-medium text-neutral-700 break-words`}>
              <span className="uppercase tracking-wide">Date of Agreement:</span> {form.dateOfAgreement}
            </p>
          </div>
        )}
      </header>

      <div className="mt-4 sm:mt-6 mb-6 sm:mb-8 md:mb-12 bg-neutral-50 border-2 border-neutral-300 rounded-xl p-4 sm:p-5 md:p-6 break-after-avoid print:mb-8">
        <h3 className={`${FONT_SIZE_CLASSES.labelSmall} font-bold uppercase tracking-[0.2em] sm:tracking-[0.24em] text-neutral-500 mb-3 sm:mb-4 md:mb-5 ${FONT_FAMILY_CLASSES.heading}`}>Executive Summary</h3>
        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col">
            <p className={`${FONT_SIZE_CLASSES.labelSmall} font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-neutral-400 mb-1 sm:mb-1.5 ${FONT_FAMILY_CLASSES.heading}`}>Total Fee</p>
            <p className={`${FONT_SIZE_CLASSES.bodyCompact} lg:${FONT_SIZE_CLASSES.bodyText} xl:text-lg font-bold text-neutral-900 break-words`}>{totalFee}</p>
          </div>
          <div className="flex flex-col">
            <p className={`${FONT_SIZE_CLASSES.labelSmall} font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-neutral-400 mb-1 sm:mb-1.5 ${FONT_FAMILY_CLASSES.heading}`}>Event Date</p>
            <p className={`${FONT_SIZE_CLASSES.labelSmall} md:${FONT_SIZE_CLASSES.label} lg:${FONT_SIZE_CLASSES.bodyText} xl:${FONT_SIZE_CLASSES.bodyText} font-semibold text-neutral-900 break-words`}>{displayValue(form.eventDates)}</p>
          </div>
          <div className="flex flex-col">
            <p className={`${FONT_SIZE_CLASSES.labelSmall} font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-neutral-400 mb-1 sm:mb-1.5 ${FONT_FAMILY_CLASSES.heading}`}>Venue</p>
            <p className={`${FONT_SIZE_CLASSES.labelSmall} md:${FONT_SIZE_CLASSES.label} lg:${FONT_SIZE_CLASSES.bodyText} xl:${FONT_SIZE_CLASSES.bodyText} font-semibold text-neutral-900 break-words`}>{displayValue(form.venueLocation)}</p>
          </div>
          <div className="flex flex-col">
            <p className={`${FONT_SIZE_CLASSES.labelSmall} font-semibold uppercase tracking-[0.12em] sm:tracking-[0.14em] text-neutral-400 mb-1 sm:mb-1.5 ${FONT_FAMILY_CLASSES.heading}`}>Services</p>
            <p className={`${FONT_SIZE_CLASSES.labelSmall} md:${FONT_SIZE_CLASSES.label} lg:${FONT_SIZE_CLASSES.bodyText} xl:${FONT_SIZE_CLASSES.bodyText} font-semibold text-neutral-900 break-words`}>{form.services.length > 0 ? `${form.services.length} selected` : "To be determined"}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-16 space-y-6 sm:space-y-8 md:space-y-10 lg:space-y-12 xl:space-y-16 ${FONT_SIZE_CLASSES.bodyCompact} md:${FONT_SIZE_CLASSES.bodyText} lg:${FONT_SIZE_CLASSES.bodyText} leading-6 sm:leading-7 print:space-y-8 print:text-sm">
        <EngagementDetailsSection form={form} number={engagementNumber} />
        <ScopeOfServicesSection form={form} number={scopeNumber} />
        <CompensationSection form={form} number={compensationNumber} />
        {form.travelRequired && <TravelExpensesSection form={form} number={travelNumber} />}
        <CancellationTermsSection form={form} number={cancellationNumber} />
        <TechnicalRequirementsSection form={form} number={technicalNumber} />
        {form.technicalRiderRequired && <TechnicalRiderSection form={form} number={technicalRiderNumber} />}
        {form.mediaRightsAllowed && <MediaRightsSection form={form} number={mediaRightsNumber} />}
        {form.forceMajeureIncluded && <ForceMajeureSection form={form} number={forceMajeureNumber} />}
        <IndependentContractorSection form={form} number={independentContractorNumber} />
        {(form.rehearsalRequired || form.soundCheckRequired || form.hospitalityRequired) && (
          <PerformanceRequirementsSection form={form} number={performanceRequirementsNumber} />
        )}
        <FinancialLegalTermsSection form={form} number={financialLegalNumber} />
        {(form.imageUsageAllowed || form.merchandiseSalesAllowed) && (
          <RightsUsageSection form={form} number={rightsUsageNumber} />
        )}
        {form.accommodationRequired && <AccommodationSection form={form} number={accommodationNumber} />}
        {form.perDiemRequired && <PerDiemSection form={form} number={perDiemNumber} />}
        {form.publicityTermsRequired && <CreditPublicitySection form={form} number={publicityNumber} />}
        {(form.securityRequired || form.parkingProvided) && (
          <OperationalDetailsSection form={form} number={operationalNumber} />
        )}
        {showStandardClauses && <StandardLegalProtectionsSection form={form} number={standardLegalNumber} />}
        <ContractSignatures form={form} sectionNumber={signaturesNumber} />
      </div>
      <footer className={`${PRINT_CLASSES.footer} mt-8 sm:mt-12 md:mt-16 pt-6 sm:pt-8 border-t border-neutral-300 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0`}>
        <p className={`${FONT_SIZE_CLASSES.labelSmall} text-neutral-400 uppercase tracking-[0.15em] sm:tracking-[0.18em] text-center sm:text-left`}>
          This agreement is legally binding upon signature by both parties
        </p>
        <p className={`${FONT_SIZE_CLASSES.labelSmall} ${FONT_FAMILY_CLASSES.heading}`}>
          Page <span className="font-semibold">1</span> of <span className="font-semibold">{estimatedPages}</span>
        </p>
      </footer>
    </article>
  );
}
