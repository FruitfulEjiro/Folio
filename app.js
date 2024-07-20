const express = require("express");
const hbs = require("hbs");
const bcrypt = require("bcrypt");

// Local modules
const User = require("./model/userschema");

const app = express();

// Number of salt rounds
const saltRounds = 10;

const hashPassword = async password => {
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(saltRounds);
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};

// Function to create new user
const createUser = async ({ fullname, email, password }) => {
  try {
    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      name: fullname,
      email,
      password: hashedPassword
    });

    await newUser.save();
    console.log("User saved");
  } catch (err) {
    console.log("Error saving user:", err);
  }
};

// Middlewares
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.static("Public"));
app.use(express.urlencoded({ extended: true }));

// register partials directory for hbs
hbs.registerPartials(`${__dirname}/Views/Partials`);

// Route handlers
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/templates", (req, res) => {
  res.render("explore-templates");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  createUser(req.body);
  res.redirect("/");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/temp", (req, res) => {
  res.render("templates/temp1");
});

// Unhandled Routes
app.all("*", (req, res) => {
  res.status(404).json({
    status: "Fail",
    message: `Can't find ${req.originalUrl} in the server`
  });
});

module.exports = app;
