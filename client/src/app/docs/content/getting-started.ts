export const gettingStartedContent = `# Getting Started with eventlyticsX

Welcome to **eventlyticsX**—the privacy-first, lightweight, real-time analytics provider for developers. Our tracking library uses an event-driven flow to record page views, exit durations, and element clicks while ensuring compliance with GDPR/CCPA out of the box (without requiring intrusive cookie banners).

---

## Core Ingestion Pipeline

To understand how telemetry travels from your browser page to your dashboard, here is the lifecycle flow of your tracking metrics:

{{DIAGRAM:DATA_LIFE_CYCLE}}

---

## Integration Paths

eventlyticsX provides multiple integration routes depending on your web stack:

### 1. React Browser SDK (NPM)
Install \`eventlytics-browser\` inside modern module bundlers (like React, Vite, Next.js, or Vue) to gain full TypeScript type safety, autocomplete support, and lifecycle hook integration.

### 2. CDN Script Tag (HTML)
For static HTML sites, Webflow, WordPress, or Shopify, include a single async script tag to automatically initialize tracking and auto-capture event telemetry.

### 3. Direct HTTP Ingest
If you are building custom backend wrappers or dispatching events from server runtimes (like Node.js, Python, or Go), you can send HTTP POST payloads directly to our ingestion gateway.

---

## Workspace Configuration

All telemetry logs are grouped under specific project workspace properties. To link your application:
- Select your active project in the top-right workspace selector.
- Use the generated **Public key** (\`{{PROJECT_KEY}}\`) to initialize your client.
`;
