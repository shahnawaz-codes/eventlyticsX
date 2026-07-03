import { parseISO, isValid } from "date-fns";

// Helper to construct date filters dynamically
export const getDateFilter = (startDate?: Date, endDate?: Date) => {
  if (!startDate && !endDate) return undefined;
  return {
    /** find events where createdAt >= startDate AND 
    createdAt <= endDate */
    createdAt: {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    },
  };
};

// Helper to extract and validate date query parameters
export const parseDateParams = (startDateStr: any, endDateStr: any) => {
  const startDate = startDateStr ? parseISO(startDateStr as string) : undefined;
  const endDate = endDateStr ? parseISO(endDateStr as string) : undefined;

  if (startDate && !isValid(startDate)) {
    throw new Error("Invalid startDate format");
  }
  if (endDate && !isValid(endDate)) {
    throw new Error("Invalid endDate format");
  }

  return { startDate, endDate };
};

