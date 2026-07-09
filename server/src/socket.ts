import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();
// create http server
const server = http.createServer(app);
const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

export const io = new Server(server, {
  cors: {
    origin: clientUrl,
    methods: ["GET", "POST"],
  },
});
// set io obj so that any controller can access it easily using req.app.get("io")
app.set("io", io);

//---------------------------------------------------------
// establish the connection b/w server and client
io.on("connection", (socket) => {
  io.use
  
  console.log("hello bro", socket.id);
  // join perticular project and receive the projectId from client
  socket.on("join-project", ({ projectKey, dateLabel }) => {
    // leave the privious rooms if joined
    if (socket.data.projectKey) {
      socket.leave(`dashboard:${projectKey}:${dateLabel}`);
      socket.leave(`dashboard:${projectKey}`);
    }
    socket.data.projectKey = projectKey;
    socket.data.filters = dateLabel;
    // create seprate room for each project so that they can avoid conflict
    socket.join(`dashboard:${projectKey}:${dateLabel}`);
    socket.join(`dashboard:${projectKey}`);
  });
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

export { app, server };
