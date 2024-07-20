const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./model/DB");

dotenv.config();

// Connect to database
connectDB();

// START SERVER
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`App is running on port ${PORT}...`);
});