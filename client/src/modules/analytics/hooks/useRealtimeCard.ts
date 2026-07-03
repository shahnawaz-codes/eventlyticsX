import { differenceInMinutes } from "date-fns";

interface RealtimeCountry {
  country: string;
  activeUsers: number;
}

interface RealtimeMinute {
  minute: string;
  activeUsers: number;
}

interface RealtimeCardProps {
  minuteData?: RealtimeMinute[];
  countryData?: RealtimeCountry[];
  realtime?: {
    activeUsers: number;
    recentActivity: any[];
  } | null;
}

const DEFAULT_MINUTE_DATA: RealtimeMinute[] = Array.from({ length: 30 }).map(
  (_, idx) => ({
    minute: `${30 - idx}m ago`,
    activeUsers: 0,
  }),
);

const DEFAULT_COUNTRY_DATA: RealtimeCountry[] = [];

export function useRealtimeCard({
  minuteData = DEFAULT_MINUTE_DATA,
  countryData = DEFAULT_COUNTRY_DATA,
  realtime,
}: RealtimeCardProps) {
  const recentLogs = realtime?.recentActivity || [];

  // 1. Calculate active users per minute for the last 30 minutes
  let calculatedMinuteData = minuteData;
  if (realtime && recentLogs.length > 0) {
    const minutesMap = new Map<number, number>();
    for (let i = 0; i < 30; i++) {
      minutesMap.set(i, 0);
    }
    const now = new Date();
    recentLogs.forEach((log: any) => {
      const diffMins = differenceInMinutes(now, new Date(log.createdAt));
      if (diffMins >= 0 && diffMins < 30) {
        minutesMap.set(diffMins, (minutesMap.get(diffMins) || 0) + 1);
      }
    });
    calculatedMinuteData = Array.from({ length: 30 }).map((_, idx) => {
      const mIndex = 29 - idx;
      return {
        minute: `${mIndex}m ago`,
        activeUsers: minutesMap.get(mIndex) || 0,
      };
    });
  }

  // 2. Calculate country distribution from recent activity
  let calculatedCountryData = countryData;
  if (realtime && recentLogs.length > 0) {
    const countryMap = new Map<string, Set<string>>();
    recentLogs.forEach((log: any) => {
      const c = log.country || "Unknown";
      if (!countryMap.has(c)) {
        countryMap.set(c, new Set());
      }
      countryMap.get(c)!.add(log.sessionId);
    });
    calculatedCountryData = Array.from(countryMap.entries())
      .map(([country, sessions]) => ({
        country,
        activeUsers: sessions.size,
      }))
      .sort((a, b) => b.activeUsers - a.activeUsers);
  }

  const maxActiveUsers = Math.max(
    ...calculatedCountryData.map((c) => c.activeUsers),
    1,
  );

  return {
    calculatedMinuteData,
    calculatedCountryData,
    maxActiveUsers,
  };
}
