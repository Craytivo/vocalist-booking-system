import React from "react";

interface RecentContractsProps {
  activeDraftId: string | null;
  contracts: any[];
  onLoadContract: (contract: any) => void;
  onDeleteContract: (id: string) => void;
  onStatusFilterChange: (status: string) => void;
  statusFilter: string;
  supabaseEnabled: boolean;
}

export default function RecentContracts() {
  return (
    <div className="mt-8 rounded-xl border border-neutral-300 bg-white p-4 shadow-md">
      <div className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-900 mb-3">Recent Contracts</div>
      <div className="py-12 text-center text-sm text-neutral-600">
        This app is running in local-only mode. Recent contracts are not saved remotely.
        Use the export / download features to keep a copy of your contract locally.
      </div>
    </div>
  );
}
