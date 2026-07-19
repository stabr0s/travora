export function getSafeInviteNextPath(value: string | null | undefined) {
  if (!value?.startsWith("/invite/")) return null;
  if (value.startsWith("//") || value.includes("\\")) return null;
  if (!/^\/invite\/[A-Za-z0-9_-]{32,160}$/.test(value)) return null;

  return value;
}
