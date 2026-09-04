import { useEffect, useRef, useState } from "react";
import { FileText, Trash2 } from "lucide-react";

interface RecentContractsProps {
  activeDraftId: string | null;
  contracts: any[];
  onLoadContract: (contract: any) => void;
  onDeleteContract: (id: string) => void;
  onStatusFilterChange: (status: string) => void;
  statusFilter: string;
  supabaseEnabled: boolean;
}

const STATUSES = ["All", "Draft", "Negotiating", "Confirmed", "Completed", "Cancelled"];

export default function RecentContracts({ activeDraftId, contracts, onLoadContract, onDeleteContract, onStatusFilterChange, statusFilter, supabaseEnabled }: RecentContractsProps) {
  const [requestedDraftId, setRequestedDraftId] = useState<string | null>(null);
  const autoLoadedDraftRef = useRef<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setRequestedDraftId(params.get("draftId"));
  }, []);

  useEffect(() => {
    if (!requestedDraftId || !supabaseEnabled || activeDraftId === requestedDraftId) return;
    if (autoLoadedDraftRef.current === requestedDraftId) return;
    const requestedContract = contracts.find((contract) => contract.id === requestedDraftId);
    if (!requestedContract) return;
    autoLoadedDraftRef.current = requestedDraftId;
    onLoadContract(requestedContract);
  }, [requestedDraftId, contracts, activeDraftId, onLoadContract, supabaseEnabled]);

  const counts = STATUSES.reduce<Record<string, number>>((acc, status) => {
    acc[status] = status === "All" ? contracts.length : contracts.filter((contract) => (contract.contract_status || contract.status || "Draft") === status).length;
    return acc;
  }, {});

  return (
    <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5">
      <div className="border-b border-slate-100 px-4 pb-3 pt-4">
        <div className="flex items-center justify-between gap-3"><div><p className="text-sm font-semibold tracking-tight text-slate-900">Recent contracts</p><p className="mt-0.5 text-xs text-slate-500">Open a saved contract to continue editing</p></div><span className="inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-slate-100 px-2 text-xs font-semibold text-slate-600">{contracts.length}</span></div>
        <div className="mt-4 flex gap-1 overflow-x-auto rounded-xl bg-slate-50 p-1" role="tablist" aria-label="Contract status">
          {STATUSES.map((status) => { const active = statusFilter === status; return <button key={status} type="button" role="tab" aria-selected={active} onClick={() => onStatusFilterChange(status)} className={`flex min-w-fit items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${active ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:bg-white/70 hover:text-slate-700"}`}>{status}<span className={`rounded-full px-1.5 py-0.5 text-[10px] leading-none ${active ? "bg-slate-100 text-slate-600" : "bg-slate-200/70 text-slate-500"}`}>{counts[status]}</span></button>; })}
        </div>
      </div>
      <div className="p-3">
        {!supabaseEnabled ? <EmptyState title="Local storage unavailable" description="Enable browser storage to keep contracts on this device." /> : contracts.length === 0 ? <EmptyState title={statusFilter === "All" ? "No contracts yet" : `No ${statusFilter.toLowerCase()} contracts`} description={statusFilter === "All" ? "Your saved contracts will appear here." : "Try another status filter or create a new contract."} /> : (
          <div className="space-y-2">{contracts.map((contract) => { const title = contract.client_name || "Untitled client"; const subtitle = contract.event_name || "Untitled event"; const date = contract.event_dates || "No date set"; const fee = contract.total_fee ? `$${Number(contract.total_fee).toLocaleString("en-CA")} CAD` : "Fee not set"; const status = contract.contract_status || contract.status || "Draft"; const isActive = contract.id === activeDraftId; return <div key={contract.id} className={`group relative rounded-xl border transition-all ${isActive ? "border-indigo-200 bg-indigo-50/50 shadow-sm" : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"}`}><button type="button" onClick={() => onLoadContract(contract)} className="w-full rounded-xl px-3.5 py-3 pr-11 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-inset"><div className="flex items-center gap-3"><span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"}`}><FileText size={16} strokeWidth={1.8} /></span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><p className="truncate text-sm font-semibold text-slate-900">{title}</p>{isActive && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" aria-label="Currently open" />}</div><p className="mt-0.5 truncate text-xs text-slate-500">{subtitle}</p><p className="mt-1 truncate text-[11px] text-slate-400">{date} · {fee}</p></div><StatusBadge status={status} /></div></button><button type="button" onClick={(event) => { event.stopPropagation(); onDeleteContract(contract.id); }} className="absolute right-2 top-2 rounded-lg p-2 text-slate-400 opacity-100 transition-all hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 md:opacity-0 md:group-hover:opacity-100" title="Delete contract" aria-label={`Delete ${title}`}><Trash2 size={15} strokeWidth={1.8} /></button></div>; })}</div>
        )}
      </div>
    </section>
  );
}

function StatusBadge({ status }: { status: string }) { const styles: Record<string, string> = { Draft: "bg-slate-100 text-slate-600", Negotiating: "bg-amber-50 text-amber-700", Confirmed: "bg-indigo-50 text-indigo-700", Completed: "bg-emerald-50 text-emerald-700", Cancelled: "bg-red-50 text-red-700" }; return <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ${styles[status] || styles.Draft}`}>{status}</span>; }
function EmptyState({ title, description }: { title: string; description: string }) { return <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/60 px-4 py-10 text-center"><span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-400 shadow-sm ring-1 ring-slate-200"><FileText size={18} strokeWidth={1.7} /></span><p className="text-sm font-semibold text-slate-800">{title}</p><p className="mt-1 max-w-[230px] text-xs leading-5 text-slate-500">{description}</p></div>; }
