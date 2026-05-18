interface ContractForm {
  [key: string]: any;
}

interface ContractPreviewProps {
  form: ContractForm;
  previewRef: React.RefObject<HTMLDivElement>;
  draftId: string | null;
}

export default function ContractPreview({ form, previewRef, draftId }: ContractPreviewProps) {
  const displayValue = (value: string) => value || "________";
  const artistName = displayValue(form.artistName);
  const artistEmail = displayValue(form.artistEmail);
  const totalFeeNumber = Number(form.totalFee) || 0;
  const depositPercentageNumber = form.depositPercentage !== "" ? Number(form.depositPercentage) : 50;
  const depositAmount = totalFeeNumber * (depositPercentageNumber / 100);
  const balanceAmount = totalFeeNumber - depositAmount;
  const sectionOffset = form.travelRequired ? 0 : -1;
  const additionalOffset = (form.mediaRightsAllowed ? 1 : 0) + (form.forceMajeureIncluded ? 1 : 0);
  const money = (value: number) =>
    value.toLocaleString("en-CA", {
      style: "currency",
      currency: "CAD",
    });
  const totalFee = form.totalFee ? money(totalFeeNumber) : "________ CAD";
  
  const estimatedPages = Math.max(1, Math.ceil(1 + (form.rehearsalRequired ? 0.5 : 0) + (form.hospitalityRequired ? 0.5 : 0) + (form.travelRequired ? 0.5 : 0) + (form.imageUsageAllowed ? 0.3 : 0) + (form.merchandiseSalesAllowed ? 0.3 : 0) + (form.technicalRiderRequired ? 0.4 : 0) + (form.accommodationRequired ? 0.3 : 0) + (form.perDiemRequired ? 0.3 : 0) + (form.publicityTermsRequired ? 0.2 : 0)));

  return (
    <article
      ref={previewRef}
      className="min-h-[1123px] bg-white px-6 py-12 text-xs sm:text-sm sm:px-10 sm:py-16 lg:px-14 lg:py-20 xl:px-20 xl:py-24 font-serif text-neutral-900 shadow-lg shadow-neutral-200/50 border border-neutral-100 relative leading-relaxed print:shadow-none print:border-none print:box-border print:min-h-[1123px] print:px-14 print:py-20 print:text-sm"
    >
      {form.contractStatus === "Draft" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-3 print:hidden">
          <div className="rotate-[-45deg] text-[140px] font-bold text-neutral-900 uppercase tracking-[0.2em] whitespace-nowrap">
            DRAFT
          </div>
        </div>
      )}
      <header className="border-b-2 border-neutral-900 pb-8 sm:pb-14 lg:pb-16 print:pb-8">
        {form.artistLogo && (
          <div className="mb-6 flex justify-center">
            <img src={form.artistLogo} alt="Artist Logo" className="h-20 w-auto max-w-[200px] sm:h-28 sm:max-w-[300px] object-contain" />
          </div>
        )}
        <div className="mb-3 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.3em] text-neutral-400">
          Contract No. {draftId ? draftId.slice(0, 8).toUpperCase() : "DRAFT"}
        </div>
        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold tracking-tight text-neutral-900 mb-3 sm:mb-4 font-sans">
          Vocal Performance Agreement
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 italic mb-6 sm:mb-12 font-sans">Professional Artist Services Contract</p>
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 sm:gap-8 border-t border-neutral-300 pt-6 sm:pt-8">
          <div className="text-left">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-2 sm:mb-3">
              ARTIST
            </p>
            <p className="text-base sm:text-lg font-semibold text-neutral-900 mb-1">{artistName}</p>
            <p className="text-xs sm:text-sm text-neutral-600">{artistEmail}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400 mb-2 sm:mb-3">
              CLIENT
            </p>
            <p className="text-base sm:text-lg font-semibold text-neutral-900 mb-1">{displayValue(form.clientName)}</p>
            <p className="text-xs sm:text-sm text-neutral-600">{displayValue(form.email)}</p>
          </div>
        </div>
        {form.dateOfAgreement && (
          <div className="mt-8 text-center">
            <p className="text-sm font-medium text-neutral-700">
              <span className="uppercase tracking-wide">Date of Agreement:</span> {form.dateOfAgreement}
            </p>
          </div>
        )}
      </header>

      <div className="mt-6 sm:mt-8 mb-8 sm:mb-12 bg-neutral-50 border-2 border-neutral-300 rounded-xl p-5 sm:p-6 break-after-avoid print:mb-8">
        <h3 className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.24em] text-neutral-500 mb-4 sm:mb-5 font-sans">Executive Summary</h3>
        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-1.5">Total Fee</p>
            <p className="text-xs sm:text-sm lg:text-base xl:text-lg font-bold text-neutral-900 break-words">{totalFee}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-1.5">Event Date</p>
            <p className="text-[10px] sm:text-xs sm:text-sm lg:text-base xl:text-base font-semibold text-neutral-900 break-words">{displayValue(form.eventDates)}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-1.5">Venue</p>
            <p className="text-[10px] sm:text-xs sm:text-sm lg:text-base xl:text-base font-semibold text-neutral-900 break-words">{displayValue(form.venueLocation)}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400 mb-1.5">Services</p>
            <p className="text-[10px] sm:text-xs sm:text-sm lg:text-base xl:text-base font-semibold text-neutral-900 break-words">{form.services.length > 0 ? `${form.services.length} selected` : "To be determined"}</p>
          </div>
        </div>
      </div>

      <div className="mt-10 sm:mt-12 lg:mt-16 space-y-10 sm:space-y-14 lg:space-y-16 text-xs sm:text-sm lg:text-base leading-7 print:space-y-8 print:text-sm">
        <section className="border-b border-neutral-300 pb-6 sm:pb-8 lg:pb-12 break-after-avoid print:pb-8 overflow-hidden">
          <h3 className="font-bold text-xs sm:text-base md:text-lg lg:text-xl xl:text-2xl text-neutral-900 pl-0 mb-3 sm:mb-4 lg:mb-6 tracking-tight font-display">1. Engagement Details</h3>
          <p className="text-neutral-700 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl break-words">
            This Vocal Performance Agreement is entered into between {artistName}{" "}
            and {displayValue(form.clientName)}, represented by{" "}
            {displayValue(form.representativeName)}. The engagement is for{" "}
            {displayValue(form.eventName)} taking place on{" "}
            {displayValue(form.eventDates)} at {displayValue(form.venueLocation)}.
          </p>
          {form.performanceDuration && (
            <p className="mt-4 text-neutral-700">
              <span className="font-semibold text-neutral-900">Performance Duration:</span> {form.performanceDuration}
            </p>
          )}
          <p className="mt-4 text-neutral-700">
            Client contact details: {displayValue(form.email)} /{" "}
            {displayValue(form.phoneNumber)}.
          </p>
        </section>

        <section className="border-b border-neutral-300 pb-6 sm:pb-8 lg:pb-12 break-after-avoid print:pb-8">
          <h3 className="font-bold text-base sm:text-lg lg:text-xl lg:text-2xl text-neutral-900 pl-0 mb-3 sm:mb-4 lg:mb-6 tracking-tight font-display">2. Scope of Services</h3>
          {form.services.length > 0 ? (
            <ul className="mt-3 sm:mt-4 list-disc space-y-1 sm:space-y-2 pl-6 sm:pl-8 text-neutral-700 text-xs sm:text-sm lg:text-base">
              {form.services.map((service: string) => (
                <li key={service} className="break-words">{service}</li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 sm:mt-4 text-neutral-700 text-xs sm:text-sm lg:text-base break-words">Services to be provided: ____________________.</p>
          )}
        </section>

        <section className="border-b border-neutral-300 pb-6 sm:pb-8 lg:pb-12 break-after-avoid print:pb-8">
          <h3 className="font-bold text-base sm:text-lg lg:text-xl lg:text-2xl text-neutral-900 pl-0 mb-3 sm:mb-4 lg:mb-6 tracking-tight font-display">3. Compensation</h3>
          <p className="text-neutral-700 text-xs sm:text-sm lg:text-base break-words">
            {form.totalFee && Number(form.totalFee) > 0
              ? `The Client agrees to pay the Artist a total fee of ${totalFee} for the services outlined in this agreement.${
                  depositPercentageNumber > 0
                    ? ` A deposit of ${money(depositAmount)} (${depositPercentageNumber}%) is due to confirm the booking, with the remaining balance of ${money(balanceAmount)} due as agreed by both parties.`
                    : ` No deposit is required. The full payment of ${money(totalFeeNumber)} is due as agreed by both parties.`
                }`
              : form.totalFee === "" || Number(form.totalFee) === 0
              ? "The services outlined in this agreement are provided at no charge to the Client."
              : " Payment terms will be calculated once the total fee is confirmed."}
          </p>
          {form.paymentMethod && (
            <p className="mt-4 text-neutral-700">
              <span className="font-semibold text-neutral-900">Payment Method:</span> {form.paymentMethod}
            </p>
          )}
          {depositPercentageNumber > 0 && <p className="mt-4 text-neutral-700">{form.depositTerms}</p>}
        </section>

        {form.travelRequired && (
          <section className="border-b border-neutral-300 pb-12 break-after-avoid">
            <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">4. Travel & Expenses</h3>
            <p className="text-neutral-700">
              Travel is required for this engagement. {form.travelTerms}
            </p>
          </section>
        )}

        <section className="border-b border-neutral-300 pb-12 break-after-avoid">
          <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">{5 + sectionOffset}. Cancellation Terms</h3>
          <p className="text-neutral-700">{form.cancellationTerms}</p>
        </section>

        <section className="border-b border-neutral-300 pb-12 break-after-avoid">
          <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">{6 + sectionOffset}. Technical Requirements</h3>
          <p className="text-neutral-700">{form.technicalRequirements}</p>
        </section>

        {form.technicalRiderRequired && (
          <section className="border-b border-neutral-300 pb-12 break-after-avoid">
            <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">{7 + sectionOffset}. Technical Rider</h3>
            <p className="text-neutral-700">{form.technicalRiderDetails}</p>
          </section>
        )}

        {form.mediaRightsAllowed && (
          <section className="border-b border-neutral-300 pb-12 break-after-avoid">
            <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">{7 + sectionOffset + (form.technicalRiderRequired ? 1 : 0)}. Media Rights</h3>
            <p className="text-neutral-700">{form.mediaRightsTerms}</p>
          </section>
        )}

        {form.forceMajeureIncluded && (
          <section className="border-b border-neutral-300 pb-12 break-after-avoid">
            <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">{7 + sectionOffset + (form.mediaRightsAllowed ? 1 : 0)}. Force Majeure</h3>
            <p className="text-neutral-700">{form.forceMajeureTerms}</p>
          </section>
        )}

        <section className="border-b border-neutral-300 pb-12 break-after-avoid">
          <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">{7 + sectionOffset + additionalOffset}. Independent Contractor Status</h3>
          <p className="text-neutral-700">{form.independentContractorClause}</p>
        </section>

        {(form.rehearsalRequired || form.soundCheckRequired || form.hospitalityRequired) && (
          <section className="border-b border-neutral-300 pb-12 break-after-avoid">
          <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">{8 + sectionOffset + additionalOffset}. Performance Requirements</h3>
            {form.rehearsalRequired && <p className="mt-4 text-neutral-700"><span className="font-semibold text-neutral-900">Rehearsal:</span> {form.rehearsalDetails}</p>}
            {form.soundCheckRequired && <p className="mt-4 text-neutral-700"><span className="font-semibold text-neutral-900">Sound Check:</span> {form.soundCheckDetails}</p>}
            {form.hospitalityRequired && <p className="mt-4 text-neutral-700"><span className="font-semibold text-neutral-900">Hospitality:</span> {form.hospitalityDetails}</p>}
          </section>
        )}

        <section className="border-b border-neutral-300 pb-12 break-after-avoid">
          <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">{8 + sectionOffset + additionalOffset + (form.rehearsalRequired || form.soundCheckRequired || form.hospitalityRequired ? 1 : 0)}. Financial & Legal Terms</h3>
          <p className="mt-4 text-neutral-700"><span className="font-semibold text-neutral-900">Late Payment Penalty:</span> {form.latePaymentPenalty}</p>
          <p className="mt-4 text-neutral-700"><span className="font-semibold text-neutral-900">Cancellation Fees:</span> {form.cancellationFee}</p>
          {form.insuranceRequired && <p className="mt-4 text-neutral-700"><span className="font-semibold text-neutral-900">Insurance:</span> {form.insuranceDetails}</p>}
          <p className="mt-4 text-neutral-700"><span className="font-semibold text-neutral-900">Governing Law:</span> {form.governingLaw}</p>
          <p className="mt-4 text-neutral-700"><span className="font-semibold text-neutral-900">Dispute Resolution:</span> {form.disputeResolution}</p>
        </section>

        {(form.imageUsageAllowed || form.merchandiseSalesAllowed) && (
          <section className="border-b border-neutral-300 pb-12 break-after-avoid">
          <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">{10 + sectionOffset + additionalOffset + (form.rehearsalRequired || form.soundCheckRequired || form.hospitalityRequired ? 1 : 0) + (form.technicalRiderRequired ? 1 : 0)}. Rights & Usage</h3>
            {form.imageUsageAllowed && <p className="mt-4 text-neutral-700"><span className="font-semibold text-neutral-900">Image Usage:</span> {form.imageUsageTerms}</p>}
            {form.merchandiseSalesAllowed && <p className="mt-4 text-neutral-700"><span className="font-semibold text-neutral-900">Merchandise Sales:</span> {form.merchandiseTerms}</p>}
          </section>
        )}

        {form.accommodationRequired && (
          <section className="border-b border-neutral-300 pb-12 break-after-avoid">
            <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">{10 + sectionOffset + additionalOffset + (form.rehearsalRequired || form.soundCheckRequired || form.hospitalityRequired ? 1 : 0) + (form.technicalRiderRequired ? 1 : 0) + (form.imageUsageAllowed || form.merchandiseSalesAllowed ? 1 : 0)}. Accommodation</h3>
            <p className="text-neutral-700">{form.accommodationDetails}</p>
          </section>
        )}

        {form.perDiemRequired && (
          <section className="border-b border-neutral-300 pb-12 break-after-avoid">
            <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">{10 + sectionOffset + additionalOffset + (form.rehearsalRequired || form.soundCheckRequired || form.hospitalityRequired ? 1 : 0) + (form.technicalRiderRequired ? 1 : 0) + (form.imageUsageAllowed || form.merchandiseSalesAllowed ? 1 : 0) + (form.accommodationRequired ? 1 : 0)}. Per Diem & Expenses</h3>
            <p className="text-neutral-700">{form.perDiemDetails}</p>
          </section>
        )}

        {form.publicityTermsRequired && (
          <section className="border-b border-neutral-300 pb-12 break-after-avoid">
            <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">{10 + sectionOffset + additionalOffset + (form.rehearsalRequired || form.soundCheckRequired || form.hospitalityRequired ? 1 : 0) + (form.technicalRiderRequired ? 1 : 0) + (form.imageUsageAllowed || form.merchandiseSalesAllowed ? 1 : 0) + (form.accommodationRequired ? 1 : 0) + (form.perDiemRequired ? 1 : 0)}. Credit & Publicity</h3>
            <p className="text-neutral-700">{form.publicityTerms}</p>
          </section>
        )}

        {(form.securityRequired || form.parkingProvided) && (
          <section className="border-b border-neutral-300 pb-12 break-after-avoid">
            <h3 className="font-bold text-xl sm:text-2xl text-neutral-900 pl-0 mb-6 tracking-tight font-display">{10 + sectionOffset + additionalOffset + (form.rehearsalRequired || form.soundCheckRequired || form.hospitalityRequired ? 1 : 0) + (form.technicalRiderRequired ? 1 : 0) + (form.imageUsageAllowed || form.merchandiseSalesAllowed ? 1 : 0) + (form.accommodationRequired ? 1 : 0) + (form.perDiemRequired ? 1 : 0) + (form.publicityTermsRequired ? 1 : 0)}. Operational Details</h3>
            {form.guestListCount && <p className="mt-4 text-neutral-700"><span className="font-semibold text-neutral-900">Guest List:</span> {form.guestListCount} complimentary tickets</p>}
            {form.securityRequired && <p className="mt-4 text-neutral-700"><span className="font-semibold text-neutral-900">Security:</span> {form.securityDetails}</p>}
            {form.parkingProvided && <p className="mt-4 text-neutral-700"><span className="font-semibold text-neutral-900">Parking:</span> {form.parkingDetails}</p>}
          </section>
        )}

        <section className="mt-8 sm:mt-12 lg:mt-16 break-inside-avoid">
          <h3 className="font-bold text-base sm:text-lg lg:text-xl lg:text-2xl text-neutral-900 pl-0 mb-6 sm:mb-8 lg:mb-12 tracking-tight font-display">{10 + sectionOffset + additionalOffset + (form.rehearsalRequired || form.soundCheckRequired || form.hospitalityRequired ? 1 : 0) + (form.technicalRiderRequired ? 1 : 0) + (form.imageUsageAllowed || form.merchandiseSalesAllowed ? 1 : 0) + (form.accommodationRequired ? 1 : 0) + (form.perDiemRequired ? 1 : 0) + (form.publicityTermsRequired ? 1 : 0) + (form.securityRequired || form.parkingProvided ? 1 : 0)}. Signatures</h3>
          <div className="mt-8 sm:mt-12 lg:mt-16 grid gap-6 sm:gap-8 lg:gap-12 sm:gap-16 grid-cols-1 sm:grid-cols-2">
            <div className="border-2 border-neutral-300 rounded-lg p-4 sm:p-6 lg:p-8 min-h-[200px] sm:min-h-[240px] lg:min-h-[280px] bg-white shadow-sm">
              <div className="h-20 sm:h-24 lg:h-28 border-b border-dashed border-neutral-400 flex items-end justify-center mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-4">
                {form.artistSignature ? (
                  <span className="font-serif text-lg sm:text-xl lg:text-2xl text-neutral-900 italic tracking-wide break-words">
                    {form.artistSignature}
                  </span>
                ) : (
                  <span className="text-neutral-400 italic text-[10px] sm:text-xs lg:text-sm">Signature</span>
                )}
              </div>
              <div className="space-y-1 sm:space-y-2 px-1 sm:px-2">
                <p className="text-[10px] sm:text-xs lg:text-sm font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-300 pb-1 sm:pb-2 break-words">
                  {form.artistSignerName || "Artist Signer Name"}
                </p>
                {form.artistSignerTitle && (
                  <p className="text-[10px] sm:text-xs lg:text-xs font-semibold text-neutral-600 uppercase tracking-wide break-words">
                    {form.artistSignerTitle}
                  </p>
                )}
                <p className="text-[10px] sm:text-xs lg:text-xs text-neutral-500 uppercase tracking-wider mt-2 sm:mt-3">
                  Artist
                </p>
                <p className="text-[10px] sm:text-xs lg:text-sm text-neutral-700 mt-1 sm:mt-2 break-words">
                  Date: {form.signedDate || "____________________"}
                </p>
              </div>
            </div>
            <div className="border-2 border-neutral-300 rounded-lg p-4 sm:p-6 lg:p-8 min-h-[200px] sm:min-h-[240px] lg:min-h-[280px] bg-white shadow-sm">
              <div className="h-20 sm:h-24 lg:h-28 border-b border-dashed border-neutral-400 flex items-end justify-center mb-4 sm:mb-6 lg:mb-8 px-2 sm:px-4">
                {form.clientSignature ? (
                  <span className="font-serif text-lg sm:text-xl lg:text-2xl text-neutral-900 italic tracking-wide break-words">
                    {form.clientSignature}
                  </span>
                ) : (
                  <span className="text-neutral-400 italic text-[10px] sm:text-xs lg:text-sm">Signature</span>
                )}
              </div>
              <div className="space-y-1 sm:space-y-2 px-1 sm:px-2">
                <p className="text-[10px] sm:text-xs lg:text-sm font-bold text-neutral-900 uppercase tracking-wider border-b border-neutral-300 pb-1 sm:pb-2 break-words">
                  {form.clientSignerName || "Client Signer Name"}
                </p>
                {form.clientSignerTitle && (
                  <p className="text-[10px] sm:text-xs lg:text-xs font-semibold text-neutral-600 uppercase tracking-wide break-words">
                    {form.clientSignerTitle}
                  </p>
                )}
                <p className="text-[10px] sm:text-xs lg:text-xs text-neutral-500 uppercase tracking-wider mt-2 sm:mt-3">
                  Client
                </p>
                <p className="text-[10px] sm:text-xs lg:text-sm text-neutral-700 mt-1 sm:mt-2 break-words">
                  Date: {form.signedDate || "____________________"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <footer className="mt-16 pt-8 border-t border-neutral-300 flex justify-between items-center print:fixed print:bottom-0 print:left-0 print:right-0 print:border-t print:border-neutral-300 print:bg-white print:px-14 print:py-4">
        <p className="text-xs text-neutral-400 uppercase tracking-[0.18em]">
          This agreement is legally binding upon signature by both parties
        </p>
        <p className="text-xs text-neutral-500 font-sans">
          Page <span className="font-semibold">1</span> of <span className="font-semibold">{estimatedPages}</span>
        </p>
      </footer>
    </article>
  );
}
