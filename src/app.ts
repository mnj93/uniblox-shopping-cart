import express from "express";
import routes from "./routes";
import * as dotenv from "dotenv";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

dotenv.config();
const app = express();

// Load the YAML file
const swaggerDocument = YAML.load("./swagger.yaml");
// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// middlewares
app.use(express.json());

// routes
app.use("/api", routes);

export default app;
