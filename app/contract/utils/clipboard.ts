export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

export function copyShareLink(draftId: string | null, origin: string): boolean {
  if (!draftId) {
    return false;
  }
  const shareLink = `${origin}/contract/share/${draftId}`;
  navigator.clipboard.writeText(shareLink);
  return true;
}
