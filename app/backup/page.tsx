"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Download, FileUp, HardDrive, ShieldCheck, Trash2 } from "lucide-react";

const BACKUP_VERSION = 1;
const IGNORED_KEYS = new Set(["__next_router_state_tree", "__next_scroll_0_0"]);

type BackupPayload = {
  app: "Setlist";
  version: number;
  exportedAt: string;
  origin: string;
  storage: Record<string, string>;
};

function collectStorage(): Record<string, string> {
  const storage: Record<string, string> = {};
  for (let index = 0; index < localStorage.length; index += 1) {
    const key = localStorage.key(index);
    if (!key || IGNORED_KEYS.has(key)) continue;
    const value = localStorage.getItem(key);
    if (value !== null) storage[key] = value;
  }
  return storage;
}

export default function BackupPage() {
  const [keys, setKeys] = useState(0);
  const [lastBackup, setLastBackup] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const refresh = () => setKeys(Object.keys(collectStorage()).length);
  useEffect(() => refresh(), []);

  const sizeLabel = useMemo(() => {
    const bytes = new Blob([JSON.stringify(collectStorage())]).size;
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }, [keys, lastBackup]);

  const exportBackup = () => {
    const payload: BackupPayload = { app: "Setlist", version: BACKUP_VERSION, exportedAt: new Date().toISOString(), origin: window.location.origin, storage: collectStorage() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `setlist-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setLastBackup(new Date().toLocaleString());
    setMessage("Backup exported successfully.");
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const payload = JSON.parse(await file.text()) as BackupPayload;
      if (payload.app !== "Setlist" || !payload.storage || typeof payload.storage !== "object") throw new Error("Invalid Setlist backup");
      if (!window.confirm("Importing will replace the Setlist data currently stored in this browser. Continue?")) return;
      localStorage.clear();
      Object.entries(payload.storage).forEach(([key, value]) => localStorage.setItem(key, value));
      setMessage("Backup restored. Reloading your workspace…");
      window.setTimeout(() => window.location.reload(), 700);
    } catch {
      setMessage("That file could not be restored. Choose a Setlist JSON backup.");
    }
  };

  const clearData = () => {
    if (!window.confirm("This permanently removes all Setlist data stored in this browser. Export a backup first if you may need it later.")) return;
    localStorage.clear();
    refresh();
    setMessage("Local workspace data cleared.");
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-xl"><div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6"><Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-slate-950"><ArrowLeft size={16} /> Back to dashboard</Link><span className="text-sm font-bold tracking-tight">Setlist</span></div></header>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">Workspace data</p><h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Backup & restore</h1><p className="mt-3 text-sm leading-6 text-slate-500">Your booking workspace is stored locally in this browser. Export a portable backup so you can preserve or move your data without adding a backend.</p></div>
        {message && <div className="mt-6 flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-800"><CheckCircle2 size={17} /> {message}</div>}
        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <Stat icon={HardDrive} label="Stored items" value={String(keys)} detail="Local storage entries" />
          <Stat icon={ShieldCheck} label="Storage mode" value="Local" detail="No server database" />
          <Stat icon={Download} label="Approx. size" value={sizeLabel} detail="Current browser data" />
        </section>
        <section className="mt-6 grid gap-5 md:grid-cols-2">
          <ActionCard icon={Download} title="Export backup" description="Download a complete JSON snapshot of your Setlist workspace, including saved bookings and preferences." button="Export JSON" onClick={exportBackup} />
          <ActionCard icon={FileUp} title="Restore backup" description="Replace this browser's local workspace with a previously exported Setlist backup." button="Choose backup" input onChange={importBackup} />
        </section>
        <section className="mt-6 rounded-2xl border border-red-200 bg-white p-6 shadow-sm"><div className="flex gap-4"><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600"><Trash2 size={18} /></span><div className="min-w-0 flex-1"><h2 className="text-sm font-bold">Clear local workspace</h2><p className="mt-1 max-w-xl text-sm leading-6 text-slate-500">Permanently remove all Setlist data from this browser. This cannot be undone unless you have an exported backup.</p><button type="button" onClick={clearData} className="mt-4 rounded-lg border border-red-200 bg-white px-3.5 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50 active:scale-[0.98]">Clear data</button></div></div></section>
        {lastBackup && <p className="mt-5 text-xs text-slate-400">Last export: {lastBackup}</p>}
      </div>
    </main>
  );
}

function Stat({ icon: Icon, label, value, detail }: { icon: typeof HardDrive; label: string; value: string; detail: string }) { return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/5"><Icon size={17} className="text-indigo-600" /><p className="mt-4 text-xs font-medium text-slate-500">{label}</p><p className="mt-1 text-2xl font-bold tracking-tight">{value}</p><p className="mt-1 text-xs text-slate-400">{detail}</p></div>; }

function ActionCard({ icon: Icon, title, description, button, onClick, input, onChange }: { icon: typeof Download; title: string; description: string; button: string; onClick?: () => void; input?: boolean; onChange?: (event: ChangeEvent<HTMLInputElement>) => void }) { return <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-900/5 transition duration-200 hover:-translate-y-0.5 hover:shadow-md"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700"><Icon size={18} /></span><h2 className="mt-5 text-base font-bold tracking-tight">{title}</h2><p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{description}</p>{input ? <label className="mt-5 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"><FileUp size={15} /> {button}<input type="file" accept="application/json,.json" className="sr-only" onChange={onChange} /></label> : <button type="button" onClick={onClick} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-slate-950 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.98]"><Download size={15} /> {button}</button>}</div>; }
