import expres from "express";
import { Server } from "socket.io";
import http from "http";

const app = expres();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
app.set("io", io);
io.on("connection", (socket) => {
  console.log("hello bro", socket.id);
  socket.on("msg", (msg) => {
    console.log(msg);
  });
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

export { app, server };
