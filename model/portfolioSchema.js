const mongoose = require("mongoose");

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"]
  },

  email: {
    type: String,
    required: [true, "Email is required"]
  },

  phoneNumber: {
    type: Number,
    required: false
  },

  about: {
    type: String,
    required: [true, "Give a little summary about yourself"]
  },

  skills: {
    type: [],
    required: [true, "Add One or more skills"]
  },

  socials: {
    type: [],
    required: [true, "Add one or more social accounts"]
  },

  projects: {
    type: [],
    required: [true, "Add one or more social projects"]
  },

  resume: {
    type: String,
    required: false
  },

  avatar: {
    type: String,
    required: false
  },

  jobRole: {
    type: String,
    required: [true, "Add your Job or Role"]
  }
});
