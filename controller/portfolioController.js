import fs from "fs";
import CatchAsync from "express-async-handler";

// Local Modules
import Portfolio from "../model/portfolioSchema.js";
import AppError from "../Utils/AppError.js";

export const createPortfolio = CatchAsync(async (req, res) => {
  console.log(req.body)
  const skill = req.body.skillList.map(skill => {
    return { name: skill.name, percentage: skill.percent };
  });

  const project = req.body.projects.map(project => {
    return {
      projectTitle: project.title,
      projectSummary: project.summary,
      projectUrl: project.url,
      projectImage: project.image
    };
  });

  console.log(skill, project);

  const newPortfolio = new Portfolio({
    name: req.body.fullName,
    email: req.body.email,
    phoneNumber: req.body.phone,
    bio: req.body.bio,
    slug: req.body.username,
    skills: skill,
    socials: req.body.socials,
    projects: project,
    resume: "",
    jobRole: req.body.title,
    templateId: req.body.template.toLowerCase()
  });

  await newPortfolio.save();
  console.log("Portfolio Created Successfully!");

  res.status(200).json({
    status: "Success",
    message: "Portfolio Created Successfully",
    data: {
      newPortfolio
    }
  });
});

export const fetchUserPortfolio = CatchAsync(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({ slug: req.params.slug });
  if (!portfolio) {
    return next(
      new AppError("Portfolio Not Found! Check URL for Incorrect Spelling", 404)
    );
  }
  console.log("done");

  res.status(200).json({
    status: "Success",
    message: "User Portfolio Found",
    data: {
      portfolio
    }
  });
});

export const checkUsername = CatchAsync(async (req, res, next) => {
  const { username } = req.params;
  const checkUsername = await Portfolio.findOne({ slug: username });
  if (!checkUsername) return res.status(200).json({ status: "success" });
  return res.status(200).json({ status: "failed" });
});
