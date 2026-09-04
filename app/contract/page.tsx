"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabaseClient";
import { DEFAULT_LEGAL_TEXT, ContractForm, ContractStatus } from "./types/contract";
import ContractPreview from "./components/ContractPreview";
import { downloadPdf } from "./utils/pdf";
import { generateCalendarEvent } from "./utils/calendar";

const services = ["Live Vocals", "Lead Vocals", "Supporting Vocals", "Studio Vocals", "Rehearsals", "Touring Support"];
const statuses: ContractStatus[] = ["Draft", "Ready", "Sent", "Signed"];
const presets = [
  { label: "Standard Gig", services: ["Live Vocals", "Lead Vocals"], fee: "1200", deposit: "50", duration: "2 sets of 45 minutes", travel: false, rehearsal: false },
  { label: "Live Performance", services: ["Live Vocals", "Lead Vocals", "Supporting Vocals"], fee: "1500", deposit: "50", duration: "2 sets of 45 minutes", travel: true, rehearsal: false },
  { label: "Studio Session", services: ["Studio Vocals", "Lead Vocals", "Supporting Vocals"], fee: "500", deposit: "100", duration: "4 hours", travel: false, rehearsal: false },
  { label: "Touring", services: ["Touring Support", "Live Vocals", "Supporting Vocals"], fee: "3000", deposit: "30", duration: "Full tour duration", travel: true, rehearsal: true },
  { label: "Backing Vocals", services: ["Supporting Vocals", "Rehearsals"], fee: "800", deposit: "50", duration: "1 set of 60 minutes", travel: false, rehearsal: true },
  { label: "Rehearsal Package", services: ["Rehearsals", "Lead Vocals", "Supporting Vocals"], fee: "600", deposit: "100", duration: "3 sessions of 2 hours", travel: false, rehearsal: true },
];

const initialForm: ContractForm = {
  artistName: "", artistEmail: "", artistLogo: "", clientName: "", email: "", phoneNumber: "", representativeName: "",
  eventName: "", eventDates: new Date().toISOString().slice(0, 10), venueLocation: "", dateOfAgreement: new Date().toISOString().slice(0, 10),
  contractStatus: "Draft", totalFee: "", depositPercentage: "50", paymentMethod: "", depositTerms: DEFAULT_LEGAL_TEXT.depositTerms,
  latePaymentPenalty: DEFAULT_LEGAL_TEXT.latePaymentPenalty, cancellationFee: DEFAULT_LEGAL_TEXT.cancellationFee, insuranceRequired: false,
  insuranceDetails: DEFAULT_LEGAL_TEXT.insuranceDetails, services: [], performanceDuration: "", travelRequired: false,
  travelTerms: DEFAULT_LEGAL_TEXT.travelTerms, accommodationRequired: false, accommodationDetails: DEFAULT_LEGAL_TEXT.accommodationDetails,
  perDiemRequired: false, perDiemDetails: DEFAULT_LEGAL_TEXT.perDiemDetails, technicalRiderRequired: false,
  technicalRiderDetails: DEFAULT_LEGAL_TEXT.technicalRiderDetails, technicalRequirements: "", rehearsalRequired: false,
  rehearsalDetails: DEFAULT_LEGAL_TEXT.rehearsalDetails, soundCheckRequired: true, soundCheckDetails: DEFAULT_LEGAL_TEXT.soundCheckDetails,
  hospitalityRequired: false, hospitalityDetails: DEFAULT_LEGAL_TEXT.hospitalityDetails, imageUsageAllowed: false,
  imageUsageTerms: DEFAULT_LEGAL_TEXT.imageUsageTerms, merchandiseSalesAllowed: false, merchandiseTerms: DEFAULT_LEGAL_TEXT.merchandiseTerms,
  mediaRightsAllowed: false, mediaRightsTerms: DEFAULT_LEGAL_TEXT.mediaRightsTerms, publicityTermsRequired: true,
  publicityTerms: DEFAULT_LEGAL_TEXT.publicityTerms, cancellationTerms: DEFAULT_LEGAL_TEXT.cancellationTerms,
  independentContractorClause: DEFAULT_LEGAL_TEXT.independentContractorClause, forceMajeureIncluded: true,
  forceMajeureTerms: DEFAULT_LEGAL_TEXT.forceMajeureTerms, governingLaw: DEFAULT_LEGAL_TEXT.governingLaw,
  disputeResolution: DEFAULT_LEGAL_TEXT.disputeResolution, indemnificationClause: DEFAULT_LEGAL_TEXT.indemnificationClause,
  confidentialityClause: DEFAULT_LEGAL_TEXT.confidentialityClause, equipmentLiabilityClause: DEFAULT_LEGAL_TEXT.equipmentLiabilityClause,
  attorneyFeesClause: DEFAULT_LEGAL_TEXT.attorneyFeesClause, securityRequired: false, securityDetails: DEFAULT_LEGAL_TEXT.securityDetails,
  parkingProvided: true, parkingDetails: DEFAULT_LEGAL_TEXT.parkingDetails, guestListCount: "2", artistSignerName: "",
  artistSignerTitle: "", artistSignature: "", clientSignerName: "", clientSignerTitle: "", clientSignature: "", signedDate: "",
  severabilityClause: DEFAULT_LEGAL_TEXT.severabilityClause, entireAgreementClause: DEFAULT_LEGAL_TEXT.entireAgreementClause,
  electronicSignatureClause: DEFAULT_LEGAL_TEXT.electronicSignatureClause, amendmentClause: DEFAULT_LEGAL_TEXT.amendmentClause,
  waiverClause: DEFAULT_LEGAL_TEXT.waiverClause, governingJurisdiction: DEFAULT_LEGAL_TEXT.governingJurisdiction, bookingPreset: "",
  deliverySubject: "", deliveryMessage: "", invoiceNumber: "", invoiceDate: "", invoiceStatus: "Pending", invoiceDueDate: "", invoiceNotes: "",
};

type ContractRow = Record<string, any> & { id: string; workspace_id: string | null };
type Workspace = { id: string; artist_name: string | null; artist_email: string | null; artist_logo: string | null; share_slug: string };

const rowToForm = (r: ContractRow): ContractForm => {
  const f = { ...initialForm } as any;
  const map: Record<string, string> = {
    artistName: "artist_name", artistEmail: "artist_email", artistLogo: "artist_logo", clientName: "client_name", email: "email", phoneNumber: "phone",
    representativeName: "representative_name", eventName: "event_name", eventDates: "event_dates", venueLocation: "venue", dateOfAgreement: "date_of_agreement",
    contractStatus: "contract_status", totalFee: "total_fee", depositPercentage: "deposit_percentage", paymentMethod: "payment_method", depositTerms: "deposit_terms",
    latePaymentPenalty: "late_payment_penalty", cancellationFee: "cancellation_fee", insuranceRequired: "insurance_required", insuranceDetails: "insurance_details",
    services: "services", performanceDuration: "performance_duration", travelRequired: "travel_required", travelTerms: "travel_terms", accommodationRequired: "accommodation_required",
    accommodationDetails: "accommodation_details", perDiemRequired: "per_diem_required", perDiemDetails: "per_diem_details", technicalRiderRequired: "technical_rider_required",
    technicalRiderDetails: "technical_rider_details", technicalRequirements: "technical_requirements", rehearsalRequired: "rehearsal_required", rehearsalDetails: "rehearsal_details",
    soundCheckRequired: "sound_check_required", soundCheckDetails: "sound_check_details", hospitalityRequired: "hospitality_required", hospitalityDetails: "hospitality_details",
    imageUsageAllowed: "image_usage_allowed", imageUsageTerms: "image_usage_terms", merchandiseSalesAllowed: "merchandise_sales_allowed", merchandiseTerms: "merchandise_terms",
    mediaRightsAllowed: "media_rights_allowed", mediaRightsTerms: "media_rights_terms", publicityTermsRequired: "publicity_terms_required", publicityTerms: "publicity_terms",
    cancellationTerms: "cancellation_terms", independentContractorClause: "independent_contractor_clause", forceMajeureIncluded: "force_majeure_included", forceMajeureTerms: "force_majeure_terms",
    governingLaw: "governing_law", disputeResolution: "dispute_resolution", indemnificationClause: "indemnification_clause", confidentialityClause: "confidentiality_clause",
    equipmentLiabilityClause: "equipment_liability_clause", attorneyFeesClause: "attorney_fees_clause", securityRequired: "security_required", securityDetails: "security_details",
    parkingProvided: "parking_provided", parkingDetails: "parking_details", guestListCount: "guest_list_count", artistSignerName: "artist_signer_name", artistSignerTitle: "artist_signer_title",
    artistSignature: "artist_signature", clientSignerName: "client_signer_name", clientSignerTitle: "client_signer_title", clientSignature: "client_signature", signedDate: "signed_date",
    bookingPreset: "booking_preset", deliverySubject: "delivery_subject", deliveryMessage: "delivery_message", invoiceNumber: "invoice_number", invoiceDate: "invoice_date",
    invoiceStatus: "invoice_status", invoiceDueDate: "invoice_due_date", invoiceNotes: "invoice_notes",
  };
  Object.entries(map).forEach(([key, column]) => { if (r[column] !== null && r[column] !== undefined) f[key] = r[column]; });
  f.totalFee = r.total_fee !== null && r.total_fee !== undefined ? String(r.total_fee) : "";
  f.depositPercentage = r.deposit_percentage !== null && r.deposit_percentage !== undefined ? String(r.deposit_percentage) : "50";
  f.contractStatus = (r.contract_status || r.status || "Draft") as ContractStatus;
  return f as ContractForm;
};

function Field({ label, value, onChange, type = "text", placeholder, error }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; error?: string }) {
  return <label className="block"><span className="mb-2 block text-[13px] font-medium text-neutral-700">{label}</span><input type={type} value={value} placeholder={placeholder} onChange={e => onChange(e.target.value)} className={`block w-full rounded-xl border bg-white px-3.5 py-3 text-sm text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10 ${error ? "border-red-400" : "border-neutral-200"}`} />{error && <span className="mt-1 block text-xs text-red-600">{error}</span>}</label>;
}
function TextField({ label, value, onChange, reset }: { label: string; value: string; onChange: (v: string) => void; reset?: () => void }) {
  return <label className="block"><div className="mb-2 flex items-center justify-between"><span className="text-[13px] font-medium text-neutral-700">{label}</span>{reset && <button type="button" onClick={reset} className="text-[11px] font-medium text-neutral-400 hover:text-neutral-900">Reset</button>}</div><textarea value={value} onChange={e => onChange(e.target.value)} rows={4} className="block w-full resize-y rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm leading-6 text-neutral-900 outline-none transition focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/10" /></label>;
}
function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex w-full items-center justify-between py-3 text-left"><span className="text-sm font-medium text-neutral-800">{label}</span><span className={`relative h-6 w-11 rounded-full transition ${checked ? "bg-neutral-900" : "bg-neutral-200"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${checked ? "left-6" : "left-1"}`} /></span></button>;
}

export default function ContractPage() {
  const router = useRouter();
  const [form, setForm] = useState<ContractForm>(initialForm);
  const [workspace, setWorkspace] = useState<Workspace | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [recent, setRecent] = useState<ContractRow[]>([]);
  const [tab, setTab] = useState("event");
  const [preview, setPreview] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [saveState, setSaveState] = useState("Local draft");
  const [toast, setToast] = useState("");
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const previewRef = useRef<HTMLDivElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const update = useCallback((key: keyof ContractForm, value: any) => setForm(prev => ({ ...prev, [key]: value })), []);

  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user || null);
      if (!data.user) router.push("/login");
    });
  }, [router]);

  useEffect(() => {
    if (!supabase || !user) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase.from("artist_workspaces").select("*").eq("owner_user_id", user.id).maybeSingle<Workspace>();
      if (cancelled) return;
      if (data) setWorkspace(data);
      else {
        const name = user.email?.split("@")[0] || "Artist";
        const { data: created } = await supabase.from("artist_workspaces").insert({ owner_user_id: user.id, artist_name: name, artist_email: user.email, share_slug: `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Math.random().toString(36).slice(2, 7)}` }).select("*").single<Workspace>();
        if (created) setWorkspace(created);
      }
    })();
    return () => { cancelled = true; };
  }, [user]);

  const refreshRecent = useCallback(async () => {
    if (!supabase || !workspace) return;
    const { data } = await supabase.from("contracts").select("*").eq("workspace_id", workspace.id).order("created_at", { ascending: false }).limit(12);
    if (data) setRecent(data as ContractRow[]);
  }, [workspace]);

  useEffect(() => {
    if (!supabase || !workspace) return;
    (async () => {
      const { data } = await supabase.from("contracts").select("*").eq("workspace_id", workspace.id).order("created_at", { ascending: false }).limit(1).maybeSingle<ContractRow>();
      if (data) { setDraftId(data.id); setForm(rowToForm(data)); setSaveState("Latest draft loaded"); }
      else { setForm(prev => ({ ...prev, artistName: workspace.artist_name || "", artistEmail: workspace.artist_email || "", artistLogo: workspace.artist_logo || "" })); }
      refreshRecent();
    })();
  }, [workspace, refreshRecent]);

  const payload = useMemo(() => {
    const f: any = form;
    return {
      workspace_id: workspace?.id, artist_name: f.artistName, artist_email: f.artistEmail, artist_logo: f.artistLogo || null, booking_preset: f.bookingPreset,
      contract_status: f.contractStatus, status: String(f.contractStatus).toLowerCase(), client_name: f.clientName, representative_name: f.representativeName, email: f.email, phone: f.phoneNumber,
      event_name: f.eventName, event_dates: f.eventDates, venue: f.venueLocation, services: f.services, total_fee: Number(f.totalFee) || 0, deposit_percentage: Number(f.depositPercentage) || 0,
      travel_required: f.travelRequired, deposit_terms: f.depositTerms, travel_terms: f.travelTerms, cancellation_terms: f.cancellationTerms, technical_requirements: f.technicalRequirements,
      performance_duration: f.performanceDuration || null, payment_method: f.paymentMethod || null, date_of_agreement: f.dateOfAgreement || null, media_rights_allowed: f.mediaRightsAllowed, media_rights_terms: f.mediaRightsTerms,
      force_majeure_included: f.forceMajeureIncluded, force_majeure_terms: f.forceMajeureTerms, independent_contractor_clause: f.independentContractorClause, artist_signer_name: f.artistSignerName,
      client_signer_name: f.clientSignerName, artist_signer_title: f.artistSignerTitle, client_signer_title: f.clientSignerTitle, artist_signature: f.artistSignature, client_signature: f.clientSignature, signed_date: f.signedDate || null,
      delivery_subject: f.deliverySubject, delivery_message: f.deliveryMessage, invoice_number: f.invoiceNumber, invoice_date: f.invoiceDate || null, invoice_status: f.invoiceStatus, invoice_due_date: f.invoiceDueDate || null, invoice_notes: f.invoiceNotes,
      rehearsal_required: f.rehearsalRequired, rehearsal_details: f.rehearsalDetails, sound_check_required: f.soundCheckRequired, sound_check_details: f.soundCheckDetails, hospitality_required: f.hospitalityRequired, hospitality_details: f.hospitalityDetails,
      late_payment_penalty: f.latePaymentPenalty, cancellation_fee: f.cancellationFee, insurance_required: f.insuranceRequired, insurance_details: f.insuranceDetails, image_usage_allowed: f.imageUsageAllowed, image_usage_terms: f.imageUsageTerms,
      merchandise_sales_allowed: f.merchandiseSalesAllowed, merchandise_terms: f.merchandiseTerms, guest_list_count: f.guestListCount, security_required: f.securityRequired, security_details: f.securityDetails, parking_provided: f.parkingProvided,
      parking_details: f.parkingDetails, governing_law: f.governingLaw, dispute_resolution: f.disputeResolution, indemnification_clause: f.indemnificationClause, confidentiality_clause: f.confidentialityClause,
      equipment_liability_clause: f.equipmentLiabilityClause, attorney_fees_clause: f.attorneyFeesClause, technical_rider_required: f.technicalRiderRequired, technical_rider_details: f.technicalRiderDetails,
      accommodation_required: f.accommodationRequired, accommodation_details: f.accommodationDetails, per_diem_required: f.perDiemRequired, per_diem_details: f.perDiemDetails, publicity_terms_required: f.publicityTermsRequired, publicity_terms: f.publicityTerms,
    };
  }, [form, workspace]);

  useEffect(() => {
    if (!supabase || !workspace || !draftId) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaveState("Unsaved changes");
    saveTimer.current = setTimeout(async () => {
      setSaveState("Saving…");
      const { error } = await supabase.from("contracts").update(payload).eq("id", draftId).eq("workspace_id", workspace.id);
      setSaveState(error ? "Save failed" : "Saved just now");
      if (!error) refreshRecent();
    }, 700);
    return () => { if (saveTimer.current) clearTimeout(saveTimer.current); };
  }, [payload, draftId, workspace, refreshRecent]);

  const validate = () => {
    const e: Record<string, string> = {};
    (["artistName", "artistEmail", "clientName", "email", "eventName", "eventDates", "venueLocation", "totalFee"] as const).forEach(k => { if (!String((form as any)[k] || "").trim()) e[k] = "Required"; });
    if (form.services.length === 0) e.services = "Select at least one service";
    if (form.artistEmail && !/^\S+@\S+\.\S+$/.test(form.artistEmail)) e.artistEmail = "Enter a valid email";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    setErrors(e); return Object.keys(e).length === 0;
  };

  const saveNow = async () => {
    if (!supabase || !workspace) { notify("Sign in and open a workspace to save"); return; }
    setBusy(true); setSaveState("Saving…");
    let id = draftId;
    if (id) {
      const { error } = await supabase.from("contracts").update(payload).eq("id", id).eq("workspace_id", workspace.id);
      if (error) notify(error.message); else setSaveState("Saved just now");
    } else {
      const { data, error } = await supabase.from("contracts").insert(payload).select("*").single<ContractRow>();
      if (error) notify(error.message); else if (data) { id = data.id; setDraftId(data.id); setSaveState("Saved just now"); }
    }
    await refreshRecent(); setBusy(false); return id;
  };

  const newContract = () => { setDraftId(null); setForm({ ...initialForm, artistName: workspace?.artist_name || "", artistEmail: workspace?.artist_email || "", artistLogo: workspace?.artist_logo || "" }); setErrors({}); setSaveState("New draft"); setTab("event"); notify("New contract ready"); };
  const applyPreset = (label: string) => { const p = presets.find(x => x.label === label); if (!p) return; setForm(f => ({ ...f, bookingPreset: label, services: p.services, totalFee: p.fee, depositPercentage: p.deposit, performanceDuration: p.duration, travelRequired: p.travel, rehearsalRequired: p.rehearsal })); };
  const loadContract = (r: ContractRow) => { setDraftId(r.id); setForm(rowToForm(r)); setErrors({}); setSaveState("Contract loaded"); setTab("event"); setPreview(false); notify("Contract loaded"); };
  const download = async () => { if (!validate()) { notify("Complete the required fields first"); setPreview(true); return; } await downloadPdf(previewRef, form.eventName || "vocal-performance-agreement", notify, (e: any) => e?.message || "PDF export failed", setBusy); };
  const calendar = () => generateCalendarEvent({ eventName: form.eventName || "Performance", eventDates: form.eventDates, clientName: form.clientName || "Client", artistName: form.artistName || "Vocalist", showToast: notify, getErrorMessage: (e: any) => e?.message || "Calendar export failed" });
  const share = async () => { const id = draftId || await saveNow(); if (!id) return; const link = `${window.location.origin}/contract/share/${id}`; await navigator.clipboard.writeText(link); notify("Share link copied"); };
  const logout = async () => { await supabase?.auth.signOut(); router.push("/login"); };

  const filtered = recent.filter(r => { const status = r.contract_status || r.status || "Draft"; const q = search.toLowerCase(); return (statusFilter === "All" || status.toLowerCase() === statusFilter.toLowerCase()) && (!q || `${r.client_name || ""} ${r.event_name || ""} ${status}`.toLowerCase().includes(q)); });
  const required = ["artistName", "artistEmail", "clientName", "email", "eventName", "eventDates", "venueLocation", "totalFee"] as const;
  const readiness = Math.round(((required.filter(k => String((form as any)[k] || "").trim()).length + (form.services.length ? 1 : 0)) / 9) * 100);

  const Section = ({ title, children, description }: { title: string; children: React.ReactNode; description?: string }) => <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 className="text-base font-semibold tracking-tight text-neutral-950">{title}</h2>{description && <p className="mt-1 text-xs leading-5 text-neutral-500">{description}</p>}</div>{children}</section>;
  const tabs = [{ id: "event", label: "Event" }, { id: "services", label: "Services" }, { id: "payment", label: "Payment" }, { id: "requirements", label: "Requirements" }, { id: "legal", label: "Legal" }, { id: "logistics", label: "Logistics" }, { id: "final", label: "Finalize" }];

  return <main className="min-h-screen bg-[#f7f7f5] text-neutral-950">
    <header className="sticky top-0 z-40 border-b border-neutral-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3"><button type="button" onClick={() => router.push("/dashboard")} className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white hover:bg-neutral-50" aria-label="Back to dashboard">←</button><div><div className="text-sm font-semibold tracking-tight">Contract</div><div className="text-[11px] text-neutral-500">{workspace?.artist_name || user?.email || "Workspace"}</div></div></div>
        <div className="hidden items-center gap-3 md:flex"><span className="text-xs text-neutral-500">{saveState}</span><span className="h-1.5 w-1.5 rounded-full bg-neutral-300" /><button type="button" onClick={newContract} className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-medium hover:bg-neutral-50">New</button><button type="button" onClick={download} disabled={busy} className="rounded-lg bg-neutral-950 px-3.5 py-2 text-xs font-semibold text-white hover:bg-neutral-800 disabled:opacity-50">Export PDF</button><button type="button" onClick={logout} className="rounded-lg px-3 py-2 text-xs font-medium text-neutral-500 hover:bg-neutral-100">Sign out</button></div>
      </div>
    </header>

    <div className="mx-auto max-w-[1500px] px-4 py-5 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between"><div><p className="text-xs font-semibold uppercase tracking-[.16em] text-neutral-400">Booking workspace</p><h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">Build your agreement</h1><p className="mt-1 max-w-xl text-sm text-neutral-500">A cleaner contract workflow. Enter only what matters, preview the agreement, and keep the saved record synchronized.</p></div><div className="w-full max-w-xs rounded-xl border border-neutral-200 bg-white p-3 shadow-sm"><div className="mb-2 flex justify-between text-xs font-medium"><span>Readiness</span><span>{readiness}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-neutral-100"><div className="h-full rounded-full bg-neutral-900 transition-all" style={{ width: `${readiness}%` }} /></div></div></div>

      <div className="mb-5 flex gap-2 overflow-x-auto rounded-xl border border-neutral-200 bg-white p-1.5 shadow-sm">{tabs.map(t => <button key={t.id} type="button" onClick={() => setTab(t.id)} className={`whitespace-nowrap rounded-lg px-3.5 py-2 text-xs font-medium transition ${tab === t.id ? "bg-neutral-950 text-white" : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"}`}>{t.label}</button>)}<button type="button" onClick={() => setPreview(v => !v)} className="ml-auto hidden whitespace-nowrap rounded-lg border border-neutral-200 px-3.5 py-2 text-xs font-medium lg:block">{preview ? "Hide preview" : "Show preview"}</button></div>

      <div className={`grid items-start gap-5 ${preview ? "xl:grid-cols-[minmax(0,1fr)_minmax(420px,560px)]" : "xl:grid-cols-[minmax(0,920px)_320px]"}`}>
        <div className="min-w-0 space-y-5">
          {tab === "event" && <><Section title="Who is this agreement for?" description="The parties and engagement details used throughout the contract."><div className="grid gap-4 sm:grid-cols-2"><Field label="Artist / stage name" value={form.artistName} onChange={v => update("artistName", v)} error={errors.artistName} /><Field label="Artist email" type="email" value={form.artistEmail} onChange={v => update("artistEmail", v)} error={errors.artistEmail} /><Field label="Client / organization" value={form.clientName} onChange={v => update("clientName", v)} error={errors.clientName} /><Field label="Primary contact" value={form.representativeName} onChange={v => update("representativeName", v)} /><Field label="Client email" type="email" value={form.email} onChange={v => update("email", v)} error={errors.email} /><Field label="Phone" type="tel" value={form.phoneNumber} onChange={v => update("phoneNumber", v)} /></div></Section><Section title="Event details"><div className="grid gap-4 sm:grid-cols-2"><Field label="Event / project name" value={form.eventName} onChange={v => update("eventName", v)} error={errors.eventName} /><Field label="Event date(s)" value={form.eventDates} onChange={v => update("eventDates", v)} error={errors.eventDates} /><Field label="Venue / location" value={form.venueLocation} onChange={v => update("venueLocation", v)} error={errors.venueLocation} /><Field label="Performance duration" value={form.performanceDuration} onChange={v => update("performanceDuration", v)} /><label className="block"><span className="mb-2 block text-[13px] font-medium text-neutral-700">Booking preset</span><select value={form.bookingPreset} onChange={e => applyPreset(e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-neutral-900"><option value="">Choose a starting point</option>{presets.map(p => <option key={p.label}>{p.label}</option>)}</select></label><label className="block"><span className="mb-2 block text-[13px] font-medium text-neutral-700">Contract status</span><select value={form.contractStatus} onChange={e => update("contractStatus", e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm outline-none focus:border-neutral-900">{statuses.map(s => <option key={s}>{s}</option>)}</select></label></div></Section></>}

          {tab === "services" && <Section title="What is being booked?" description="Select the services that belong in this agreement."><div className="grid gap-3 sm:grid-cols-2">{services.map(service => { const active = form.services.includes(service); return <button key={service} type="button" onClick={() => update("services", active ? form.services.filter(s => s !== service) : [...form.services, service])} className={`flex min-h-[72px] items-center justify-between rounded-xl border px-4 text-left transition ${active ? "border-neutral-950 bg-neutral-950 text-white shadow-md" : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400 hover:bg-neutral-50"}`}><span><span className="block text-sm font-semibold">{service}</span><span className={`mt-1 block text-xs ${active ? "text-neutral-300" : "text-neutral-400"}`}>{active ? "Included in agreement" : "Click to add"}</span></span><span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${active ? "border-white/30 bg-white text-neutral-950" : "border-neutral-200"}`}>{active ? "✓" : "+"}</span></button>})}</div>{errors.services && <p className="mt-3 text-xs text-red-600">{errors.services}</p>}<div className="mt-6 rounded-xl bg-neutral-50 p-4"><div className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Selected services</div><div className="mt-2 flex flex-wrap gap-2">{form.services.length ? form.services.map(s => <span key={s} className="rounded-full bg-white px-3 py-1.5 text-xs font-medium shadow-sm ring-1 ring-neutral-200">{s}</span>) : <span className="text-sm text-neutral-400">Nothing selected yet.</span>}</div></div></Section>}

          {tab === "payment" && <><Section title="Compensation" description="Set the commercial terms for the engagement."><div className="grid gap-4 sm:grid-cols-2"><Field label="Total fee (CAD)" type="number" value={form.totalFee} onChange={v => update("totalFee", v)} error={errors.totalFee} /><Field label="Deposit (%)" type="number" value={form.depositPercentage} onChange={v => update("depositPercentage", v)} /><label className="block"><span className="mb-2 block text-[13px] font-medium text-neutral-700">Payment method</span><select value={form.paymentMethod} onChange={e => update("paymentMethod", e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm outline-none"><option value="">Select method</option>{["E-transfer", "Bank Transfer", "Cheque", "Cash", "Other"].map(x => <option key={x}>{x}</option>)}</select></label><Field label="Agreement date" type="date" value={form.dateOfAgreement} onChange={v => update("dateOfAgreement", v)} /></div></Section><Section title="Payment terms"><div className="space-y-4"><TextField label="Deposit terms" value={form.depositTerms} onChange={v => update("depositTerms", v)} reset={() => update("depositTerms", DEFAULT_LEGAL_TEXT.depositTerms)} /><TextField label="Late payment penalty" value={form.latePaymentPenalty} onChange={v => update("latePaymentPenalty", v)} reset={() => update("latePaymentPenalty", DEFAULT_LEGAL_TEXT.latePaymentPenalty)} /><TextField label="Cancellation fee structure" value={form.cancellationFee} onChange={v => update("cancellationFee", v)} reset={() => update("cancellationFee", DEFAULT_LEGAL_TEXT.cancellationFee)} /></div></Section></>}

          {tab === "requirements" && <><Section title="Performance requirements" description="Only turn on requirements that apply to this booking."><div className="divide-y divide-neutral-100">{[["rehearsalRequired","Rehearsal required"],["soundCheckRequired","Sound check required"],["hospitalityRequired","Hospitality required"],["technicalRiderRequired","Technical rider required"],["insuranceRequired","Insurance required"]].map(([key,label]) => <Toggle key={key} label={label} checked={(form as any)[key]} onChange={v => update(key as keyof ContractForm, v)} />)}</div></Section><Section title="Requirement details"><div className="space-y-4">{form.rehearsalRequired && <TextField label="Rehearsal details" value={form.rehearsalDetails} onChange={v => update("rehearsalDetails", v)} reset={() => update("rehearsalDetails", DEFAULT_LEGAL_TEXT.rehearsalDetails)} />}{form.soundCheckRequired && <TextField label="Sound check details" value={form.soundCheckDetails} onChange={v => update("soundCheckDetails", v)} reset={() => update("soundCheckDetails", DEFAULT_LEGAL_TEXT.soundCheckDetails)} />}{form.hospitalityRequired && <TextField label="Hospitality details" value={form.hospitalityDetails} onChange={v => update("hospitalityDetails", v)} reset={() => update("hospitalityDetails", DEFAULT_LEGAL_TEXT.hospitalityDetails)} />}{form.technicalRiderRequired && <TextField label="Technical rider" value={form.technicalRiderDetails} onChange={v => update("technicalRiderDetails", v)} reset={() => update("technicalRiderDetails", DEFAULT_LEGAL_TEXT.technicalRiderDetails)} />}<TextField label="Technical requirements" value={form.technicalRequirements} onChange={v => update("technicalRequirements", v)} /></div></Section></>}

          {tab === "legal" && <Section title="Legal protections" description="Review the language before sending the agreement. The defaults are editable."><div className="space-y-4">{([["cancellationTerms","Cancellation terms"],["travelTerms","Travel terms"],["independentContractorClause","Independent contractor"],["forceMajeureTerms","Force majeure"],["governingLaw","Governing law"],["disputeResolution","Dispute resolution"],["indemnificationClause","Indemnification"],["confidentialityClause","Confidentiality"],["equipmentLiabilityClause","Equipment liability"],["attorneyFeesClause","Attorney fees"]] as const).map(([key,label]) => <TextField key={key} label={label} value={(form as any)[key] || ""} onChange={v => update(key as keyof ContractForm, v)} />)}</div></Section>}

          {tab === "logistics" && <><Section title="Travel & logistics"><div className="divide-y divide-neutral-100">{[["travelRequired","Travel required"],["accommodationRequired","Accommodation required"],["perDiemRequired","Per diem required"],["parkingProvided","Parking provided"],["securityRequired","Security required"],["imageUsageAllowed","Image usage allowed"],["merchandiseSalesAllowed","Merchandise sales allowed"],["mediaRightsAllowed","Media rights allowed"],["publicityTermsRequired","Publicity terms required"],["forceMajeureIncluded","Force majeure included"]].map(([key,label]) => <Toggle key={key} label={label} checked={(form as any)[key]} onChange={v => update(key as keyof ContractForm, v)} />)}</div></Section><Section title="Logistics details"><div className="space-y-4">{form.travelRequired && <TextField label="Travel terms" value={form.travelTerms} onChange={v => update("travelTerms", v)} />}{form.accommodationRequired && <TextField label="Accommodation" value={form.accommodationDetails} onChange={v => update("accommodationDetails", v)} />}{form.perDiemRequired && <TextField label="Per diem" value={form.perDiemDetails} onChange={v => update("perDiemDetails", v)} />}{form.parkingProvided && <TextField label="Parking" value={form.parkingDetails} onChange={v => update("parkingDetails", v)} />}{form.securityRequired && <TextField label="Security" value={form.securityDetails} onChange={v => update("securityDetails", v)} />}{form.imageUsageAllowed && <TextField label="Image usage terms" value={form.imageUsageTerms} onChange={v => update("imageUsageTerms", v)} />}{form.merchandiseSalesAllowed && <TextField label="Merchandise terms" value={form.merchandiseTerms} onChange={v => update("merchandiseTerms", v)} />}{form.mediaRightsAllowed && <TextField label="Media rights" value={form.mediaRightsTerms} onChange={v => update("mediaRightsTerms", v)} />}{form.publicityTermsRequired && <TextField label="Publicity terms" value={form.publicityTerms} onChange={v => update("publicityTerms", v)} />}</div></Section></>}

          {tab === "final" && <><Section title="Signatures & delivery"><div className="grid gap-4 sm:grid-cols-2"><Field label="Artist signer" value={form.artistSignerName} onChange={v => update("artistSignerName", v)} /><Field label="Artist title" value={form.artistSignerTitle} onChange={v => update("artistSignerTitle", v)} /><Field label="Client signer" value={form.clientSignerName} onChange={v => update("clientSignerName", v)} /><Field label="Client title" value={form.clientSignerTitle} onChange={v => update("clientSignerTitle", v)} /><Field label="Signed date" type="date" value={form.signedDate} onChange={v => update("signedDate", v)} /><Field label="Guest list count" type="number" value={form.guestListCount} onChange={v => update("guestListCount", v)} /></div></Section><Section title="Invoice"><div className="grid gap-4 sm:grid-cols-2"><Field label="Invoice number" value={form.invoiceNumber} onChange={v => update("invoiceNumber", v)} /><Field label="Invoice date" type="date" value={form.invoiceDate} onChange={v => update("invoiceDate", v)} /><Field label="Due date" type="date" value={form.invoiceDueDate} onChange={v => update("invoiceDueDate", v)} /><label><span className="mb-2 block text-[13px] font-medium text-neutral-700">Invoice status</span><select value={form.invoiceStatus} onChange={e => update("invoiceStatus", e.target.value)} className="w-full rounded-xl border border-neutral-200 bg-white px-3.5 py-3 text-sm"><option>Pending</option><option>Paid</option><option>Overdue</option></select></label></div><div className="mt-4"><TextField label="Invoice notes" value={form.invoiceNotes} onChange={v => update("invoiceNotes", v)} /></div></Section><div className="flex flex-wrap gap-2"><button type="button" onClick={saveNow} disabled={busy} className="rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : "Save contract"}</button><button type="button" onClick={share} className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium">Copy share link</button><button type="button" onClick={calendar} className="rounded-xl border border-neutral-200 bg-white px-5 py-3 text-sm font-medium">Add to calendar</button></div></>}
        </div>

        {!preview && <aside className="hidden space-y-4 xl:block"><div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"><div className="mb-3 flex items-center justify-between"><h2 className="text-sm font-semibold">Recent contracts</h2><button type="button" onClick={refreshRecent} className="text-xs text-neutral-400 hover:text-neutral-900">Refresh</button></div><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search…" className="mb-3 w-full rounded-lg border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-neutral-900" /><div className="mb-3 flex gap-1 overflow-x-auto">{["All", "Draft", "Ready", "Sent", "Signed"].map(s => <button key={s} type="button" onClick={() => setStatusFilter(s)} className={`whitespace-nowrap rounded-md px-2 py-1 text-[10px] font-medium ${statusFilter === s ? "bg-neutral-950 text-white" : "bg-neutral-100 text-neutral-500"}`}>{s}</button>)}</div><div className="space-y-1">{filtered.length ? filtered.map(r => <button key={r.id} type="button" onClick={() => loadContract(r)} className={`w-full rounded-lg p-3 text-left transition hover:bg-neutral-50 ${r.id === draftId ? "bg-neutral-50 ring-1 ring-neutral-200" : ""}`}><div className="truncate text-xs font-semibold">{r.client_name || "Untitled client"}</div><div className="mt-0.5 truncate text-[11px] text-neutral-500">{r.event_name || "Untitled event"}</div><div className="mt-2 text-[10px] uppercase tracking-wider text-neutral-400">{r.contract_status || r.status || "Draft"}</div></button>) : <p className="px-2 py-5 text-center text-xs text-neutral-400">No saved contracts.</p>}</div></div><button type="button" onClick={() => setPreview(true)} className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-xs font-semibold shadow-sm hover:bg-neutral-50">Open live preview</button></aside>}

        {preview && <aside className="min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 p-3 shadow-sm"><div className="mb-3 flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Live agreement</span><button type="button" onClick={() => setPreview(false)} className="rounded-lg bg-white px-3 py-1.5 text-xs font-medium shadow-sm">Close</button></div><div className="max-h-[calc(100vh-125px)] overflow-auto rounded-xl bg-white"><ContractPreview form={form} previewRef={previewRef} draftId={draftId} showStandardClauses /></div></aside>}
      </div>
    </div>
    {toast && <div className="fixed bottom-5 left-1/2 z-[80] -translate-x-1/2 rounded-xl bg-neutral-950 px-4 py-3 text-xs font-medium text-white shadow-xl">{toast}</div>}
  </main>;
}
