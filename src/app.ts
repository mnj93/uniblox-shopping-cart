import express from "express";
import routes from "./routes";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();

// middlewares
app.use(express.json());

// routes
app.use("/api", routes);

export default app;
