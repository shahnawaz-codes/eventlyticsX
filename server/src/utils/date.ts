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
  const startDate = startDateStr ? new Date(startDateStr as string) : undefined;
  const endDate = endDateStr ? new Date(endDateStr as string) : undefined;

  if (startDate && isNaN(startDate.getTime())) {
    throw new Error("Invalid startDate format");
  }
  if (endDate && isNaN(endDate.getTime())) {
    throw new Error("Invalid endDate format");
  }

  return { startDate, endDate };
};
