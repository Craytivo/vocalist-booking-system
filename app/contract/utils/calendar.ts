interface CalendarEventParams {
  eventName: string;
  eventDates: string; // may contain multiple lines, each optionally containing a date and location
  clientName: string;
  artistName: string;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  getErrorMessage: (error: any, context: string) => string;
}

function formatDateForIcs(date: Date) {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function tryParseDateFromText(text: string): Date | null {
  if (!text) return null;
  // Try common formats like "August 1, 2026" or ISO-like dates
  const monthDayYear = text.match(/([A-Za-z]+\s+\d{1,2},\s*\d{4})/);
  if (monthDayYear) {
    const d = new Date(monthDayYear[1]);
    if (!isNaN(d.getTime())) return d;
  }
  // Try ISO yyyy-mm-dd
  const iso = text.match(/(\d{4}-\d{2}-\d{2})/);
  if (iso) {
    const d = new Date(iso[1]);
    if (!isNaN(d.getTime())) return d;
  }
  // Fallback: let Date try to parse the whole text
  const fallback = new Date(text);
  if (!isNaN(fallback.getTime())) return fallback;
  return null;
}

export function generateCalendarEvent({
  eventName,
  eventDates,
  clientName,
  artistName,
  showToast,
  getErrorMessage,
}: CalendarEventParams) {
  const finalEventName = eventName || "Performance";
  const raw = (eventDates || "").trim();
  if (!raw) {
    showToast(getErrorMessage("No event date(s) provided", "calendar"), "error");
    return;
  }

  // Split into lines to support multiple stops. Lines can be like:
  // "August 1, 2026 — City A" or "2026-08-01 | City A" or just a date
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    showToast(getErrorMessage("No valid event date(s) provided", "calendar"), "error");
    return;
  }

  const events: { start: Date; end: Date; location: string; summary: string; description: string }[] = [];

  for (const line of lines) {
    // Try to extract date and location from the line
    // Split on common separators — em dash, en dash, hyphen, pipe
    const parts = line.split(/\s*[—–\-|]\s*/);
    let dateText = parts[0];
    let locationText = parts.slice(1).join(' - ') || "TBD";

    // If the first part doesn't parse to a date, try to find a date anywhere in the line
    let parsedDate = tryParseDateFromText(dateText);
    if (!parsedDate) {
      parsedDate = tryParseDateFromText(line);
    }

    if (!parsedDate) {
      // Skip lines we cannot parse; continue to next
      console.warn('Skipping calendar line - unable to parse date:', line);
      continue;
    }

    const start = parsedDate;
    const end = new Date(start);
    end.setHours(end.getHours() + 4); // default duration 4 hours

    // If location part still looks like a date (rare), try to find another text for location
    if (tryParseDateFromText(locationText)) {
      locationText = "TBD";
    }

    events.push({
      start,
      end,
      location: locationText,
      summary: `${finalEventName} - ${artistName || 'Vocalist'}`,
      description: `Performance for ${clientName}`,
    });
  }

  if (events.length === 0) {
    showToast(getErrorMessage("Unable to parse any valid event dates", "calendar"), "error");
    return;
  }

  const icsParts: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vocalist Contract Builder//EN',
  ];

  for (const ev of events) {
    icsParts.push('BEGIN:VEVENT');
    icsParts.push(`DTSTART:${formatDateForIcs(ev.start)}`);
    icsParts.push(`DTEND:${formatDateForIcs(ev.end)}`);
    icsParts.push(`SUMMARY:${ev.summary}`);
    icsParts.push(`DESCRIPTION:${ev.description}`);
    icsParts.push(`LOCATION:${ev.location}`);
    icsParts.push('END:VEVENT');
  }

  icsParts.push('END:VCALENDAR');

  const icsContent = icsParts.join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(finalEventName || 'performance').replace(/\s+/g, '_')}_calendar.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  showToast("Calendar event downloaded", "success");
}
