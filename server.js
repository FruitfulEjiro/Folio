// Error Handling for synchronous functions outside Express
process.on("uncaughtException", err => {
  console.log("An uncaught error occured:", err);
  process.exit(1);
});

// Modules
import dotenv from "dotenv"

// Local Modules
import app from "./app.js"
import connectDB from "./model/DB.js"

dotenv.config();

// Connect to database
connectDB();

// START SERVER
const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}...`);
});

// Error Handling for asynchronous functions outside Express
process.on("unhandledRejection", error => {
  console.log(error);
  console.log("Unhandled Rejection: Shutting Down");

  server.close(() => {
    process.exit(1);
  });
});