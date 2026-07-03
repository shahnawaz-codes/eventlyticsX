import { prisma } from "../../config/db.js";

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
  city?: string;
  region?: string;
}

export const trackEventService = async (input: TrackEventInput) => {
  const { projectKey } = input;
  const project = await prisma.project.findUnique({
    where: { public_key: projectKey },
  });
  if (!project) {
    throw new Error(`Project with key ${projectKey} not found`);
  }

  const newEvent = await prisma.event.create({
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
      city: input.city || null,
      region: input.region || null,
    },
  });
  return newEvent;
};
