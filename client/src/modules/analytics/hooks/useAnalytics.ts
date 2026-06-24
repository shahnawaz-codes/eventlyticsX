import { useQuery } from "@tanstack/react-query";
import { getBreakdowns, getOverview } from "../services/analytics";

type Date = {
  startDate: string;
  endDate: string;
};
export const useAnalytics = {
  overview: (projectId: string, date?: Date) => {
    return useQuery({
      queryKey: ["overview", projectId],
      queryFn: () => getOverview(projectId, date),
    });
  },
  Breakdowns: (projectId: string, date?: Date) => {
    return useQuery({
      queryKey: ["breakdowns", projectId],
      queryFn: () => getBreakdowns(projectId, date),
    });
  },
  getRealtime: (projectId: string) => {
    return useQuery({
      queryKey: ["realtime", projectId],
      queryFn: () => getOverview(projectId),
    });
  },
  getTimeseries: (projectId: string) => {
    return useQuery({
      queryKey: ["timeSeries", projectId],
      queryFn: () => getOverview(projectId),
    });
  },
};
