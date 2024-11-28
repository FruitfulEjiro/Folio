const express = require("express");
const cookieParser = require("cookie-parser");
const hbs = require("hbs");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const hpp = require("hpp");

// Local modules
const ErrorHandler = require("./controller/errorController");
const AppError = require("./Utils/AppError");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  signout
} = require("./controller/authController");
const { updateMe, userImageProcessor } = require("./controller/userController");
const {
  ImgUpload,
  imageProcessor,
  createPortfolio,
  fetchUserPortfolio
} = require("./controller/portfolioController");

const uploadFiles = ImgUpload.fields([
  { name: "resume", maxCount: 1 },
  { name: "projectImage", maxCount: 10 }
]);

// initialize express app
const app = express();

// Express Rate Limiting
const limiter = rateLimit({
  max: 100, //this should depend on the amount of request traffic the app receives
  windowMs: 60 * 60 * 100,
  message: "Too many requests, try again in 1 hour"
});

// Middlewares
app.set("view engine", "hbs");
app.use(
  express.json({
    limit: "1mb" //Limits the amount of data that cn be sent through the body of the request
  })
);
app.use(express.static("Public"));
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

// Error Handling Middleware
app.use(ErrorHandler);

// Authentication Middleware
app.use("/dashboard", protect);
app.use("/profile", protect);
// app.use("/create-portfolio", createPortfolio)

// register partials directory for hbs
hbs.registerPartials(`${__dirname}/Views/Partials`);

// register default values for template
hbs.registerHelper("default", function(value, defaultValue) {
  return value || defaultValue;
});

// -----------------------------+++-----------------------------
// ROUT HANDLERS
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/templates", (req, res) => {
  res.render("explore-templates");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", signup);

app.post("/login", login);

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/signout", signout);

app.get("/forgot_password", (req, res) => {
  res.render("forgot-password");
});

app.get("/reset_password", (req, res) => {
  res.render("reset-password");
});

app.get("/profile", (req, res) => {
  const user = req.user;
  res.render("profile", { user });
});

app.patch("/update-profile", protect, updateMe);

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/dashboard", (req, res) => {
  const user = req.user;
  res.render("dashboard", { user });
});

app.post(
  "/create-portfolio",
  protect,
  uploadFiles,
  imageProcessor,
  createPortfolio
);

app.patch(
  "/create-portfolio",
  protect,
  uploadFiles,
  imageProcessor,
  createPortfolio
);

app.get("/create-portfolio", protect, (req, res) => {
  res.render("template-form");
});

// app.get("/temp0", (req, res) => {
//   res.render("templates/5555");
// });

app.get("/me/:slug", fetchUserPortfolio);

// Unhandled Routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} in the server`, 404));
});

module.exports = app;
