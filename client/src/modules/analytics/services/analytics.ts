import { api } from "@/lib/axios";
type Date = {
  startDate: string;
  endDate: string;
};
export const getOverview = async (projectId: string, date?: Date) => {
  const { data } = await api.get("/analytics/overview", {
    params: {
      projectId,
      startDate: date?.startDate,
      endDate: date?.endDate,
    },
  });
  return data.data;
};
export const getBreakdowns = async (projectId: string, date?: Date) => {
  const { data } = await api.get("/analytics/breakdowns", {
    params: {
      projectId,
      startDate: date?.startDate,
      endDate: date?.endDate,
    },
  });
  return data.data;
};

export const getRealtime = async (projectId: string) => {
  const { data } = await api.get("/analytics/realtime", {
    params: {
      projectId,
    },
  });
  return data.data;
};

export const getTimeseries = async (projectId: string, date?: Date) => {
  const { data } = await api.get("/analytics/timeseries", {
    params: {
      projectId,
      startDate: date?.startDate,
      endDate: date?.endDate,
    },
  });
  return data.data;
};
