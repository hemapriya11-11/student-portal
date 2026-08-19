import express from "express";
import studentRoutes from "./routes/studentRoutes.js"
import routes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

app.use("/students", studentRoutes);
app.use("/auth", routes);

export default app;