import React from "react";
import { ContractForm, ContractPreviewProps } from "../types/contract";
import { getSectionNumber } from "../utils/sectionNumbering";
import { PRINT_STYLES } from "./ContractPrintStyles";
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
    <div ref={previewRef} className="bg-gray-100 p-8 flex justify-center" style={{ fontFamily: 'var(--font-legal)' }}>
      {form.contractStatus === "Draft" && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] print:hidden" aria-hidden="true">
          <div className={`rotate-[-45deg] ${FONT_SIZE_CLASSES.contractTitle} font-bold text-neutral-900 uppercase tracking-[0.2em] whitespace-nowrap ${FONT_FAMILY_CLASSES.heading}`}>
            DRAFT
          </div>
        </div>
      )}
      
      <style>{PRINT_STYLES}</style>
      
      <article role="document" className="print-contract bg-white max-w-[794px] shadow-lg" style={{ padding: '15mm' }}>
        {form.artistLogo && (
          <div className="mb-6 flex justify-center">
            <img src={form.artistLogo} alt="Artist Logo" className="h-20 w-auto max-w-[200px] object-contain" />
          </div>
        )}
        
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Contract No. {draftId ? draftId.slice(0, 8).toUpperCase() : "DRAFT"}
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 mb-2">
          Vocal Performance Agreement
        </h1>
        
        <p className="text-sm text-neutral-500 italic mb-6">Professional Artist Services Contract</p>
        
        <div className="grid grid-cols-2 gap-4 border-t border-neutral-300 pt-4 mb-8">
          <div className="text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400 mb-2">
              ARTIST
            </p>
            <p className="text-sm font-semibold text-neutral-900 mb-1 break-words">{artistName}</p>
            <p className="text-sm text-neutral-600 break-words">{artistEmail}</p>
          </div>
          <div className="text-left text-right">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-neutral-400 mb-2">
              CLIENT
            </p>
            <p className="text-sm font-semibold text-neutral-900 mb-1 break-words">{displayValue(form.clientName)}</p>
            <p className="text-sm text-neutral-600 break-words">{displayValue(form.email)}</p>
          </div>
        </div>
        
        {form.dateOfAgreement && (
          <div className="mb-8 text-center">
            <p className="text-sm font-medium text-neutral-700 break-words">
              <span className="uppercase tracking-wide">Date of Agreement:</span> {form.dateOfAgreement}
            </p>
          </div>
        )}

        <div className="mb-8 bg-neutral-50 border-2 border-neutral-300 rounded-lg p-5 break-inside-avoid">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500 mb-4">Executive Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 mb-1">Total Fee</p>
              <p className="text-base font-bold text-neutral-900 break-words">{totalFee}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 mb-1">Event Date</p>
              <p className="text-sm font-semibold text-neutral-900 break-words">{displayValue(form.eventDates)}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 mb-1">Venue</p>
              <p className="text-sm font-semibold text-neutral-900 break-words">{displayValue(form.venueLocation)}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400 mb-1">Services</p>
              <p className="text-sm font-semibold text-neutral-900 break-words">{form.services.length > 0 ? `${form.services.length} selected` : "To be determined"}</p>
            </div>
          </div>
        </div>

        <div className="space-y-8 text-sm leading-relaxed">
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

        <footer className="mt-12 pt-6 border-t border-neutral-300 text-center">
          <p className="text-xs text-neutral-400 uppercase tracking-[0.15em]">
            This agreement is legally binding upon signature by both parties
          </p>
        </footer>
      </article>
    </div>
  );
}
