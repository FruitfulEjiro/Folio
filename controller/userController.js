const User = require("../model/userSchema");
const CatchAsync = require("../Utils/ErrorHandler");

// Function to filter request fields
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

// Update User function
const updateMe = CatchAsync(async (req, res, next) => {
  // create error if user posts password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("Cant Update password on this route", 400));
  }

  // Filter out unwanted fields
  const filteredBody = filterObj(
    req.body,
    "name",
    "email",
    "city",
    "state",
    "country",
    "number",
    "summary"
  );

  // Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser
    }
  });
});

// Delete User Function
const deleteMe = CatchAsync(async (req, res, next) => {
  await user.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: {
      data: null
    }
  });
});

const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

module.exports = { updateMe, deleteMe };
