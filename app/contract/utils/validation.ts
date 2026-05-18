interface ContractForm {
  artistName: string;
  artistEmail: string;
  clientName: string;
  email: string;
  eventName: string;
  eventDates: string;
  venueLocation: string;
  services: string[];
  totalFee: string;
  [key: string]: any;
}

export interface ValidationItem {
  label: string;
  complete: boolean;
  field: keyof ContractForm;
}

export function getValidationItems(form: ContractForm): string[] {
  return [
    !form.artistName && "Add artist name before exporting.",
    !form.clientName && "Add client or organization name.",
    form.services.length === 0 && "Select at least one vocal service.",
    !form.totalFee && "Add the total fee.",
  ].filter(Boolean) as string[];
}

export function getReadinessChecks(form: ContractForm): ValidationItem[] {
  return [
    { label: "Artist name", complete: Boolean(form.artistName), field: "artistName" },
    { label: "Artist email", complete: Boolean(form.artistEmail), field: "artistEmail" },
    { label: "Client name", complete: Boolean(form.clientName), field: "clientName" },
    { label: "Client email", complete: Boolean(form.email), field: "email" },
    { label: "Event name", complete: Boolean(form.eventName), field: "eventName" },
    { label: "Event dates", complete: Boolean(form.eventDates), field: "eventDates" },
    { label: "Venue location", complete: Boolean(form.venueLocation), field: "venueLocation" },
    { label: "Services", complete: form.services.length > 0, field: "services" },
    { label: "Total fee", complete: Boolean(form.totalFee), field: "totalFee" },
  ];
}

export function calculateReadinessScore(form: ContractForm): number {
  const checks = getReadinessChecks(form);
  const completed = checks.filter(c => c.complete).length;
  return Math.round((completed / checks.length) * 100);
}
