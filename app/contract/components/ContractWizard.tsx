import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

type Control = HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

function findControl(labelText: string): Control | null {
  const wanted = normalize(labelText);
  const labels = Array.from(document.querySelectorAll("main label"));
  const label = labels.find((node) => {
    const firstSpan = node.querySelector(":scope > span");
    return normalize(firstSpan?.textContent || "") === wanted || normalize(node.textContent || "") === wanted;
  });
  return label?.querySelector("input, textarea, select") || null;
}

function setNativeValue(control: Control, value: string) {
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
  return findControl(label)?.value || "";
}

function readServiceSelection() {
  return SERVICES.filter((service) => {
    const wanted = normalize(service);
    const label = Array.from(document.querySelectorAll("main label")).find(
      (node) => normalize(node.textContent || "") === wanted
    );
    return !!label?.querySelector<HTMLInputElement>('input[type="checkbox"]')?.checked;
  });
}

function setServiceSelection(nextServices: string[]) {
  SERVICES.forEach((service) => {
    const wanted = normalize(service);
    const label = Array.from(document.querySelectorAll("main label")).find(
      (node) => normalize(node.textContent || "") === wanted
    );
    const checkbox = label?.querySelector<HTMLInputElement>('input[type="checkbox"]');
    if (checkbox && checkbox.checked !== nextServices.includes(service)) checkbox.click();
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
  const servicesTouchedRef = useRef(false);

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

    // The legacy form may hydrate asynchronously when editing an existing contract.
    // Once the user touches services in this wizard, the wizard becomes the source of truth
    // so the polling sync cannot undo a click 750ms later.
    if (!servicesTouchedRef.current) {
      setServices(readServiceSelection());
    }
  }, []);

  useEffect(() => {
    syncFromLegacyForm();
    const interval = window.setInterval(syncFromLegacyForm, 750);
    return () => window.clearInterval(interval);
  }, [syncFromLegacyForm]);

  useEffect(() => {
    const safe = Math.min(Math.max(externalWizardStep || 1, 1), 5);
    setStep(safe);
  }, [externalWizardStep]);

  const update = useCallback((key: keyof typeof values, label: string, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
    setField(label, value);
  }, []);

  const goToStep = useCallback((next: number) => {
    const safe = Math.min(Math.max(next, 1), STEPS.length);
    setStep(safe);
    setWizardStep(safe);
    window.setTimeout(() => {
      document.querySelector(".new-contract-workflow")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 0);
  }, [setWizardStep]);

  const applyPreset = (label: string) => {
    const preset = PRESETS.find((item) => item.label === label);
    if (!preset) return;

    servicesTouchedRef.current = true;
    setField("Booking Preset", label);
    setField("Total Fee", preset.fee);
    setField("Deposit Percentage (%)", preset.deposit);
    setField("Performance Duration", preset.duration);
    setServiceSelection(preset.services);
    setValues((current) => ({
      ...current,
      preset: label,
      fee: preset.fee,
      deposit: preset.deposit,
      duration: preset.duration,
    }));
    setServices(preset.services);
  };

  const toggleService = (service: string) => {
    servicesTouchedRef.current = true;
    setServices((current) => {
      const next = current.includes(service)
        ? current.filter((item) => item !== service)
        : [...current, service];
      setServiceSelection(next);
      return next;
    });
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
              <div className="mb-6 flex items-end justify-between gap-4"><div><h3 className="text-xl font-semibold text-neutral-950">What is being booked?</h3><p className="mt-1 text-sm text-neutral-500">Select the services that belong in this agreement.</p></div><div className="shrink-0 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-semibold text-neutral-600">{services.length} selected</div></div>
              <div className="grid gap-3 sm:grid-cols-2">
                {SERVICES.map((service) => {
                  const selected = services.includes(service);
                  const description = service === "Studio Vocals" ? "Recording and session vocals" : service === "Rehearsals" ? "Scheduled rehearsal time" : service === "Touring Support" ? "Vocal support while touring" : service === "Lead Vocals" ? "Primary vocal performance" : service === "Supporting Vocals" ? "Backing and harmony vocals" : "Live vocal performance";
                  return (
                    <button key={service} type="button" aria-pressed={selected} onClick={() => toggleService(service)} className={`flex items-center justify-between rounded-xl border p-4 text-left transition ${selected ? "border-neutral-950 bg-neutral-950 text-white shadow-sm" : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400 hover:shadow-sm"}`}>
                      <span><span className="block text-sm font-semibold">{service}</span><span className={`mt-1 block text-xs ${selected ? "text-neutral-300" : "text-neutral-400"}`}>{description}</span></span>
                      <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold ${selected ? "border-white bg-white text-neutral-950" : "border-neutral-300 text-neutral-400"}`}>{selected ? "✓" : "+"}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5"><label className={labelClass}>Performance description</label><input className={fieldClass} value={values.duration} onChange={(e) => update("duration", "Performance Duration", e.target.value)} placeholder="e.g. 2 sets of 45 minutes, 7pm–10pm" /><p className="mt-2 text-xs text-neutral-400">Keep this practical: duration, sets, hours or scope.</p></div>
            </section>
          )}

          {step === 3 && (
            <section className="mx-auto max-w-3xl">
              <div className="mb-6"><h3 className="text-xl font-semibold text-neutral-950">Set the money</h3><p className="mt-1 text-sm text-neutral-500">Define the booking fee, deposit and payment method.</p></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label><span className={labelClass}>Total fee *</span><input type="number" min="0" className={fieldClass} value={values.fee} onChange={(e) => update("fee", "Total Fee", e.target.value)} placeholder="0" /></label>
                <label><span className={labelClass}>Deposit percentage</span><input type="number" min="0" max="100" className={fieldClass} value={values.deposit} onChange={(e) => update("deposit", "Deposit Percentage (%)", e.target.value)} placeholder="50" /></label>
                <label className="sm:col-span-2"><span className={labelClass}>Payment method</span><select className={fieldClass} value={values.paymentMethod} onChange={(e) => update("paymentMethod", "Payment Method", e.target.value)}><option value="">Select payment method</option><option>e-Transfer</option><option>Bank Transfer</option><option>Cheque</option><option>Cash</option><option>Credit Card</option><option>Other</option></select></label>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-neutral-200 bg-white p-4"><div className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Total</div><div className="mt-2 text-xl font-semibold text-neutral-950">{money(values.fee)}</div></div>
                <div className="rounded-xl border border-neutral-200 bg-white p-4"><div className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Deposit</div><div className="mt-2 text-xl font-semibold text-neutral-950">{money(String(deposit))}</div></div>
                <div className="rounded-xl border border-neutral-200 bg-white p-4"><div className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Balance</div><div className="mt-2 text-xl font-semibold text-neutral-950">{money(String(balance))}</div></div>
              </div>
            </section>
          )}

          {step === 4 && (
            <section className="mx-auto max-w-3xl">
              <div className="mb-6"><h3 className="text-xl font-semibold text-neutral-950">Lock in the logistics</h3><p className="mt-1 text-sm text-neutral-500">Capture when and where the booking happens.</p></div>
              <div className="grid gap-5 sm:grid-cols-2">
                <label><span className={labelClass}>Event / project name *</span><input className={fieldClass} value={values.event} onChange={(e) => update("event", "Event / Project Name", e.target.value)} placeholder="Event or project" /></label>
                <label><span className={labelClass}>Event date(s) *</span><input className={fieldClass} value={values.date} onChange={(e) => update("date", "Event Date(s)", e.target.value)} placeholder="October 9, 2026" /></label>
                <label className="sm:col-span-2"><span className={labelClass}>Venue / location *</span><input className={fieldClass} value={values.venue} onChange={(e) => update("venue", "Venue / Location", e.target.value)} placeholder="Venue name and city" /></label>
                <label className="sm:col-span-2"><span className={labelClass}>Travel terms</span><textarea className={`${fieldClass} min-h-[110px] resize-y`} value={values.travel} onChange={(e) => update("travel", "Travel Terms", e.target.value)} placeholder="Travel, accommodation, mileage or other production arrangements" /></label>
              </div>
            </section>
          )}

          {step === 5 && (
            <section className="mx-auto max-w-3xl">
              <div className="mb-6"><h3 className="text-xl font-semibold text-neutral-950">Finish the agreement</h3><p className="mt-1 text-sm text-neutral-500">Add the key terms, review the booking, then create the contract.</p></div>
              <label><span className={labelClass}>Cancellation terms *</span><textarea className={`${fieldClass} min-h-[150px] resize-y`} value={values.cancellation} onChange={(e) => update("cancellation", "Cancellation Terms", e.target.value)} placeholder="Describe notice requirements, cancellation fees and other applicable terms." /></label>
              <div className="mt-5 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                <button type="button" onClick={() => setAdvancedOpen((open) => !open)} className="flex w-full items-center justify-between px-5 py-4 text-left"><span><span className="block text-sm font-semibold text-neutral-950">Booking summary</span><span className="mt-0.5 block text-xs text-neutral-400">Review the information that will be carried into the contract.</span></span><span className="text-neutral-400">{advancedOpen ? "−" : "+"}</span></button>
                {advancedOpen && <div className="border-t border-neutral-200 px-5 py-5"><div className="grid gap-4 sm:grid-cols-2 text-sm"><div><div className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Artist</div><div className="mt-1 font-medium text-neutral-900">{values.artist || "Not entered"}</div></div><div><div className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Client</div><div className="mt-1 font-medium text-neutral-900">{values.client || "Not entered"}</div></div><div><div className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Services</div><div className="mt-1 font-medium text-neutral-900">{services.length ? services.join(", ") : "None selected"}</div></div><div><div className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Fee</div><div className="mt-1 font-medium text-neutral-900">{money(values.fee)}</div></div><div><div className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Event</div><div className="mt-1 font-medium text-neutral-900">{values.event || "Not entered"}</div></div><div><div className="text-xs font-semibold uppercase tracking-[0.12em] text-neutral-400">Venue</div><div className="mt-1 font-medium text-neutral-900">{values.venue || "Not entered"}</div></div></div></div>}
              </div>
            </section>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-neutral-200 bg-white px-5 py-4 sm:px-7">
          <button type="button" onClick={() => goToStep(step - 1)} disabled={step === 1} className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-semibold text-neutral-700 transition hover:border-neutral-300 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-40">Back</button>
          <div className="flex items-center gap-2">
            {step < 5 ? (
              <button type="button" onClick={() => goToStep(step + 1)} className="rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800">Continue</button>
            ) : (
              <button type="submit" className="rounded-xl bg-neutral-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800">Create contract</button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
