"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, CheckCircle2, Clock3, DollarSign, FileSignature, FileText, LayoutDashboard, LogOut, Plus, RefreshCw, Send, User } from "lucide-react";
import { supabase } from "../utils/supabaseClient";

type Contract = { id: string; client_name: string | null; event_name: string | null; event_dates: string | null; venue: string | null; total_fee: number | null; contract_status: string | null; invoice_status: string | null; created_at: string | null };
const stages = [
  { id: "Draft", label: "Draft", icon: FileText },
  { id: "Ready", label: "Ready", icon: CheckCircle2 },
  { id: "Sent", label: "Sent", icon: Send },
  { id: "Signed", label: "Signed", icon: FileSignature },
];

export default function DashboardPage() {
  const router = useRouter();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [email, setEmail] = useState("");
  const [artistName, setArtistName] = useState("Artist workspace");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    if (!supabase) { setError("Connect Supabase to load your booking dashboard."); setLoading(false); return; }
    setLoading(true); setError("");
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) { router.push("/contract"); return; }
    setEmail(user.email || "");

    const { data: workspace, error: workspaceError } = await supabase.from("artist_workspaces").select("id, artist_name").eq("owner_user_id", user.id).maybeSingle();
    if (workspaceError) { setError(workspaceError.message); setLoading(false); return; }
    if (workspace?.artist_name) setArtistName(workspace.artist_name);

    if (!workspace?.id) { setContracts([]); setLoading(false); return; }
    const { data, error: contractsError } = await supabase.from("contracts").select("id, client_name, event_name, event_dates, venue, total_fee, contract_status, invoice_status, created_at").eq("workspace_id", workspace.id).order("created_at", { ascending: false });
    if (contractsError) { setError(contractsError.message); setContracts([]); } else setContracts((data || []) as Contract[]);
    setLoading(false);
  }, [router]);

  useEffect(() => {
    loadDashboard();
    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { if (!session) router.push("/contract"); });
    return () => listener.subscription.unsubscribe();
  }, [loadDashboard, router]);

  const counts = useMemo(() => stages.reduce<Record<string, number>>((acc, stage) => { acc[stage.id] = contracts.filter((c) => (c.contract_status || "Draft") === stage.id).length; return acc; }, {}), [contracts]);
  const totalPipeline = useMemo(() => contracts.reduce((sum, c) => sum + Number(c.total_fee || 0), 0), [contracts]);
  const signedValue = useMemo(() => contracts.filter((c) => c.contract_status === "Signed").reduce((sum, c) => sum + Number(c.total_fee || 0), 0), [contracts]);
  const upcoming = useMemo(() => contracts.filter((c) => c.event_dates).map((c) => ({ ...c, parsedDate: new Date(c.event_dates as string) })).filter((c) => !Number.isNaN(c.parsedDate.getTime()) && c.parsedDate >= new Date()).sort((a, b) => a.parsedDate.getTime() - b.parsedDate.getTime()).slice(0, 5), [contracts]);
  const money = (value: number) => `$${value.toLocaleString("en-CA", { maximumFractionDigits: 0 })}`;
  const handleLogout = async () => { await supabase?.auth.signOut(); router.push("/contract"); };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white"><LayoutDashboard size={17} /></span>
            <span><span className="block text-sm font-bold tracking-tight">Setlist</span><span className="block text-[11px] text-slate-500">Booking workspace</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/contract" className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 sm:inline-flex">Contracts</Link>
            <Link href="/contract" className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"><Plus size={16} /> New contract</Link>
            <button onClick={handleLogout} className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Sign out"><LogOut size={17} /></button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <section className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Overview</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Good to see you, {artistName}.</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">Manage your bookings from inquiry to signed contract without losing track of what needs attention.</p></div>
          <div className="flex items-center gap-2 text-xs text-slate-400"><User size={14} /><span className="max-w-[240px] truncate">{email}</span></div>
        </section>

        {error && <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"><span>{error}</span><button onClick={loadDashboard} className="inline-flex items-center gap-1.5 font-semibold hover:underline"><RefreshCw size={14} /> Retry</button></div>}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric label="Total bookings" value={contracts.length} icon={FileText} detail="Across your workspace" />
          <Metric label="Pipeline value" value={money(totalPipeline)} icon={DollarSign} detail="All active contracts" />
          <Metric label="Signed value" value={money(signedValue)} icon={CheckCircle2} detail="Confirmed bookings" />
          <Metric label="Upcoming" value={upcoming.length} icon={CalendarDays} detail="Next scheduled events" />
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-6"><div className="flex items-center justify-between gap-4"><div><h2 className="text-base font-bold tracking-tight">Booking pipeline</h2><p className="mt-1 text-xs text-slate-500">Move every booking toward a signed agreement.</p></div><Link href="/contract" className="hidden items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 sm:inline-flex">View contracts <ArrowRight size={14} /></Link></div></div>
          <div className="grid divide-y divide-slate-100 md:grid-cols-4 md:divide-x md:divide-y-0">
            {stages.map((stage) => { const Icon = stage.icon; const stageContracts = contracts.filter((c) => (c.contract_status || "Draft") === stage.id).slice(0, 3); return (
              <div key={stage.id} className="min-h-[220px] p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600"><Icon size={15} /></span><span className="text-sm font-semibold">{stage.label}</span></div><span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">{counts[stage.id] || 0}</span></div>
                <div className="space-y-2">{stageContracts.map((contract) => <Link key={contract.id} href={`/contract?draft=${contract.id}`} className="block rounded-xl border border-slate-200 p-3 transition hover:border-indigo-200 hover:bg-indigo-50/40"><p className="truncate text-xs font-semibold text-slate-900">{contract.client_name || "Untitled client"}</p><p className="mt-1 truncate text-[11px] text-slate-500">{contract.event_name || "Untitled event"}</p><div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-slate-400"><span>{contract.event_dates || "No date"}</span><span className="font-semibold text-slate-600">{contract.total_fee ? money(Number(contract.total_fee)) : "—"}</span></div></Link>)}{stageContracts.length === 0 && <p className="rounded-xl border border-dashed border-slate-200 px-3 py-7 text-center text-xs text-slate-400">No bookings here</p>}{counts[stage.id] > 3 && <Link href="/contract" className="block pt-1 text-center text-[11px] font-semibold text-indigo-600">+ {counts[stage.id] - 3} more</Link>}</div>
              </div>); })}
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <section className="rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-5"><div><h2 className="text-base font-bold tracking-tight">Upcoming bookings</h2><p className="mt-1 text-xs text-slate-500">Your next events at a glance.</p></div><CalendarDays size={18} className="text-slate-400" /></div><div className="divide-y divide-slate-100">{loading ? <LoadingRows /> : upcoming.length === 0 ? <Empty label="No upcoming bookings" detail="Create a contract with an event date to see it here." /> : upcoming.map((contract) => <Link href={`/contract?draft=${contract.id}`} key={contract.id} className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50"><div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><span className="text-[9px] font-bold uppercase">{contract.parsedDate.toLocaleString("en-CA", { month: "short" })}</span><span className="text-base font-bold leading-4">{contract.parsedDate.getDate()}</span></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{contract.event_name || "Untitled event"}</p><p className="mt-1 truncate text-xs text-slate-500">{contract.client_name || "No client"}{contract.venue ? ` · ${contract.venue}` : ""}</p></div><span className="hidden text-sm font-semibold text-slate-700 sm:block">{contract.total_fee ? money(Number(contract.total_fee)) : "—"}</span><ArrowRight size={15} className="text-slate-300" /></Link>)}</div></section>
          <section className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm"><div className="flex h-full flex-col"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><Clock3 size={18} /></span><h2 className="mt-6 text-xl font-bold tracking-tight">Keep your pipeline moving.</h2><p className="mt-2 text-sm leading-6 text-slate-400">Create a contract, send it to the client, and use the status pipeline to see exactly what is waiting on you.</p><div className="mt-auto pt-8"><Link href="/contract" className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 hover:bg-slate-100">Create a booking <ArrowRight size={16} /></Link></div></div></section>
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value, icon: Icon, detail }: { label: string; value: string | number; icon: typeof FileText; detail: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5"><div className="flex items-start justify-between gap-4"><div><p className="text-xs font-medium text-slate-500">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">{value}</p><p className="mt-1 text-[11px] text-slate-400">{detail}</p></div><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600"><Icon size={17} /></span></div></div>; }
function LoadingRows() { return <div className="space-y-3 p-5">{[1, 2, 3].map((item) => <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-100" />)}</div>; }
function Empty({ label, detail }: { label: string; detail: string }) { return <div className="px-5 py-12 text-center"><p className="text-sm font-semibold text-slate-700">{label}</p><p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-400">{detail}</p></div>; }
