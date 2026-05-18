interface RecentContractsProps {
  activeDraftId: string | null;
  contracts: any[];
  onLoadContract: (contract: any) => void;
  onDeleteContract: (id: string) => void;
  onStatusFilterChange: (status: string) => void;
  statusFilter: string;
  supabaseEnabled: boolean;
}

export default function RecentContracts({
  activeDraftId,
  contracts,
  onLoadContract,
  onDeleteContract,
  onStatusFilterChange,
  statusFilter,
  supabaseEnabled,
}: RecentContractsProps) {
  return (
    <div className="mt-8 rounded-xl border border-neutral-300 bg-white p-4 shadow-md">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-neutral-900">
          Recent Contracts
        </h2>
        <div className="flex flex-wrap gap-1">
          {["All", "Draft", "Ready", "Sent", "Signed"].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => onStatusFilterChange(status)}
              className={`px-3 py-1 text-xs font-medium transition-all ${
                statusFilter === status
                  ? "text-neutral-900 border-b-2 border-neutral-900"
                  : "text-neutral-400 hover:text-neutral-600"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {!supabaseEnabled ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-neutral-900 mb-1">Connect Supabase</p>
          <p className="text-xs text-neutral-500">Add credentials to save contracts</p>
        </div>
      ) : contracts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-neutral-900 mb-1">No contracts yet</p>
          <p className="text-xs text-neutral-500">Your drafts will appear here</p>
        </div>
      ) : (
        <div className="space-y-2">
          {contracts.map((contract) => {
            const title = contract.client_name || "Untitled client";
            const subtitle = contract.event_name || "Untitled event";
            const date = contract.event_dates || "No date set";
            const fee = contract.total_fee
              ? `$${Number(contract.total_fee).toLocaleString("en-CA")} CAD`
              : "Fee not set";
            const status = contract.contract_status || contract.status || "Draft";
            const isActive = contract.id === activeDraftId;

            return (
              <div key={contract.id} className="relative group">
                <button
                  type="button"
                  onClick={() => onLoadContract(contract)}
                  className={`w-full rounded-lg border px-4 py-3 text-left transition-all ${
                    isActive
                      ? "border-neutral-900 bg-neutral-50"
                      : "border-neutral-300 bg-white hover:border-neutral-300 hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">
                        {title}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500 truncate">
                        {subtitle}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-400">
                        {date} · {fee}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={`text-[10px] font-medium uppercase tracking-wide ${
                        status === "Draft" ? "text-neutral-500" :
                        status === "Ready" ? "text-emerald-600" :
                        status === "Sent" ? "text-blue-600" :
                        status === "Signed" ? "text-neutral-900" :
                        "text-neutral-500"
                      }`}>
                        {status}
                      </span>
                      {isActive && (
                        <span className="w-2 h-2 rounded-full bg-neutral-900" />
                      )}
                    </div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteContract(contract.id);
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  title="Delete contract"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 6h18"></path>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
