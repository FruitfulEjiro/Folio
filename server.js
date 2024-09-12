// Error Handling for synchronous functions outside Express
process.on("uncaughtException", err => {
  console.log("An uncaught error occured:", err);
  // process.exit(1);
});

// Modules
const dotenv = require("dotenv");

// Local Modules
const app = require("./app");
const connectDB = require("./model/DB");

dotenv.config();

// Connect to database
connectDB();

// START SERVER
const PORT = 3000;
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
