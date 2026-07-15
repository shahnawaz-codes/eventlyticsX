# 📈 eventlyticsX — Real-time Web Analytics Platform

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=black)](https://neon.tech/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**eventlyticsX** is a modern, developer-first, privacy-focused, real-time web analytics platform. It allows developers to integrate a lightweight tracker into their websites to capture page views, clicks, and page exit durations automatically, while offering custom event tracking and a stunning real-time analytics dashboard.

---

## 📸 Visual Tour & Screenshots

Here is a preview of the **eventlyticsX** platform in action:

| 📊 Real-Time Analytics Dashboard | 📝 Developer Documentation & Setup |
| :---: | :---: |
| ![Dashboard](client/public/dashboard.png) | ![Documentation](client/public/docs.png) |
| **📈 Customized Reports** | **🛡️ Project Verification & Status** |
| ![Reports](client/public/reports.png) | ![Verify Page](client/public/verify-page.png) |

---

## ✨ Core Features

* 🚀 **Zero-Dependency Browser SDK (<3KB)**: Extremely lightweight tracking client supporting auto-initialization via CDN `<script>` tag or importable module via NPM.
* ⏱️ **Reliable Exit & Duration Tracking**: Uses `navigator.sendBeacon` to reliably track user session duration and exit behavior as pages close, without introducing blocking navigation delays.
* 🖱️ **Element Click Auto-Tracking**: Log interactive events effortlessly by simply adding `data-track="element-name"` attributes to any HTML element.
* ⚡ **WebSocket-Powered Real-Time Telemetry**: Real-time event notifications stream directly to the dashboard, auto-updating React Query's cache via WebSockets for a live telemetry feed.
* 👤 **Secure Authentication & Management**: User authentication and API route verification powered by Clerk.
* 🌐 **Automatic IP Geolocation & User Agent Parsing**: Resolves visitor locations (Country, City, Region) using lightweight geolocation lookup and categorizes browser, OS, and device types.

---

## 📐 Architecture & Data Flow

```mermaid
graph TD
    subgraph Client Application [Client Portal & Dashboards]
        NextJS[Next.js App Router]
        RQ[React Query & Cache]
        SIOC[Socket.io Client]
    end

    subgraph Browser SDK [eventlytics-browser SDK]
        SDK[JS/TS SDK Script]
        DataTrack[data-track elements]
        Beacon[navigator.sendBeacon]
    end

    subgraph Backend Server [Express API & WebSockets]
        Express[Express.js Server]
        SIOS[Socket.io Server]
        UAP[UA Parser & GeoIP]
        Prisma[Prisma Client]
    end

    subgraph Database Layer [Postgres DB]
        Neon[Neon Serverless Postgres]
    end

    %% Interactions
    SDK -->|Sends Event Beacons / HTTPS POST| Express
    Express -->|Read/Write Operations| Prisma
    Prisma -->|Queries / Persists| Neon
    SIOS -->|Real-time Socket Updates| SIOC
    SIOC -->|Updates State| RQ
    RQ -->|Renders UI| NextJS
    Express -.->|Clerk Auth Verification| Clerk[Clerk Auth Service]
```

### End-to-End Sequence Flow

```mermaid
sequenceDiagram
    autonumber
    actor Dev as Developer (User)
    actor Vis as Web Visitor
    participant PS as Project Service
    participant ES as Event Ingestion Service
    participant AS as Analytics Service
    participant DB as Postgres Database

    %% Flow A: Project Setup
    rect rgb(240, 248, 255)
    Note over Dev, DB: Flow A: Project Creation
    Dev->>PS: POST /api/projects (Name: "My Blog")
    PS->>DB: Insert Project (generate evX_uuid tracking key)
    DB-->>PS: Return Project Info
    PS-->>Dev: Return Tracking Key & SDK code
    end

    %% Flow B: Event Tracking
    rect rgb(245, 245, 245)
    Note over Vis, DB: Flow B: Ingesting Client Events
    Vis->>ES: SDK fires POST /api/track (Key: evX_uuid, Path: /home, OS: Windows)
    ES->>DB: Insert Event Record (Write-only)
    ES-->>Vis: HTTP 202 Accepted / 200 OK
    end

    %% Flow C: Analytics Dashboards
    rect rgb(230, 250, 230)
    Note over Dev, DB: Flow C: Viewing Dashboard Analytics
    Dev->>AS: GET /api/analytics?projectId=123&range=7d
    AS->>DB: Query Aggregations (filter by key, group by path, count unique sessionIds)
    DB-->>AS: Aggregated rows
    AS-->>Dev: JSON (unique visitors, trend arrays, top lists)
    end
```

---

## 🗂️ Project Structure

The project is modularly structured into the following services:

* 📦 [client/](file:///d:/CODING/SELF%20PROJECT/web%20analytics%20platform/client): Next.js App Router portal containing landing page, project setup views, live docs, interactive charts, and dashboard indicators.
* 📦 [server/](file:///d:/CODING/SELF%20PROJECT/web%20analytics%20platform/server): Express.js backend exposing authentication-guarded analytics REST APIs, event ingestion routes, and Socket.io setups.
* 📦 [sdk/](file:///d:/CODING/SELF%20PROJECT/web%20analytics%20platform/sdk): TypeScript compiler SDK utilizing `tsup` to bundle IIFE (browser CDN script) and ESM/CJS bundles.
* 📦 [sdk-test/](file:///d:/CODING/SELF%20PROJECT/web%20analytics%20platform/sdk-test): A React + Vite workspace serving as an active development playground to test and debug SDK integration.

---

## 💾 Database Schema

The database model is configured via Prisma ORM targeting PostgreSQL. Key tables are:

### `User`
* Uniquely maps Clerk authenticated users.
* [user.prisma](file:///d:/CODING/SELF%20PROJECT/web%20analytics%20platform/server/prisma/schema/user.prisma)

### `Project`
* Configures tracking targets under a `public_key` identifier.
* [project.prisma](file:///d:/CODING/SELF%20PROJECT/web%20analytics%20platform/server/prisma/schema/project.prisma)

### `Event`
* Stores metrics containing system agent identifiers (OS, Device, Browser), location lookups (Country, City, Region), time tracking markers (`duration`), referral details, and customized payloads.
* [event.prisma](file:///d:/CODING/SELF%20PROJECT/web%20analytics%20platform/server/prisma/schema/event.prisma)
* Includes compound indices on `(projectKey, createdAt)` and `(projectKey, sessionId)` for performance optimizations.

---

## 🚀 Local Development Setup

Follow these steps to run the entire stack locally.

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* A PostgreSQL instance (or [Neon](https://neon.tech/) connection)
* A [Clerk Developer Account](https://clerk.com/)

---

### Step 1: Clone the Repository & Install Dependencies

In each folder, run `npm install` to load packages:

```bash
# Install Server Dependencies
cd server && npm install

# Install Client Dependencies
cd ../client && npm install

# Install SDK Dependencies
cd ../sdk && npm install

# Install SDK Test Playground Dependencies
cd ../sdk-test && npm install
```

---

### Step 2: Environment Configurations

#### Backend Server
Create a `.env` file in the [server/](file:///d:/CODING/SELF%20PROJECT/web%20analytics%20platform/server) folder:

```env
PORT=5000
DATABASE_URL="postgresql://user:password@hostname:5432/dbname?sslmode=require"
DIRECT_URL="postgresql://user:password@hostname:5432/dbname?sslmode=require"

# Clerk Keys
CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret

# Frontend Client URL
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

#### Frontend Client
Create a `.env.local` file in the [client/](file:///d:/CODING/SELF%20PROJECT/web%20analytics%20platform/client) folder:

```env
NEXT_PUBLIC_SERVER_BASE_URL=http://localhost:5000

# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key
CLERK_SECRET_KEY=sk_test_your_secret_key
```

---

### Step 3: Initialize Database

Run Prisma migrations/schema pushes inside the [server/](file:///d:/CODING/SELF%20PROJECT/web%20analytics%20platform/server) folder to generate database tables:

```bash
cd server
npx prisma generate
npx prisma db push
```

---

### Step 4: Build the Browser SDK

Build the SDK assets before running the playground application:

```bash
cd sdk
npm run build
```
*This generates `/dist` files containing `index.js`, `index.cjs`, `index.d.ts`, and the IIFE CDN compilation target `tracker.global.js`.*

---

### Step 5: Run Applications

Open separate terminal windows and spin up local development servers:

```bash
# Start Express Server (Runs on port 5000)
cd server
npm run dev

# Start Next.js Client (Runs on port 3000)
cd client
npm run dev

# Start SDK Test Playground (Runs on port 5173)
cd sdk-test
npm run dev
```

---

## 🛠️ Browser SDK Usage & Integration

### Option A: CDN Integration (HTML Script Tag)
Simply include the compiled browser script on your HTML page before the closing `</head>` tag:

```html
<script 
  async
  src="https://cdn.jsdelivr.net/npm/eventlytics-browser@1/dist/tracker.global.js" 
  data-project-key="evX_your-public-project-key"
></script>
```

### Option B: Package Integration (React / Next.js / SPAs)
Instantiate the SDK as a singleton inside a dedicated helper file, e.g. [analytics.ts](file:///d:/CODING/SELF%20PROJECT/web%20analytics%20platform/sdk-test/src/analytics.ts):

```typescript
import { Analytics } from "eventlytics-browser";

// Instantiate the SDK singleton
export const analytics = new Analytics({
  projectKey: "evX_your-project-key-here",
  optional: {
    endpoint: "http://localhost:5000/api/track" // Custom tracking server url
  }
});

// Auto-track views, clicks, and page duration
analytics.init();
```

Use it anywhere inside your codebase:
```typescript
import { analytics } from "./analytics";

// Track dynamic user events
const handlePurchase = () => {
  analytics.track("purchase-completed", {
    amount: 99.00,
    item: "Pro Subscription Plan"
  });
};
```

---

## 📝 License

Distributed under the MIT License. See `LICENSE` inside [sdk/LICENSE](file:///d:/CODING/SELF%20PROJECT/web%20analytics%20platform/sdk/LICENSE) for details.
