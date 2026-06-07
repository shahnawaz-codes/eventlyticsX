import { prisma } from "../../db.js";

interface TrackEventInput {
  event?: string;
  projectKey?: string;
  path?: string;
  referrer?: string;
  sessionId?: string;
}

export const trackEventService = async (input: TrackEventInput) => {
  return await prisma.event.create({
    data: {
      eventType: input.event || "pageview",
      projectKey: input.projectKey || "default",
      path: input.path || "/",
      referrer: input.referrer || "",
      sessionId: input.sessionId || "session_unknown",
    },
  });
};
