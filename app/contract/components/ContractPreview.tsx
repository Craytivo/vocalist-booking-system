import React, { useEffect } from "react";
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
  useEffect(() => {
    const handleCreateContract = (event: SubmitEvent) => {
      const submitter = event.submitter as HTMLElement | null;
      const label = submitter?.textContent?.replace(/\s+/g, " ").trim().toLowerCase();
      if (label !== "create contract") return;

      event.preventDefault();
      window.setTimeout(() => window.print(), 0);
    };

    document.addEventListener("submit", handleCreateContract, true);
    return () => document.removeEventListener("submit", handleCreateContract, true);
  }, []);

  const displayValue = (value: string) => value || "________";
  const artistName = displayValue(form.artistName);
  const artistEmail = displayValue(form.artistEmail);
  const totalFeeNumber = Number(form.totalFee) || 0;
  const depositPercentageNumber = form.depositPercentage !== "" ? Number(form.depositPercentage) : 50;
  const depositAmount = totalFeeNumber * (depositPercentageNumber / 100);
  const balanceAmount = totalFeeNumber - depositAmount;
  const money = (value: number) => value.toLocaleString("en-CA", { style: "currency", currency: "CAD" });
  const totalFee = form.totalFee ? money(totalFeeNumber) : "________ CAD";

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
    <div ref={previewRef} className="bg-slate-100 p-4 sm:p-8 flex justify-center" style={{ fontFamily: "var(--font-legal)" }}>
      {form.contractStatus === "Draft" && (
        <div className="fixed inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] print:hidden" aria-hidden="true">
          <div className={`rotate-[-45deg] ${FONT_SIZE_CLASSES.contractTitle} font-bold text-slate-900 uppercase tracking-[0.2em] whitespace-nowrap ${FONT_FAMILY_CLASSES.heading}`}>DRAFT</div>
        </div>
      )}

      <style>{PRINT_STYLES}</style>

      <article role="document" className="print-contract w-full max-w-[794px] overflow-hidden bg-white shadow-xl shadow-slate-900/10 ring-1 ring-slate-200 print:max-w-none print:shadow-none print:ring-0" style={{ padding: "15mm" }}>
        <header className="border-b border-slate-300 pb-6 mb-8">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <div className="mb-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Contract No. {draftId ? draftId.slice(0, 8).toUpperCase() : "DRAFT"}</div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">Vocal Performance Agreement</h1>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">Professional Artist Services Agreement</p>
            </div>
            {form.artistLogo && <img src={form.artistLogo} alt="Artist Logo" className="h-16 w-auto max-w-[150px] object-contain shrink-0" />}
          </div>
        </header>

        <section className="mb-7 grid grid-cols-1 sm:grid-cols-2 gap-5 border-b border-slate-200 pb-6 break-inside-avoid">
          <div><p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Artist</p><p className="text-sm font-semibold text-slate-900 break-words">{artistName}</p><p className="text-xs text-slate-600 break-words">{artistEmail}</p></div>
          <div className="sm:text-right"><p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400">Client</p><p className="text-sm font-semibold text-slate-900 break-words">{displayValue(form.clientName)}</p><p className="text-xs text-slate-600 break-words">{displayValue(form.email)}</p></div>
        </section>

        {form.dateOfAgreement && <div className="mb-7 text-xs font-medium text-slate-600"><span className="font-bold uppercase tracking-[0.12em] text-slate-400">Date of Agreement</span><span className="mx-2 text-slate-300">|</span>{form.dateOfAgreement}</div>}

        <section className="mb-8 border border-slate-300 bg-slate-50 p-5 break-inside-avoid">
          <h2 className="mb-4 border-b border-slate-200 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Commercial Summary</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Total Fee</p><p className="mt-1 text-base font-bold text-slate-900">{totalFee}</p></div>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Deposit</p><p className="mt-1 text-sm font-semibold text-slate-900">{form.totalFee ? `${money(depositAmount)} (${depositPercentageNumber}%)` : "________"}</p></div>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Balance</p><p className="mt-1 text-sm font-semibold text-slate-900">{form.totalFee ? money(balanceAmount) : "________"}</p></div>
            <div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Payment Method</p><p className="mt-1 text-sm font-semibold text-slate-900 break-words">{displayValue(form.paymentMethod)}</p></div>
            {(() => {
              const hasMultiple = (form.eventDates || "").includes("\n");
              const firstLine = (form.eventDates || "").split(/\r?\n/).map(s => s.trim()).filter(Boolean)[0] || form.eventDates || "";
              return <><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Event Date</p><p className="mt-1 text-sm font-semibold text-slate-900 break-words">{displayValue(hasMultiple ? firstLine : form.eventDates)}</p></div><div><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Venue</p><p className="mt-1 text-sm font-semibold text-slate-900 break-words">{displayValue(hasMultiple ? "Multiple locations" : form.venueLocation)}</p></div></>;
            })()}
            <div className="col-span-2"><p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Services</p><p className="mt-1 text-sm font-semibold text-slate-900 break-words">{form.services.length > 0 ? form.services.join(" · ") : "To be determined"}</p></div>
          </div>
        </section>

        <div className="space-y-8 text-sm leading-relaxed text-slate-800">
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
          {(form.rehearsalRequired || form.soundCheckRequired || form.hospitalityRequired) && <PerformanceRequirementsSection form={form} number={performanceRequirementsNumber} />}
          <FinancialLegalTermsSection form={form} number={financialLegalNumber} />
          {(form.imageUsageAllowed || form.merchandiseSalesAllowed) && <RightsUsageSection form={form} number={rightsUsageNumber} />}
          {form.accommodationRequired && <AccommodationSection form={form} number={accommodationNumber} />}
          {form.perDiemRequired && <PerDiemSection form={form} number={perDiemNumber} />}
          {form.publicityTermsRequired && <CreditPublicitySection form={form} number={publicityNumber} />}
          {(form.securityRequired || form.parkingProvided) && <OperationalDetailsSection form={form} number={operationalNumber} />}
          {showStandardClauses && <StandardLegalProtectionsSection form={form} number={standardLegalNumber} />}
          <div className="signatures"><ContractSignatures form={form} sectionNumber={signaturesNumber} /></div>
        </div>

        <footer className="mt-12 border-t border-slate-300 pt-5 text-center break-inside-avoid">
          <p className="text-[9px] leading-4 text-slate-500">This Agreement is intended to record the parties' commercial understanding. It is governed by the laws of Alberta and the applicable federal laws of Canada. Each party should obtain independent legal advice where appropriate.</p>
        </footer>
      </article>
    </div>
  );
}
