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
