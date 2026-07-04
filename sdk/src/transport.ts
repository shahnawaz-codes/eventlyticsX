export type SendCallback = (eventName: string, data?: Record<string, any>) => void;

export function sendEvent(
  endPoint: string,
  projectKey: string,
  sessionId: string,
  eventName: string,
  data: Record<string, any> = {}
) {
  if (!endPoint || !projectKey) return;
  const payload = JSON.stringify({
    event: eventName,
    projectKey,
    path: window.location.pathname,
    sessionId,
    referrer: document.referrer,
    timeStamp: Date.now(),
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
