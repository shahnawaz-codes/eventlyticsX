export const apiReferenceContent = `# HTTP Ingestion API Reference

For non-browser environments, custom backend integration, or server runtimes (like Node.js, Python, or Go), dispatch tracking payloads directly to our HTTP ingestion gateway.

---

## Endpoint Details

Send JSON payloads via POST request to the tracker route:

\`\`\`http
POST {{API_ENDPOINT}}
Content-Type: application/json
\`\`\`

---

## cURL Request Template

\`\`\`bash
curl -X POST "{{API_ENDPOINT}}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "event": "page-view",
    "projectKey": "{{PROJECT_KEY}}",
    "sessionId": "sess_dev_98246187",
    "data": {
      "path": "/pricing",
      "referrer": "https://google.com",
      "pageTitle": "Plans & Pricing",
      "browser": "Firefox",
      "deviceType": "desktop"
    }
  }'
\`\`\`

---

## Payload Schema Fields

The ingestion route validates requests against the following JSON fields:

| Field Name | Type | Status | Description |
| :--- | :--- | :--- | :--- |
| **event** | \`string\` | **Required** | The tag name of the action (e.g. \`page-view\`, \`click\`, \`checkout\`). |
| **projectKey** | \`string\` | **Required** | The public property key associated with your workspace accounts. |
| **sessionId** | \`string\` | **Required** | Browser tab session identifier to compute exit duration and bounce rates. |
| **data** | \`object\` | *Optional* | Key-value dictionary containing custom properties metadata. |

---

## Gateway Response Statuses

The EventlyticsX ingestion gateway handles request validation and returns the following HTTP status codes:

- **\`200 OK\` / \`202 Accepted\`**: Ingestion success. The payload was validated, queued, and will appear on the workspace dashboard in real time.
- **\`401 Unauthorized\`**: Authentication error. The supplied \`projectKey\` parameter does not exist in any database account.
- **\`429 Too Many Requests\`**: Rate limiting trigger. The sending domain has exceeded its designated billing quota limits.
`;
