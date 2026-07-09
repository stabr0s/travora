const publicDemoTripIds = new Set([
  "japan-2027",
  "sicily-2026",
  "monaco-f1-weekend",
  "new-york-2026",
]);

export function getLogoHrefForPathname(pathname: string) {
  const tripId = pathname.match(/^\/trips\/([^/]+)/)?.[1];

  if (tripId && publicDemoTripIds.has(tripId)) {
    return "/";
  }

  return "/dashboard";
}
