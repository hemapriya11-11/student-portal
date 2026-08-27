import express from "express";
import studentRoutes from "./routes/studentRoutes.js";
import routes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/students", studentRoutes);
app.use("/auth", routes);

app.use(errorHandler);

export default app;