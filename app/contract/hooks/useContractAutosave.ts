import { useEffect, useRef } from "react";
import { supabase } from "../../utils/supabaseClient";

interface ArtistWorkspace {
  id: string;
}

interface ContractForm {
  [key: string]: any;
}

interface UseContractAutosaveProps {
  form: ContractForm;
  draftId: string | null;
  workspace: ArtistWorkspace | null;
  hasLoadedDraft: boolean;
  skipNextAutosaveRef: React.MutableRefObject<boolean>;
  skipRefreshRef: React.MutableRefObject<boolean>;
  setSaveStatus: (status: string) => void;
  setDraftId: (id: string | null) => void;
  getErrorMessage: (error: any, context: string) => string;
  refreshRecentContracts: () => void;
  saveContractVersion: (contractId: string, contractData: ContractForm) => void;
}

export function useContractAutosave({
  form,
  draftId,
  workspace,
  hasLoadedDraft,
  skipNextAutosaveRef,
  skipRefreshRef,
  setSaveStatus,
  setDraftId,
  getErrorMessage,
  refreshRecentContracts,
  saveContractVersion,
}: UseContractAutosaveProps) {
  const versionSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedFormRef = useRef<string>("");

  useEffect(() => {
    if (!supabase || !hasLoadedDraft || !workspace) {
      return;
    }

    if (skipNextAutosaveRef.current) {
      skipNextAutosaveRef.current = false;
      return;
    }

    setSaveStatus("Saving draft...");
    const supabaseClient = supabase;

    const timeoutId = window.setTimeout(async () => {
      const payload = {
        workspace_id: workspace.id,
        artist_name: form.artistName,
        artist_email: form.artistEmail,
        artist_logo: form.artistLogo || null,
        booking_preset: form.bookingPreset,
        contract_status: form.contractStatus,
        client_name: form.clientName,
        representative_name: form.representativeName,
        email: form.email,
        phone: form.phoneNumber,
        event_name: form.eventName,
        event_dates: form.eventDates,
        venue: form.venueLocation,
        services: form.services,
        total_fee: Number(form.totalFee) || 0,
        deposit_percentage: form.depositPercentage !== "" ? Number(form.depositPercentage) : 50,
        travel_required: form.travelRequired,
        deposit_terms: form.depositTerms,
        travel_terms: form.travelTerms,
        cancellation_terms: form.cancellationTerms,
        technical_requirements: form.technicalRequirements,
        performance_duration: form.performanceDuration || null,
        payment_method: form.paymentMethod || null,
        date_of_agreement: form.dateOfAgreement || null,
        media_rights_allowed: form.mediaRightsAllowed,
        media_rights_terms: form.mediaRightsTerms,
        force_majeure_included: form.forceMajeureIncluded,
        force_majeure_terms: form.forceMajeureTerms,
        independent_contractor_clause: form.independentContractorClause,
        artist_signer_name: form.artistSignerName,
        client_signer_name: form.clientSignerName,
        artist_signer_title: form.artistSignerTitle,
        client_signer_title: form.clientSignerTitle,
        artist_signature: form.artistSignature,
        client_signature: form.clientSignature,
        signed_date: form.signedDate || null,
        delivery_subject: form.deliverySubject,
        delivery_message: form.deliveryMessage,
        invoice_number: form.invoiceNumber,
        invoice_date: form.invoiceDate || null,
        invoice_status: form.invoiceStatus,
        invoice_due_date: form.invoiceDueDate || null,
        invoice_notes: form.invoiceNotes,
        status: form.contractStatus.toLowerCase(),
        rehearsal_required: form.rehearsalRequired,
        rehearsal_details: form.rehearsalDetails,
        sound_check_required: form.soundCheckRequired,
        sound_check_details: form.soundCheckDetails,
        hospitality_required: form.hospitalityRequired,
        hospitality_details: form.hospitalityDetails,
        late_payment_penalty: form.latePaymentPenalty,
        cancellation_fee: form.cancellationFee,
        insurance_required: form.insuranceRequired,
        insurance_details: form.insuranceDetails,
        image_usage_allowed: form.imageUsageAllowed,
        image_usage_terms: form.imageUsageTerms,
        merchandise_sales_allowed: form.merchandiseSalesAllowed,
        merchandise_terms: form.merchandiseTerms,
        guest_list_count: form.guestListCount,
        security_required: form.securityRequired,
        security_details: form.securityDetails,
        parking_provided: form.parkingProvided,
        parking_details: form.parkingDetails,
        governing_law: form.governingLaw,
        dispute_resolution: form.disputeResolution,
      };

      if (draftId) {
        const { error } = await supabaseClient
          .from("contracts")
          .update(payload)
          .eq("id", draftId)
          .eq("workspace_id", workspace.id);

        setSaveStatus(error ? getErrorMessage(error, "save") : "Draft saved");
        if (error) {
          console.error("Autosave error:", error);
        }
        if (!error) {
          saveContractVersion(draftId, form);
          if (!skipRefreshRef.current) {
            refreshRecentContracts();
          }
        }
        return;
      }

      const { data, error } = await supabaseClient
        .from("contracts")
        .insert(payload)
        .select("id")
        .single();

      if (error) {
        setSaveStatus(getErrorMessage(error, "save"));
        console.error("Autosave insert error:", error);
        return;
      }

      setDraftId(data.id);
      setSaveStatus("Draft saved");
      if (!skipRefreshRef.current) {
        refreshRecentContracts();
      }
    }, 700);

    return () => clearTimeout(timeoutId);
  }, [form, draftId, workspace, hasLoadedDraft, skipNextAutosaveRef, skipRefreshRef, setSaveStatus, setDraftId, getErrorMessage, refreshRecentContracts, saveContractVersion]);

  return {
    versionSaveTimeoutRef,
    lastSavedFormRef,
  };
}
