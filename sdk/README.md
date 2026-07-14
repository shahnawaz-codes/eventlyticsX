# Eventlytics Browser SDK

`eventlytics-browser` is a lightweight, zero-dependency, privacy-focused browser analytics SDK designed to work seamlessly with the Eventlytics platform. 

It automatically captures page views, clicks, and page exit durations, and supports manual custom event tracking—all with built-in TypeScript support and a tiny bundle footprint (< 3KB).

---

## Features

* 🚀 **Zero Dependencies**: Pure TypeScript/JavaScript with a minuscule bundle size.
* 📈 **Automated Page Views**: Tracks initial page loads and page metadata automatically.
* 🖱️ **Element Click Tracking**: Intercepts and tracks clicks on elements containing `data-track` attributes.
* ⏱️ **Reliable Page Exit Tracking**: Measures session duration and uses `navigator.sendBeacon` to send metrics reliably before the page unloads.
* 🛠️ **Custom Event Tracking**: Track custom user actions using `analytics.track()`.
* 📦 **TypeScript Support**: Native `.d.ts` declaration exports for autocomplete and compile-time checks.

---

## Installation

### Option A: NPM or Yarn

Install via npm:

```bash
npm install eventlytics-browser
```

Or via yarn:

```bash
yarn add eventlytics-browser
```

### Option B: HTML Script Tag (CDN)

For static HTML sites, Webflow, WordPress, or Shopify, you can embed the compiled tracker script directly via a CDN (like jsDelivr):

```html
<script 
  async
  src="https://cdn.jsdelivr.net/npm/eventlytics-browser@1/dist/tracker.global.js" 
  data-project-key="evX_your-public-project-key"
></script>
```

#### Configuration via Data Attributes:
* `data-project-key` (or `data-website-id`): Your public project key.
* `data-endpoint` (optional): A custom backend URL where tracking requests are sent.

When using this method, the SDK automatically initializes itself and exposes the instance on `window.Eventlytics`. You can manually dispatch custom events anywhere in your code:

```javascript
window.Eventlytics.track("custom-event-name", { key: "value" });
```

---

## Quick Start

### 1. Initialize the SDK
Configure and instantiate the SDK with your project key. If you are self-hosting, you can also specify a custom tracking endpoint:

```javascript
import { Analytics } from "eventlytics-browser";

// Instantiate the SDK (using the default hosted endpoint)
const analytics = new Analytics({
  projectKey: "evX_your-public-project-key"
});

// OR: If you are self-hosting, specify your own backend endpoint
const analytics = new Analytics({
  projectKey: "evX_your-public-project-key",
  optional: {
    endpoint: "https://your-analytics-domain.com/api/track"
  }
});

// Start auto-tracking page-views, clicks, and exits
analytics.init();
```

### 2. Auto-Tracking Elements
To automatically track specific button or link clicks, simply add a `data-track` attribute to your HTML elements:

```html
<!-- The SDK will automatically capture clicks on this button -->
<button data-track="signup-button-hero">
  Sign Up Now
</button>
```

### 3. Track Custom Events
Call `.track()` directly to capture custom actions and metadata:

```javascript
analytics.track("purchase-completed", {
  item: "Premium Plan Subscription",
  value: 49.00,
  currency: "USD"
});
```

---

## Usage in React / Next.js / SPAs

To avoid circular dependencies, it is recommended to create a dedicated configuration file (e.g., `src/analytics.ts`) to instantiate the SDK as a singleton, and then initialize it at your application's entry point (`main.tsx` or `index.tsx`).

### Step 1: Create a Shared Client (`src/analytics.ts`)
```typescript
import { Analytics } from "eventlytics-browser";

// Create the singleton instance
export const analytics = new Analytics({
  projectKey: "evX_your-project-key-here",
  optional: {
    endpoint: "http://localhost:5000/api/track" // Override for local testing
  }
});
```

### Step 2: Initialize in Entry Point (`src/main.tsx`)
```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { analytics } from "./analytics";

// Initialize tracking once on app load
analytics.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Step 3: Use Anywhere (`src/components/MyButton.tsx`)
```typescript
import React from "react";
import { analytics } from "../analytics";

export function MyButton() {
  const handleClick = () => {
    analytics.track("feature-clicked", { featureName: "Dark Mode Toggle" });
  };

  return <button onClick={handleClick}>Toggle Dark Mode</button>;
}
```

---

## API Reference

### `new Analytics(config)`
Creates a new client instance.

* **`config`** (`AnalyticsConfig`): The configuration options.
  * **`projectKey`** (`string`): Your public Eventlytics project identifier.
  * **`optional`** (`object`, optional):
    * **`endpoint`** (`string`, optional): A custom backend URL where tracking requests are sent. Defaults to `https://eventlyticsx.onrender.com`.

### `analytics.init()`
Sets up the automatic DOM tracking listeners. Call this once at your application's startup.
* Automatically records a `page-view` event.
* Starts listening for clicks on elements with `data-track`.
* Starts tracking page session durations and beacons a `page-exit` event before unload.

### `analytics.pageView()`
Manually triggers a `page-view` event. This is useful in Single-Page Applications (SPAs) to track dynamic client-side route changes (where full browser reloads do not occur).

### `analytics.track(eventName, [data])`
Tracks a custom event manually.

* **`eventName`** (`string`): Name of the event you want to log.
* **`data`** (`Record<string, any>`): Optional key-value object containing metadata to store with the event.

---

## Browser Support

Works on all modern evergreen browsers supporting:
* `Fetch API`
* `Beacon API` (`navigator.sendBeacon`)
* standard DOM `addEventListener`

---

## License

MIT License.
