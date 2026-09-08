import { io } from "socket.io-client";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OSwicm9sZSI6InN0dWRlbnQiLCJqdGkiOiI1ODUxZjQyMS03ZjRhLTRiNTEtYTRiZi02NjZhODkyYjM3ZDYiLCJpYXQiOjE3ODg4NjE1NzIsImV4cCI6MTc4ODg2MjQ3Mn0.x2wRj521gCZR3_9nHHDcERnifZEDPUgheybnvjP2k04"

const socket = io("http://localhost:3000", {
  auth: {
    token: TOKEN,
  },
});

socket.on("connect", () => {
  console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
  console.log("Socket connection error:", error.message);
});

socket.on("grievance:created", (grievance) => {
  console.log(
    "\n New grievance created:",
  );

  console.log(grievance);
});

socket.on("grievance:assigned", (grievance) => {
  console.log(
    "\n Grievance assigned:",
  );

  console.log(grievance);
});

socket.on("grievance:updated", (grievance) => {
  console.log(
    "\n Grievance updated:",
  );

  console.log(grievance);
});

socket.on("disconnect", () => {
  console.log("Socket disconnected");
});