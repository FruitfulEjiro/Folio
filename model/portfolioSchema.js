import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema({
  name: {
    type: String
  },
  email: {
    type: String
  },
  phoneNumber: {
    type: Number,
    required: false
  },
  bio: {
    type: String
  },
  slug: {
    type: String
  },
  skills: [
    {
      name: String,
      percentage: String
    }
  ],
  socials: {
    type: [String]
  },
  projects: [
    {
      projectTitle: String,
      projectSummary: String,
      projectUrl: String,
      projectImage: String
    }
  ],
  resume: {
    type: String,
    required: false
  },
  jobRole: {
    type: String
  },
  templateId: {
    type: String
  },
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
