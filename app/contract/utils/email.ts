interface EmailDraftParams {
  email: string;
  deliverySubject: string;
  deliveryMessage: string;
  representativeName: string;
  clientName: string;
  eventName: string;
  artistName: string;
}

export function buildEmailDraft(params: EmailDraftParams) {
  const recipient = params.email || "";
  const subject = params.deliverySubject || `Vocal Performance Agreement - ${params.eventName || "Booking"}`;
  const body = params.deliveryMessage || `Hi ${params.representativeName || params.clientName || "there"},

The vocal performance agreement for ${params.eventName || "the upcoming engagement"} is ready for review and signature.

Please attach the downloaded contract PDF (${params.eventName || "vocal-performance-agreement"}.pdf) to this email and let me know if you have any questions.

Best,
${params.artistName || "the artist"}`;

  return { recipient, subject, body };
}

export function openDefaultMailClient(draft: { recipient: string; subject: string; body: string }) {
  const mailtoLink = `mailto:${encodeURIComponent(draft.recipient)}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
  window.open(mailtoLink, "_self");
}

export function openGmailDraft(draft: { recipient: string; subject: string; body: string }) {
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(draft.recipient)}&su=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`;
  window.open(gmailUrl, "_blank", "noopener,noreferrer");
}
