import express from "express";
import studentRoutes from "./routes/studentRoutes.js"
import routes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";


const app = express();

app.use(express.json());
app.use(cookieParser());


app.use("/students", studentRoutes);

app.use("/auth", routes);



export default app;