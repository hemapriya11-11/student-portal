import { Server } from "socket.io";

import { socketAuth } from "./socketAuth.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(socketAuth);

  io.on("connection", (socket) => {
    const { id, role } = socket.user;

    const userRoom = `user:${role}:${id}`;

    socket.join(userRoom);

    const roleRoom = `role:${role}`;

    socket.join(roleRoom);

    console.log(
      `User ${id} (${role}) joined ${userRoom}`,
    );

    console.log(
      `User ${id} (${role}) joined ${roleRoom}`,
    );

    console.log(
      `Socket connected: ${socket.id}`,
    );

    socket.on("disconnect", () => {
      console.log(
        `Socket disconnected: ${socket.id}`,
      );
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error(
      "Socket.IO has not been initialized",
    );
  }

  return io;
};