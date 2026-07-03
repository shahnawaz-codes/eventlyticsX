import { useQuery } from "@tanstack/react-query";
import {
  getBreakdowns,
  getOverview,
  getRealtime,
  getTimeseries,
} from "../../services/analytics";

type DateRange = {
  startDate: string;
  endDate: string;
};

export const useAnalytics = {
  overview: (projectId: string, date?: DateRange) => {
    return useQuery({
      queryKey: ["overview", projectId, date],
      queryFn: () => getOverview(projectId, date),
    });
  },
  breakdowns: (projectId: string, date?: DateRange) => {
    return useQuery({
      queryKey: ["breakdowns", projectId, date],
      queryFn: () => getBreakdowns(projectId, date),
    });
  },
  getRealtime: (projectId: string, options?: { refetchInterval?: number }) => {
    return useQuery({
      queryKey: ["realtime", projectId],
      queryFn: () => getRealtime(projectId),
      refetchInterval: options?.refetchInterval,
    });
  },
  getTimeseries: (projectId: string, date?: DateRange) => {
    return useQuery({
      queryKey: ["timeSeries", projectId, date],
      queryFn: () => getTimeseries(projectId, date),
    });
  },
};
