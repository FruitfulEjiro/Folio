const crypto = require("crypto");
const User = require("../model/userSchema");
const CatchAsync = require("../Utils/ErrorHandler");
const AppError = require("../Utils/AppError");
const jwt = require("jsonwebtoken");
const sendEmail = require("../Utils/Email");

// Generate JWT
const generateToken = userID => {
  const token = jwt.sign({ id: userID }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
  return token;
};

const createSendToken = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === "Production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
};

// Signup function
const signup = CatchAsync(async (req, res, next) => {
  const { fullname, email, password, confirmPassword } = req.body;

  // Create User
  const newUser = await User.create({
    name: fullname,
    email,
    password,
    confirmPassword
  });

  // Generate JWT token and send via Cookie
  createSendToken(newUser, 201, res);

  res.redirect("/dashboard");
});

// Login function
const login = CatchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please Provide Email and Password", 400));
  }

  // Find User by email
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect Email or Password", 401));
  }

  // Generate JWT token and send via Cookie
  createSendToken(user, 201, res);

  res.redirect("/dashboard");
});

// Forgot password function
const forgotPassword = CatchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Get user from Database
  const user = await user.find({ email });
  if (!user) {
    return next(new AppError("No User found with tis Email", 404));
  }

  // Generate random reset token
  const resetToken = createPasswordResetToken();
  await user.save({ validatebeforeSave: false });

  // Send Mail to user
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/resetPassword/${resetToken}`;

  const message = `Forgot Password? Click on this link: ${resetURL} to reset your password. Pls ignore this email if you didn't request to reset your password`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Your Password Reset Token (Valid for 10 mins)",
      message
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to your mail"
    });
  } catch (Err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("An error Occured, try sending mail again", 500));
  }
});

// Reset password function
const resetPassword = CatchAsync(async (req, res, next) => {
  // Get user based on the reset token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.param.token)
    .digest("hex");
  const user = await user.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // If user is found and token has not expires, set new password
  if (!user) {
    return next(new AppError("Token is invalid or expired", 401));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // Update passwordChangedAt for user
  // Handled using a Mongoose middleware

  // Log in user
  const token = generateToken(user._id);

  res.status(200).json({
    status: "success",
    token
  });
});

// Update password function
const updatePassword = CatchAsync(async (req, res, next) => {
  const { id, password, passwordConfirm } = req.body;
  // Get user from collection
  const user = await User.findById(id).select("+password");

  // Check if the current password is correct
  if (!(await user.correctPassword(password, user.password))) {
    return next(new AppError("Your current password is wrong", 401));
  }

  // Update Password
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  await user.save();

  // login user
  createSendToken(user, 200, res);
});

// Middleware to Protect Routes
const protect = CatchAsync(async (req, res, next) => {
  // Retrieve the token from cookie
  let token = req.cookies.jwt;

  if (!token) {
    res.redirect("/login");
    return next(new AppError("You are not Logged in", 401));
  }

  // Verify JWT
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find User by id from decoded token
  const user = await User.findById(decoded.id);
  if (!user) {
    return next(
      new AppError("The User belonging to this token no longer exists", 401)
    );
  }

  // Check if user changed password after token was issued
  if (user.changedPasswordAt(decoded.iat)) {
    return next(new AppError("User changed password, Login again", 401));
  }

  // Grant Access to the Protected Rutes
  req.user = user;
  next();
});

// Middleware to Signout Users
const signout = CatchAsync(async (req, res, next) => {
  res.cookie("jwt", "Logged Out", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.redirect("/");
});

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  signout
};
