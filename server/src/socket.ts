import expres from "express";
import { Server } from "socket.io";
import http from "http";

const app = expres();
// create http server
const server = http.createServer(app);
// accept the socket upgrade req and set the cors config for security
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
// set io obj so that any controller can access it easily using req.app.get("io")
app.set("io", io);

//---------------------------------------------------------
// establish the connection b/w server and client
io.on("connection", (socket) => {

  console.log("hello bro", socket.id);
  // join perticular project and receive the projectId from client
  socket.on("join-project", ({ projectKey }) => {
    console.log("client:", projectKey);
    socket.join(`dashboard:${projectKey}`);
  });
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

export { app, server };
