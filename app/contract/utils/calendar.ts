interface CalendarEventParams {
  eventName: string;
  eventDates: string;
  clientName: string;
  artistName: string;
  showToast: (message: string, type: "success" | "error" | "info") => void;
  getErrorMessage: (error: any, context: string) => string;
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
  const dates = eventDates || "";
  const location = "TBD";

  // Parse dates (assuming format like "January 15, 2025" or similar)
  const dateMatch = dates.match(/([A-Za-z]+ \d+, \d{4})/);
  if (!dateMatch) {
    showToast(getErrorMessage("Invalid date format", "calendar"), "error");
    return;
  }

  const eventDate = new Date(dateMatch[1]);
  const endDate = new Date(eventDate);
  endDate.setHours(endDate.getHours() + 4); // Assume 4-hour performance

  // Generate ICS format
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Vocalist Contract Builder//EN',
    'BEGIN:VEVENT',
    `DTSTART:${formatDate(eventDate)}`,
    `DTEND:${formatDate(endDate)}`,
    `SUMMARY:${finalEventName} - ${artistName || 'Vocalist'}`,
    `DESCRIPTION:Performance for ${clientName}`,
    `LOCATION:${location}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  // Create and download the file
  const blob = new Blob([icsContent], { type: 'text/calendar' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${finalEventName.replace(/\s+/g, '_')}_calendar.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);

  showToast("Calendar event downloaded", "success");
}
