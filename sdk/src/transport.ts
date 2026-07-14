export type SendCallback = (eventName: string, data?: Record<string, any>) => void;

export function sendEvent(
  endPoint: string,
  projectKey: string,
  sessionId: string,
  eventName: string,
  data: Record<string, any> = {}
) {
  if (!endPoint || !projectKey) return;

  // Automatically capture UTM parameters from the URL
  let utms: Record<string, string> = {};
  if (typeof window !== "undefined") {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const campaign = urlParams.get("utm_campaign");
      const source = urlParams.get("utm_source");
      const medium = urlParams.get("utm_medium");
      
      if (campaign) utms.utm_campaign = campaign;
      if (source) utms.utm_source = source;
      if (medium) utms.utm_medium = medium;
    } catch (e) {
      console.warn("Failed to parse UTM parameters:", e);
    }
  }

  const payload = JSON.stringify({
    event: eventName,
    projectKey,
    path: window.location.pathname,
    sessionId,
    referrer: document.referrer,
    timeStamp: Date.now(),
    ...utms,
    ...data,
  });

  if (eventName === "page-exit") {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon(endPoint, blob);
  } else {
    fetch(endPoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  }
}

