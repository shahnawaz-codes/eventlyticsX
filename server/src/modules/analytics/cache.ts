interface analyticsCache {}

const analyticsCache = new Map<string, analyticsCache>();
const getOrCreate = (projectKey: string) => {
  let cache = analyticsCache.get(projectKey);
  if (!cache) {
    cache = analyticsCache.set(projectKey, {
      overview: {
        totalEvents: 0,
        totalPageviews: 0,
        uniqueVisitors: 0,
      },
      topPages: new Map(),
      browsers: new Map(),
      countries: new Map(),
      recentEvents: [],
      timeline: new Map(),
      sessions: new Set(),
    });
  }
  return cache;
};
