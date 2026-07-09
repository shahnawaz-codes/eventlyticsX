export const reactSdkContent = `# React & Browser SDK Integration

Our modular browser SDK is distributed via NPM as \`eventlytics-browser\`. It is class-based, allowing you to create a dedicated configuration file and initialize event tracking listeners at your application entry point.

---

## SDK Execution Lifecycle

The following sequence outlines how the SDK instantiates, generates session metadata, and binds to browser DOM actions:

{{DIAGRAM:SDK_INIT_LIFECYCLE}}

---

## 1. Installation

Install the package via npm or yarn:

\`\`\`bash
npm install eventlytics-browser
\`\`\`

---

## 2. Configuration Setup

To avoid multiple instances, create a dedicated configuration file (e.g., \`src/analytics.ts\`) to instantiate the client class:

\`\`\`typescript
import { Analytics } from "eventlytics-browser";

// Instantiate the SDK singleton
export const analytics = new Analytics({
  projectKey: "{{PROJECT_KEY}}",
  optional: {
    endpoint: "{{API_ENDPOINT}}" // Optional custom ingestion backend URL
  }
});
\`\`\`

---

## 3. Bind Event Listeners

Import and initialize the analytics client in your entry file (e.g., \`src/main.tsx\` or \`src/index.tsx\`) before mounting the DOM layout:

\`\`\`typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { analytics } from "./analytics";

// Binds auto-pageview, exit duration, and element clicks on window load
analytics.init();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
\`\`\`

---

## 4. Element Auto-Tracking

Once initialized, the SDK intercepts DOM clicks and checks for elements containing a \`data-track\` attribute:

{{DIAGRAM:CLICK_INTERCEPTOR}}

Simply add the attribute to any HTML element to capture clicks automatically:

\`\`\`html
<!-- Clicks will be intercepted and sent automatically with the name "signup-hero" -->
<button data-track="signup-hero">
  Sign Up Now
</button>
\`\`\`

---

## 5. Manual Event Dispatching

Call \`.track()\` directly on your analytics client to log custom conversions or user actions:

\`\`\`typescript
import { analytics } from "../analytics";

const handleCheckout = (cartItems) => {
  // Dispatches custom event with custom properties metadata
  analytics.track("purchase-completed", {
    itemsCount: cartItems.length,
    value: 129.00,
    currency: "USD"
  });
};
\`\`\`
`;
