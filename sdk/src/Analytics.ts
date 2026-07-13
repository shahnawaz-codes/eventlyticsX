import { sendEvent } from "./transport";
import { pageView, trackPageClick, pageExit } from "./events";

export interface AnalyticsConfig {
  projectKey: string;
  optional?: {
    endpoint?: string;
  };
}
const DEFAULT_ENDPOINT = "https://eventlyticsx.onrender.com/api/track";

export default class Analytics {
  // private fields
  private endpoint: string;
  private projectKey: string;
  private sessionId =
    "sess_" + Math.random().toString(36).slice(2) + Date.now();
  private startTime = Date.now();

  // configure the sdk
  constructor(config: AnalyticsConfig) {
    this.endpoint = config.optional?.endpoint || DEFAULT_ENDPOINT;
    this.projectKey = config.projectKey;
  }

  // send Event - transport___
  // Arrow property automatically binds 'this' context!
  private send = (eventName: string, data = {}) => {
    sendEvent(this.endpoint, this.projectKey, this.sessionId, eventName, data);
  };

  // events____
  pageView() {
    pageView(this.send);
  }

  trackPageClick() {
    trackPageClick(this.send);
  }

  pageExit() {
    pageExit(this.send, this.startTime);
  }

  private initialized: boolean = false;
  init() {
    if (this.initialized) return;
    this.initialized = true;
    // events call__
    this.pageView();
    this.trackPageClick();
    this.pageExit();
  }

  // custom event track___
  track(eventName: string, data = {}) {
    this.send(eventName, { metadata: data });
  }
}

