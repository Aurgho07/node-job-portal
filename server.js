// Import necessary modules and middleware
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import swaggerUi from "swagger-ui-express";
import swaggerDoc from "swagger-jsdoc";
import connectDB from "./config/db.js";
import errorMiddleware from "./middlewares/errorMiddleware.js"; // Updated error middleware import

// Import your route handlers
import testRoutes from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import jobsRoutes from "./routes/jobsRoute.js";
import userRoutes from "./routes/userRoutes.js";

//Dot ENV config
dotenv.config();

// MongoDB connection
connectDB();

// Swagger API config
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Job Portal Application",
      description: "Node Expressjs Job Portal Application",
    },
    servers: [
      {
        //url: "http://localhost:8080",
        url: "https://node-job-portal.onrender.com"
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const spec = swaggerDoc(options);

// Create the Express app
const app = express();

// Middleware
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/test", testRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/job", jobsRoutes);

// Swagger documentation route
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec));

// Error handling middleware - This should be registered after your routes
app.use(errorMiddleware);

// Port configuration
const PORT = process.env.PORT || 8080;

// Start the server
app.listen(PORT, () => {
  console.log(`Node Server Running In ${process.env.DEV_MODE} Mode on port no ${PORT}`.bgCyan.white);
});
