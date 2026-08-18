import express from "express";
<<<<<<< HEAD
import studentRoutes from "./routes/studentRoutes.js"
=======
import routes from "./routes/authRoutes.js";
>>>>>>> auth

const app = express();

app.use(express.json());

<<<<<<< HEAD
app.use("/students", studentRoutes);
=======
app.use("/auth", routes);
>>>>>>> auth

export default app;