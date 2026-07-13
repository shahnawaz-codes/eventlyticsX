import Analytics from "./Analytics";

// Auto-initialize when loaded in a browser via script tag
if (typeof window !== "undefined") {
  // Try using document.currentScript, fallback to script tags with data attributes
  const script = document.currentScript || document.querySelector("script[data-project-key]") || document.querySelector("script[data-website-id]");
  
  if (script) {
    const projectKey = script.getAttribute("data-project-key") || script.getAttribute("data-website-id");
    const endpoint = script.getAttribute("data-endpoint");
    
    if (projectKey) {
      const analytics = new Analytics({
        projectKey,
        optional: {
          endpoint: endpoint || undefined,
        },
      });
      
      // Auto boot the trackers (pageView, click, exit)
      analytics.init();
      
      // Attach to window so the developer can call it manually
      (window as any).Eventlytics = analytics;
    }
  }
}

export default Analytics;
