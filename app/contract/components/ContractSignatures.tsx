import React from "react";
import { ContractForm, SignatureMetadata } from "../types/contract";
import { FONT_SIZE_CLASSES, LINE_HEIGHT_CLASSES, FONT_FAMILY_CLASSES } from "./ContractTypography";

interface SignatureBlockProps {
  signerName: string;
  signerTitle?: string;
  signature?: string;
  signedDate?: string;
  role: "Artist" | "Client";
  auditTrail?: SignatureMetadata;
}

export function SignatureBlock({
  signerName,
  signerTitle,
  signature,
  signedDate,
  role,
  auditTrail,
}: SignatureBlockProps) {
  const displayValue = (value: string) => value || "____________________";

  return (
    <div className="border-2 border-neutral-300 rounded-lg p-3 sm:p-4 md:p-5 lg:p-6 min-h-[160px] sm:min-h-[200px] md:min-h-[240px] lg:min-h-[280px] bg-white shadow-sm">
      <div className="h-16 sm:h-20 md:h-24 lg:h-28 border-b border-dashed border-neutral-400 flex items-end justify-center mb-3 sm:mb-4 md:mb-6 lg:mb-8 px-2 sm:px-4">
        {signature ? (
          <span className={`${FONT_FAMILY_CLASSES.body} ${FONT_SIZE_CLASSES.bodyCompact} md:${FONT_SIZE_CLASSES.bodyText} lg:text-2xl text-neutral-900 italic tracking-wide break-words`}>
            {signature}
          </span>
        ) : (
          <span className={`text-neutral-400 italic ${FONT_SIZE_CLASSES.captionSm} md:${FONT_SIZE_CLASSES.caption} lg:${FONT_SIZE_CLASSES.label}`}>Signature</span>
        )}
      </div>
      <div className="space-y-1 sm:space-y-2 px-1 sm:px-2">
        <p className={`${FONT_SIZE_CLASSES.captionSm} md:${FONT_SIZE_CLASSES.caption} lg:${FONT_SIZE_CLASSES.label} font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-300 pb-1 sm:pb-2 break-words ${FONT_FAMILY_CLASSES.heading}`}>
          {displayValue(signerName)}
        </p>
        {signerTitle && (
          <p className={`${FONT_SIZE_CLASSES.captionSm} md:${FONT_SIZE_CLASSES.caption} lg:${FONT_SIZE_CLASSES.caption} font-semibold text-neutral-600 uppercase tracking-wide break-words ${FONT_FAMILY_CLASSES.heading}`}>
            {signerTitle}
          </p>
        )}
        <p className={`${FONT_SIZE_CLASSES.captionSm} md:${FONT_SIZE_CLASSES.caption} lg:${FONT_SIZE_CLASSES.caption} text-neutral-500 uppercase tracking-wider mt-2 sm:mt-3 ${FONT_FAMILY_CLASSES.heading}`}>
          {role}
        </p>
        <p className={`${FONT_SIZE_CLASSES.captionSm} md:${FONT_SIZE_CLASSES.caption} lg:${FONT_SIZE_CLASSES.label} text-neutral-700 mt-1 sm:mt-2 break-words ${LINE_HEIGHT_CLASSES.body}`}>
          Date: {displayValue(signedDate || "")}
        </p>
        {auditTrail && (
          <div className="mt-2 pt-2 border-t border-neutral-200">
            <p className={`${FONT_SIZE_CLASSES.captionXs} md:${FONT_SIZE_CLASSES.captionSm} text-neutral-400 hidden print:block`}>
              IP: {auditTrail.ipAddress || "N/A"} | UA: {auditTrail.userAgent?.substring(0, 30) || "N/A"}...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ContractSignaturesProps {
  form: ContractForm;
  sectionNumber: number;
  artistAuditTrail?: SignatureMetadata;
  clientAuditTrail?: SignatureMetadata;
}

export function ContractSignatures({
  form,
  sectionNumber,
  artistAuditTrail,
  clientAuditTrail,
}: ContractSignaturesProps) {
  return (
    <section
      className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 break-inside-avoid"
      aria-labelledby={`section-${sectionNumber}`}
    >
      <h3
        id={`section-${sectionNumber}`}
        className={`font-bold ${FONT_SIZE_CLASSES.sectionHeader} text-neutral-900 pl-0 mb-4 sm:mb-6 md:mb-8 lg:mb-12 tracking-tight ${FONT_FAMILY_CLASSES.heading} ${LINE_HEIGHT_CLASSES.heading}`}
      >
        {sectionNumber}. Signatures
      </h3>
      <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 grid gap-4 sm:gap-6 md:gap-8 lg:gap-12 grid-cols-1 sm:grid-cols-2">
        <SignatureBlock
          signerName={form.artistSignerName}
          signerTitle={form.artistSignerTitle}
          signature={form.artistSignature}
          signedDate={form.signedDate}
          role="Artist"
          auditTrail={artistAuditTrail}
        />
        <SignatureBlock
          signerName={form.clientSignerName}
          signerTitle={form.clientSignerTitle}
          signature={form.clientSignature}
          signedDate={form.signedDate}
          role="Client"
          auditTrail={clientAuditTrail}
        />
      </div>
      
      {/* E-signature validity notice */}
      {(form.artistSignature || form.clientSignature) && (
        <div className="mt-4 p-3 bg-neutral-50 border border-neutral-200 rounded-lg text-[9px] sm:text-[10px] text-neutral-600">
          <p className="font-semibold text-neutral-800 mb-1">Electronic Signature Notice:</p>
          <p>
            By signing this agreement electronically, both parties acknowledge that their electronic signatures 
            have the same legal effect as handwritten signatures and constitute acceptance of all terms and conditions.
          </p>
        </div>
      )}
    </section>
  );
}
