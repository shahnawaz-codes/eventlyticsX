import { prisma } from "./db.js";

async function main() {
  console.log("Checking database connection...");
  
  // 1. Get all projects
  const projects = await prisma.project.findMany();
  console.log(`Found ${projects.length} project(s) in the database.`);
  
  if (projects.length === 0) {
    console.log("No projects found. Please sign up and create a project first via the dashboard.");
    return;
  }
  
  const targetProject = projects[0];
  console.log(`Seeding mock events for project: "${targetProject.name}" (Key: ${targetProject.public_key})`);
  
  const paths = ["/", "/docs/getting-started", "/pricing", "/blog/speed-matters", "/docs/api-reference", "/checkout"];
  const referrers = ["Google", "Twitter", "Direct", "HackerNews", "GitHub", "LinkedIn"];
  const eventTypes = ["page-view", "page-view", "page-view", "page-click"];
  const sessionIds = [
    "sess_a1b2c3d4", "sess_e5f6g7h8", "sess_i9j0k1l2", "sess_m3n4o5p6", 
    "sess_q7r8s9t0", "sess_u1v2w3x4", "sess_y5z6a7b8"
  ];
  
  const browsers = ["Chrome", "Firefox", "Safari", "Edge", "Opera"];
  const devices = ["desktop", "mobile", "tablet"];
  const oses = ["Windows", "macOS", "Linux", "iOS", "Android"];
  const countries = ["US", "IN", "GB", "DE", "FR", "JP", "CA"];

  // Create 20 mock events spread over the last 7 days
  const now = new Date();
  let createdCount = 0;
  
  for (let i = 0; i < 20; i++) {
    const randomPath = paths[Math.floor(Math.random() * paths.length)];
    const randomReferrer = referrers[Math.floor(Math.random() * referrers.length)];
    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const randomSession = sessionIds[Math.floor(Math.random() * sessionIds.length)];
    const randomBrowser = browsers[Math.floor(Math.random() * browsers.length)];
    const randomDevice = devices[Math.floor(Math.random() * devices.length)];
    const randomOs = oses[Math.floor(Math.random() * oses.length)];
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    
    // Distribute events over the last 7 days
    const randomDaysAgo = Math.floor(Math.random() * 7);
    const randomHoursAgo = Math.floor(Math.random() * 24);
    const eventTime = new Date(now.getTime() - (randomDaysAgo * 24 * 60 * 60 * 1000) - (randomHoursAgo * 60 * 60 * 1000));
    
    await prisma.event.create({
      data: {
        eventType: randomEvent,
        projectKey: targetProject.public_key,
        path: randomPath,
        referrer: randomReferrer,
        sessionId: randomSession,
        browser: randomBrowser,
        device: randomDevice,
        os: randomOs,
        country: randomCountry,
        createdAt: eventTime
      }
    });
    createdCount++;
  }
  
  console.log(`Successfully seeded ${createdCount} mock events!`);
}

main()
  .catch((err) => {
    console.error("Database seed failed:", err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
