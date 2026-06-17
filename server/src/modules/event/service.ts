import { prisma } from "../../db.js";

interface TrackEventInput {
  event?: string;
  projectKey?: string;
  path?: string;
  referrer?: string;
  sessionId?: string;
  browser?: string;
  device?: string;
  country?: string;
  os?: string;
}

export const trackEventService = async (input: TrackEventInput) => {
  return await prisma.event.create({
    data: {
      eventType: input.event || "pageview",
      projectKey: input.projectKey as string,
      path: input.path || "/",
      referrer: input.referrer || "",
      sessionId: input.sessionId || "session_unknown",
      browser: input.browser || "unknown",
      os: input.os || "unknown",
      device: input.device || "desktop",
      country: input.country || "unknown",
    },
  });
};
