import express from "express";
import studentRoutes from "./routes/studentRoutes.js";
import routes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import passport from "./config/passport.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";

const app = express();


app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

app.use("/admin/students", studentRoutes);
app.use("/auth", routes);
app.use("/auth", googleAuthRoutes);

app.use(errorHandler);

export default app;