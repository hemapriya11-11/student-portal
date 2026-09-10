
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  auth: {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6ImFkbWluIiwianRpIjoiYWI0NjEzNDYtYzAxNC00NDMxLTljNmMtZDM1YWEwNDVlMzRjIiwiaWF0IjoxNzg4ODYxOTgwLCJleHAiOjE3ODg4NjI4ODB9.AeUEjS0baXGfCEgsGrK81pIe9Cpq8EVthW9JNvbJYdQ" },
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Connection failed:", error.message);
});

socket.on("announcement:created", (announcement) => {
  console.log("New announcement received:", announcement);
});

socket.on("announcement:updated", (announcement) => {
  console.log("Announcement updated:", announcement);
});

socket.on("announcement:deleted", (announcement) => {
  console.log("Announcement deleted:", announcement);
});

socket.on("disconnect", () => {
  console.log("Disconnected from Socket.IO server");
});

