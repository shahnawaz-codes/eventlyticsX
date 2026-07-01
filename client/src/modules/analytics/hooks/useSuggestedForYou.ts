interface SuggestedForYouProps {
  breakdowns?: {
    pages?: Array<{ path: string; views: number }>;
    countries?: Array<{ country: string; count: number }>;
    referrers?: Array<{ referrer: string; count: number }>;
  } | null;
}

export function useSuggestedForYou({ breakdowns }: SuggestedForYouProps) {
  const countryBreakdown = (breakdowns?.countries && breakdowns.countries.length > 0)
    ? breakdowns.countries.map((c) => ({ label: c.country || "Unknown", value: c.count }))
    : [];

  const pageBreakdown = (breakdowns?.pages && breakdowns.pages.length > 0)
    ? breakdowns.pages.map((p) => ({ label: p.path, value: p.views }))
    : [];

  const channelBreakdown = (breakdowns?.referrers && breakdowns.referrers.length > 0)
    ? breakdowns.referrers.map((r) => ({ label: r.referrer || "Direct", value: r.count }))
    : [];

  return {
    countryBreakdown,
    pageBreakdown,
    channelBreakdown,
  };
}
