import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_SERVER_BASE_URL || "http://localhost:5000";

export const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
});
