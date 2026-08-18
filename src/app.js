import express from "express";
import routes from "./routes/authRoutes.js";

const app = express();

app.use(express.json());

app.use("/auth", routes);

export default app;