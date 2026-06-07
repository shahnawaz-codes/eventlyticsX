interface LogAnalyticsInput {
  event?: string;
  projectKey?: string;
  path?: string;
  referrer?: string;
  [key: string]: any;
}

export const logAnalyticsService = async (input: LogAnalyticsInput) => {
  const { event, projectKey, path, referrer, ...data } = input;
  console.log("event", event, projectKey, path, referrer);
  console.log("data", data);
  return { success: true };
};
