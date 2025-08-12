import crypto from "crypto";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "You must put a name"]
  },
  email: {
    type: String,
    required: [true, "You must add an email"],
    unique: [true]
  },
  password: {
    type: String,
    select: false,
    required: [true, "You must put a password"]
  },
  confirmPassword: {
    type: String,
    select: false,
    required: [true, "You must put a confirm password"]
  },
  number: {
    type: Number
  },
  country: {
    type: String,
    default: "Nil"
  },
  state: {
    type: String,
    default: "Nil"
  },
  city: {
    type: String,
    default: "Nil"
  },
  summary: {
    type: String
  },
  portfolioUrl: {
    type: String,
    select: true
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
    enum: ["true", "false"]
  }
});

// --------- Mongoose Middleware ------------
// Document middleware to hash passwords
userSchema.pre("save", async function(next) {
  // Check if password is modified
  if (!this.isModified("password")) return next();

  // Number of SaltRounds
  const saltRounds = 12;
  // Generate a salt
  const salt = await bcrypt.genSalt(saltRounds);
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);

  // Set password confirm field to Undefined
  this.confirmPassword = undefined;
  next();
});

// Document middleware to set passwordChangedAt date whwnever password is updated by user
userSchema.pre("save", function(next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
});

// Query Middleware to only select user with active status
userSchema.pre(/^find/, function(next) {
  this.find({ active: { $ne: false } });
  next();
});

// ---------------------++++++++++------------------

// Instance Methods
userSchema.methods.correctPassword = async function(inputPassword, DBPassword) {
  return await bcrypt.compare(inputPassword, DBPassword);
};

userSchema.methods.createPasswordResetToken = async function() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.changedPasswordAt = function(JWTTimeStamp) {
  if (this.passwordChangedAt) {
    return JWTTimeStamp < this.passwordChangedAt;
  }
};

const User = mongoose.model("User", userSchema);

export default User;
