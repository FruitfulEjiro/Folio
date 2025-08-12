import express from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cors from "cors";

// Local modules
import ErrorHandler from "./Utils/error.js";
import router from "./routes/route.js";

// initialize express app
const app = express();
app.use(
  cors({
    origin: ["http://localhost:8080"], // Specify the full origin with protocol and port
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
  })
);

// Express Rate Limiting
const limiter = rateLimit({
  max: 100, //this should depend on the amount of request traffic the app receives
  windowMs: 60 * 60 * 1000,
  message: "Too many requests, try again in 1 hour"
});

// Middlewares
app.set("view engine", "hbs");
app.use(
  express.json({
    limit: "20mb" //Limits the amount of data that can be sent through the body of the request
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Secutity Middlewares
app.use(helmet());

// Rate Limiting
app.use(limiter);

// Data Sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against Cross-site-scripting
app.use(xss());

// Preventing parameter pollution
app.use(hpp());

// Route Handlers
app.use(router);

// Error Handling Middleware
app.use(ErrorHandler);

export default app;
