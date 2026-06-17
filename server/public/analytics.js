const Analytics = (function () {
  let _endPoint = "";
  let _projectKey = "";
  let _sessionId = "sess_" + Math.random().toString(36).slice(2) + Date.now();
  let _startTime = Date.now();
  const send = (eventName, data = {}) => {
    if (!_endPoint || !_projectKey) return;
    let payload = JSON.stringify({
      event: eventName,
      projectKey: _projectKey,
      path: window.location.pathname,
      sessionId: _sessionId,
      referrer: document.referrer,
      timeStamp: Date.now(),
      ...data,
    });
    if (eventName === "page-exit") {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(_endPoint, blob);
    } else {
      fetch(_endPoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  };
  function pageView() {
    send("page-view", { title: document.title, url: window.location.href });
  }
  function trackPageClick() {
    document.addEventListener("click", (e) => {
      const el = e.target.closest("[data-track]");
      if (!el) return;
      send("page-click", {
        label: el.dataset.track,
        text: el.innerText?.slice(0, 50),
      });
    });
  }
  function pageExit() {
    window.addEventListener("beforeunload", () => {
      send("page-exit", {
        duration: Math.round((Date.now() - _startTime) / 1000),
      });
    });
  }
  return {
    init(endPoint, projectKey) {
      _endPoint = endPoint;
      _projectKey = projectKey;
      pageView();
      pageExit();
      trackPageClick();
    },
    track(eventName, data = {}) {
      send(eventName, data);
    },
  };
})();
k;
