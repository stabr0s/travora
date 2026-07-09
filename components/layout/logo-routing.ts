const publicDemoTripIds = new Set([
  "japan-2027",
  "sicily-2026",
  "monaco-f1-weekend",
  "new-york-2026",
]);

export function isPublicDemoTripPathname(pathname: string) {
  const match = pathname.match(/^\/trips\/([^/]+)(?:\/summary)?$/);

  return Boolean(match?.[1] && publicDemoTripIds.has(match[1]));
}

export function getLogoHrefForPathname(pathname: string) {
  if (isPublicDemoTripPathname(pathname)) {
    return "/";
  }

  return "/dashboard";
}
