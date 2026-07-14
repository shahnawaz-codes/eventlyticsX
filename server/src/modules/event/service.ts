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
  utm_campaign?: string | null;
  utm_source?: string | null;
  utm_medium?: string | null;
  duration?: number | null;
  metadata?: Record<string, any> | null;
}

export const trackEventService = async (input: TrackEventInput) => {
  const { projectKey } = input;
  const project = await prisma.project.findUnique({
    where: { public_key: projectKey },
  });
  if (!project) {
    throw new Error(`Project with key ${projectKey} not found`);
  }

  if (!project.verified) {
    await prisma.project.update({
      where: { id: project.id },
      data: { verified: true },
    });
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
      utm_campaign: input.utm_campaign || null,
      utm_source: input.utm_source || null,
      utm_medium: input.utm_medium || null,
      duration: input.duration ?? null,
      metadata: input.metadata || {},
    },
  });
  
  return newEvent;
};

