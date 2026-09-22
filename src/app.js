import express from "express";
import pinoHttp from "pino-http";
import logger from "./utils/logger.js";
import studentRoutes from "./routes/studentRoutes.js";
import routes from "./routes/authRoutes.js";
import grievanceRoutes from "./routes/grievanceRoutes.js";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler.js";
import passport from "./config/passport.js";
import googleAuthRoutes from "./routes/googleAuthRoutes.js";
import "./models/associations.js";
import announcementRoutes from "./routes/announcementRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";

const app = express();
const httpLogger = pinoHttp({
  logger
});

app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());
app.use(httpLogger);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/admin/students", studentRoutes);
app.use("/auth", routes);
app.use("/auth", googleAuthRoutes);
app.use("/grievances", grievanceRoutes);
app.use("/announcements", announcementRoutes);
app.use("/notifications", notificationRoutes);

app.use(errorHandler);

export default app;
