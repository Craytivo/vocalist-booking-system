import React, { useCallback, useEffect, useMemo, useState } from "react";

interface WizardStep {
  id: number;
  name: string;
  sections: string[];
}

const SERVICES = [
  "Live Vocals",
  "Lead Vocals",
  "Supporting Vocals",
  "Studio Vocals",
  "Rehearsals",
  "Touring Support",
];

const PRESETS = [
  { label: "Standard Gig", fee: "1200", deposit: "50", duration: "2 sets of 45 minutes", services: ["Live Vocals", "Lead Vocals"] },
  { label: "Live Performance", fee: "1500", deposit: "50", duration: "2 sets of 45 minutes, 7pm-10pm", services: ["Live Vocals", "Lead Vocals", "Supporting Vocals"] },
  { label: "Studio Session", fee: "500", deposit: "100", duration: "4 hours", services: ["Studio Vocals", "Lead Vocals", "Supporting Vocals"] },
  { label: "Touring", fee: "3000", deposit: "30", duration: "Full tour duration", services: ["Touring Support", "Live Vocals", "Supporting Vocals"] },
  { label: "Backing Vocals", fee: "800", deposit: "50", duration: "1 set of 60 minutes", services: ["Supporting Vocals", "Rehearsals"] },
  { label: "Rehearsal Package", fee: "600", deposit: "100", duration: "3 sessions of 2 hours", services: ["Rehearsals", "Lead Vocals", "Supporting Vocals"] },
];

const STEPS = [
  { number: 1, title: "Booking", subtitle: "Who and what" },
  { number: 2, title: "Services", subtitle: "What you're providing" },
  { number: 3, title: "Payment", subtitle: "Fee and terms" },
  { number: 4, title: "Logistics", subtitle: "Date, venue and production" },
  { number: 5, title: "Terms", subtitle: "Legal and final details" },
];

const normalize = (value: string) => value.replace(/\s+/g, " ").trim().toLowerCase();

function findControl(labelText: string): HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null {
  const wanted = normalize(labelText);
  const labels = Array.from(document.querySelectorAll("main label"));
  const label = labels.find((node) => {
    const firstSpan = node.querySelector(":scope > span");
    return normalize(firstSpan?.textContent || "") === wanted;
  });
  return label?.querySelector("input, textarea, select") || null;
}

function setNativeValue(control: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, value: string) {
  const prototype = Object.getPrototypeOf(control);
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  descriptor?.set?.call(control, value);
  control.dispatchEvent(new Event(control instanceof HTMLSelectElement ? "change" : "input", { bubbles: true }));
  if (!(control instanceof HTMLSelectElement)) {
    control.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function setField(label: string, value: string) {
  const control = findControl(label);
  if (control) setNativeValue(control, value);
}

function readField(label: string) {
  const control = findControl(label);
  return control?.value || "";
}

function readServiceSelection() {
  return SERVICES.filter((service) => {
    const label = Array.from(document.querySelectorAll("main label")).find(
      (node) => normalize(node.textContent || "") === normalize(service)
    );
    const checkbox = label?.querySelector<HTMLInputElement>('input[type="checkbox"]');
    return !!checkbox?.checked;
  });
}

function setServiceSelection(services: string[]) {
  SERVICES.forEach((service) => {
    const label = Array.from(document.querySelectorAll("main label")).find(
      (node) => normalize(node.textContent || "") === normalize(service)
    );
    const checkbox = label?.querySelector<HTMLInputElement>('input[type="checkbox"]');
    if (checkbox && checkbox.checked !== services.includes(service)) checkbox.click();
  });
}

function money(value: string) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return "$0";
  return number.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });
}

export default function ContractWizard({
  wizardMode: _wizardMode,
  wizardStep: externalWizardStep,
  setWizardStep,
  wizardSteps: _wizardSteps,
}: {
  wizardMode: boolean;
  wizardStep: number;
  setWizardStep: (step: number) => void;
  wizardSteps: WizardStep[];
}) {
  const [step, setStep] = useState(Math.min(Math.max(externalWizardStep || 1, 1), 5));
  const [values, setValues] = useState({
    artist: "",
    artistEmail: "",
    client: "",
    representative: "",
    email: "",
    phone: "",
    event: "",
    date: "",
    venue: "",
    duration: "",
    fee: "",
    deposit: "50",
    paymentMethod: "",
    travel: "",
    cancellation: "",
    preset: "",
  });
  const [services, setServices] = useState<string[]>([]);
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const syncFromLegacyForm = useCallback(() => {
    setValues((current) => ({
      ...current,
      artist: readField("Artist Name"),
      artistEmail: readField("Artist Email"),
      client: readField("Client / Organization Name"),
      representative: readField("Representative Name"),
      email: readField("Email"),
      phone: readField("Phone Number"),
      event: readField("Event / Project Name"),
      date: readField("Event Date(s)"),
      venue: readField("Venue / Location"),
      duration: readField("Performance Duration"),
      fee: readField("Total Fee"),
      deposit: readField("Deposit Percentage (%)") || "50",
      paymentMethod: readField("Payment Method"),
      travel: readField("Travel Terms"),
      cancellation: readField("Cancellation Terms"),
      preset: readField("Booking Preset"),
    }));
    setServices(readServiceSelection());
  }, []);

  useEffect(() => {
    syncFromLegacyForm();
    const interval = window.setInterval(syncFromLegacyForm, 750);
    return () => window.clearInterval(interval);
  }, [syncFromLegacyForm]);

  const update = useCallback((key: keyof typeof values, label: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setField(label, value);
  }, []);

  const goToStep = useCallback((next: number) => {
    const safe = Math.min(Math.max(next, 1), STEPS.length);
    setStep(safe);
    setWizardStep(safe);
    window.setTimeout(() => document.querySelector(".new-contract-workflow")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
  }, [setWizardStep]);

  const applyPreset = (label: string) => {
    const preset = PRESETS.find((item) => item.label === label);
    if (!preset) return;
    setField("Booking Preset", label);
    setField("Total Fee", preset.fee);
    setField("Deposit Percentage (%)", preset.deposit);
    setField("Performance Duration", preset.duration);
    setServiceSelection(preset.services);
    setValues((current) => ({ ...current, preset: label, fee: preset.fee, deposit: preset.deposit, duration: preset.duration }));
    setServices(preset.services);
  };

  const total = Number(values.fee) || 0;
  const deposit = total * ((Number(values.deposit) || 0) / 100);
  const balance = Math.max(total - deposit, 0);
  const completed = useMemo(() => [
    Boolean(values.artist && values.client),
    services.length > 0,
    Boolean(values.fee),
    Boolean(values.event && values.date && values.venue),
    Boolean(values.cancellation),
  ].filter(Boolean).length, [values, services]);

  const fieldClass = "w-full rounded-xl border border-neutral-200 bg-white px-4 py-3.5 text-[15px] text-neutral-950 outline-none transition focus:border-neutral-950 focus:ring-2 focus:ring-neutral-950/10 placeholder:text-neutral-400";
  const labelClass = "mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-neutral-500";

  return (
    <>
      <style>{`
        form.space-y-6:has(.new-contract-workflow) > *:not(.new-contract-workflow) { display: none !important; }
        form.space-y-6:has(.new-contract-workflow) { margin: 0 !important; }
      `}</style>
      <div className="new-contract-workflow -mx-1 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 bg-white px-5 py-5 sm:px-7 sm:py-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-neutral-400">
                <span>New booking</span><span className="h-1 w-1 rounded-full bg-neutral-300" /><span>Step {step} of {STEPS.length}</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-950 sm:text-3xl">Build the booking</h2>
              <p className="mt-1.5 max-w-xl text-sm leading-6 text-neutral-500">Enter the essentials first. Everything else stays out of the way until you need it.</p>
            </div>
            <div className="min-w-[180px]">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-neutral-500"><span>Booking progress</span><span>{Math.round((completed / 5) * 100)}%</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100"><div className="h-full rounded-full bg-neutral-950 transition-all" style={{ width: `${(completed / 5) * 100}%` }} /></div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-5 gap-1.5">
            {STEPS.map((item) => (
              <button key={item.number} type="button" onClick={() => goToStep(item.number)} className={`rounded-xl px-2 py-2.5 text-left transition ${step === item.number ? "bg-neutral-950 text-white" : step > item.number ? "bg-neutral-100 text-neutral-800" : "bg-neutral-50 text-neutral-400 hover:bg-neutral-100"}`}>
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] opacity-70">{item.number}</div>
                <div className="mt-0.5 truncate text-xs font-semibold sm:text-sm">{item.title}</div>
                <div className="mt-0.5 hidden truncate text-[10px] opacity-60 sm:block">{item.subtitle}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-neutral-50/60 px-5 py-6 sm:px-7 sm:py-8">
          {step === 1 && (
            <section className="mx-auto max-w-3xl">
              <div className="mb-6"><h3 className="text-xl font-semibold text-neutral-950">Start with the people</h3><p className="mt-1 text-sm text-neutral-500">Tell us who is performing and who is booking them.</p></div>
              <div className="mb-6 rounded-xl border border-neutral-200 bg-white p-4">
                <label className={labelClass}>Start from a template</label>
                <select value={values.preset} onChange={(e) => applyPreset(e.target.value)} className={fieldClass}>
                  <option value="">Choose a common booking type</option>
                  {PRESETS.map((preset) => <option key={preset.label}>{preset.label}</option>)}
                </select>
                <p className="mt-2 text-xs text-neutral-400">A template fills sensible defaults. You can change anything afterward.</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label><span className={labelClass}>Artist name *</span><input className={fieldClass} value={values.artist} onChange={(e) => update("artist", "Artist Name", e.target.value)} placeholder="Artist or vocalist" /></label>
                <label><span className={labelClass}>Artist email</span><input className={fieldClass} value={values.artistEmail} onChange={(e) => update("artistEmail", "Artist Email", e.target.value)} placeholder="artist@example.com" /></label>
                <label><span className={labelClass}>Client / organization *</span><input className={fieldClass} value={values.client} onChange={(e) => update("client", "Client / Organization Name", e.target.value)} placeholder="Company, church, promoter or client" /></label>
                <label><span className={labelClass}>Primary contact</span><input className={fieldClass} value={values.representative} onChange={(e) => update("representative", "Representative Name", e.target.value)} placeholder="Name of the person booking" /></label>
                <label><span className={labelClass}>Client email</span><input className={fieldClass} value={values.email} onChange={(e) => update("email", "Email", e.target.value)} placeholder="booking@example.com" /></label>
                <label><span className={labelClass}>Phone</span><input className={fieldClass} value={values.phone} onChange={(e) => update("phone", "Phone Number", e.target.value)} placeholder="+1 555 123 4567" /></label>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="mx-auto max-w-3xl">
              <div className="mb-6"><h3 className="text-xl font-semibold text-neutral-950">What is being booked?</h3><p className="mt-1 text-sm text-neutral-500">Select the services that belong in this agreement.</p></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {SERVICES.map((service) => {
                  const selected = services.includes(service);
                  return <button key={service} type="button" onClick={() => { const next = selected ? services.filter((item) => item !== service) : [...services, service]; setServices(next); setServiceSelection(next); }} className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${selected ? "border-neutral-950 bg-neutral-950 text-white" : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400"}`}><span><span className="block text-sm font-semibold">{service}</span><span className={`mt-1 block text-xs ${selected ? "text-neutral-300" : "text-neutral-400"}`}>{service === "Studio Vocals" ? "Recording and session vocals" : service === "Rehearsals" ? "Scheduled rehearsal time" : "Performance or vocal support"}</span></span><span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs ${selected ? "border-white bg-white text-neutral-950" : "border-neutral-300"}`}>{selected ? "✓" : "+"}</span></button>;
                })}
              </div>
              <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5"><label className={labelClass}>Performance description</label><input className={fieldClass} value={values.duration} onChange={(e) => update("duration", "Performance Duration", e.target.value)} placeholder="e.g. 2 sets of 45 minutes, 7pm–10pm" /><p className="mt-2 text-xs text-neutral-400">Keep this practical: duration, sets, hours or scope.</p></div>
            </section>
          )}

          {step === 3 && (
            <section className="mx-auto max-w-3xl">
              <div className="mb-6"><h3 className="text-xl font-semibold text-neutral-950">Set the money</h3><p className="mt-1 text-sm text-neutral-500">The totals update automatically as you build the deal.</p></div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-neutral-200 bg-white p-5"><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">Total fee</div><div className="mt-2 text-2xl font-semibold text-neutral-950">{money(values.fee)}</div></div>
                <div className="rounded-xl border border-neutral-200 bg-white p-5"><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">Deposit</div><div className="mt-2 text-2xl font-semibold text-neutral-950">{money(String(deposit))}</div><div className="mt-1 text-xs text-neutral-400">{values.deposit || 0}%</div></div>
                <div className="rounded-xl border border-neutral-200 bg-white p-5"><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">Balance</div><div className="mt-2 text-2xl font-semibold text-neutral-950">{money(String(balance))}</div></div>
              </div>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <label><span className={labelClass}>Total booking fee *</span><input type="number" min="0" className={fieldClass} value={values.fee} onChange={(e) => update("fee", "Total Fee", e.target.value)} placeholder="1500" /></label>
                <label><span className={labelClass}>Deposit percentage</span><input type="number" min="0" max="100" className={fieldClass} value={values.deposit} onChange={(e) => update("deposit", "Deposit Percentage (%)", e.target.value)} placeholder="50" /></label>
                <label><span className={labelClass}>Payment method</span><select className={fieldClass} value={values.paymentMethod} onChange={(e) => update("paymentMethod", "Payment Method", e.target.value)}><option value="">Select method</option><option>e-Transfer</option><option>Bank transfer</option><option>Cheque</option><option>Cash</option><option>Credit card</option></select></label>
              </div>
              <div className="mt-5 rounded-xl border border-neutral-200 bg-white p-5"><label className={labelClass}>Cancellation / payment terms</label><textarea className={`${fieldClass} min-h-[120px] resize-y`} value={values.cancellation} onChange={(e) => update("cancellation", "Cancellation Terms", e.target.value)} placeholder="When is the deposit due? What happens if either party cancels?" /></div>
            </section>
          )}

          {step === 4 && (
            <section className="mx-auto max-w-3xl">
              <div className="mb-6"><h3 className="text-xl font-semibold text-neutral-950">Lock down the logistics</h3><p className="mt-1 text-sm text-neutral-500">Add the details that make the booking executable.</p></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label><span className={labelClass}>Event / project *</span><input className={fieldClass} value={values.event} onChange={(e) => update("event", "Event / Project Name", e.target.value)} placeholder="Summer concert" /></label>
                <label><span className={labelClass}>Date / dates *</span><input className={fieldClass} value={values.date} onChange={(e) => update("date", "Event Date(s)", e.target.value)} placeholder="October 9, 2026" /></label>
                <label className="sm:col-span-2"><span className={labelClass}>Venue / location *</span><input className={fieldClass} value={values.venue} onChange={(e) => update("venue", "Venue / Location", e.target.value)} placeholder="Venue name, city and province" /></label>
              </div>
              <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5"><div className="flex items-center justify-between gap-4"><div><div className="text-sm font-semibold text-neutral-900">Additional logistics</div><div className="mt-1 text-xs text-neutral-400">Travel, sound, rehearsal, hospitality and technical requirements.</div></div><button type="button" onClick={() => setAdvancedOpen(!advancedOpen)} className="rounded-lg border border-neutral-200 px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50">{advancedOpen ? "Hide" : "Show"}</button></div>{advancedOpen && <div className="mt-5 border-t border-neutral-100 pt-5"><label><span className={labelClass}>Travel arrangements</span><textarea className={`${fieldClass} min-h-[110px] resize-y`} value={values.travel} onChange={(e) => update("travel", "Travel Terms", e.target.value)} placeholder="Transportation, lodging, mileage, meals or other travel requirements" /></label><p className="mt-3 text-xs text-neutral-400">Production and technical requirements remain available in the contract preview and can be completed after the core booking is set.</p></div>}</div>
            </section>
          )}

          {step === 5 && (
            <section className="mx-auto max-w-3xl">
              <div className="mb-6"><h3 className="text-xl font-semibold text-neutral-950">Review and finish</h3><p className="mt-1 text-sm text-neutral-500">Confirm the essentials before moving the contract forward.</p></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[['Artist', values.artist], ['Client', values.client], ['Event', values.event], ['Date', values.date], ['Venue', values.venue], ['Services', services.join(', ') || 'Not selected']].map(([label, value]) => <div key={label} className="rounded-xl border border-neutral-200 bg-white p-4"><div className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400">{label}</div><div className="mt-1 text-sm font-semibold text-neutral-900">{value || 'Not entered'}</div></div>)}
              </div>
              <div className="mt-4 rounded-xl border border-neutral-200 bg-white p-5"><div className="flex items-center justify-between"><span className="text-sm font-semibold text-neutral-700">Contract value</span><span className="text-lg font-semibold text-neutral-950">{money(values.fee)}</span></div><div className="mt-2 flex items-center justify-between text-sm text-neutral-500"><span>Deposit</span><span>{money(String(deposit))} ({values.deposit || 0}%)</span></div><div className="mt-2 flex items-center justify-between text-sm text-neutral-500"><span>Balance</span><span>{money(String(balance))}</span></div></div>
              <div className="mt-5 rounded-xl border border-neutral-200 bg-neutral-100 p-4 text-sm text-neutral-600"><strong className="text-neutral-900">Ready for the next stage?</strong><br />Your existing autosave, contract preview, PDF generation and contract status continue to use the same underlying contract data.</div>
            </section>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-neutral-200 bg-white px-5 py-4 sm:px-7">
          <button type="button" onClick={() => goToStep(step - 1)} disabled={step === 1} className="rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-35">Back</button>
          <div className="text-xs text-neutral-400">Changes save automatically</div>
          <button type="button" onClick={() => goToStep(step + 1)} disabled={step === STEPS.length} className="rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-35">{step === STEPS.length ? "Complete" : "Continue"}<span className="ml-2">→</span></button>
        </div>
      </div>
    </>
  );
}
