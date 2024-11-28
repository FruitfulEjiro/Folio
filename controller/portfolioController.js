const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");

// Local Modules
const { Portfolio } = require("../model/portfolioSchema");
const CatchAsync = require("../Utils/ErrorHandler");
const AppError = require("../Utils/AppError");

// saving Images
const multerStorage = multer.memoryStorage();

// Image Filter
const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image") ||
    file.mimetype.split("/")[1] === "pdf"
  ) {
    cb(null, true);
  } else {
    cb(
      new AppError("Not an Image or PDF! Upload Only Images or PDF's", 400),
      false
    );
  }
};

const ImgUpload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

// Image Processor for Project Images
const imageProcessor = CatchAsync(async (req, res, next) => {
  if (!req.files) {
    console.log("no req.files found");
    return next();
  }

  // Processor for Resume
  if (req.files.resume) {
    req.files.resume.filename = `user-${req.user.id}-${Date.now()}.pdf`;

    const resume = req.files.resume[0].buffer;
    fs.writeFile(
      `./public/documents/${req.files.resume.filename}`,
      resume,
      err => {
        if (err) {
          console.error("Error saving PDF:", err);
        } else {
          res.status(201);
          console.log("PDF saved successfully!");
        }
      }
    );
  }

  // Processor for Project Images
  if (req.files["projectImage"]) {
    req.files["projectImage"].forEach(async image => {
      image.filename = `project-${req.user.id}-${Date.now()}.jpeg`;
      await sharp(image.buffer)
        .resize(500, 500)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`./public/images/project-images/${image.filename}`);
    });
  }

  next();
});

const createPortfolio = CatchAsync(async (req, res) => {
  try {
    let resume;

    const skills = req.body.skill.map((skill, index) => ({
      name: skill,
      percentage: req.body.skillPercentage[index]
    }));

    const projects = req.body.projectTitle.map((title, index) => ({
      projectTitle: title,
      projectSummary: req.body.projectSummary[index],
      projectUrl: req.body.projectUrl[index],
      projectImage: req.files["projectImage"][index].filename
    }));

    if (req.files.resume) {
      resume = req.files.resume.filename;
    }

    const newPortfolio = new Portfolio({
      name: req.body.name,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      bio: req.body.bio,
      slug: req.body.slug,
      skills: skills,
      socials: req.body.socials,
      projects: projects,
      resume: resume,
      jobRole: req.body.jobRole,
      templateId: req.body.templateId
    });

    await newPortfolio.save();
    console.log("Portfolio Created Successfully!");
    res.redirect("/dashboard");
  } catch (error) {
    console.log("portfolio saving error", error);
    res.status(500).send("Error saving portfolio: " + error);
  }
});

const fetchUserPortfolio = CatchAsync(async (req, res, next) => {
  const portfolio = await Portfolio.findOne({ slug: req.params.slug });
  if (!portfolio) {
    return next(
      new AppError("Portfolio Not Found! Check URL for Incorrect Spelling", 404)
    );
  }

  const templateId = portfolio.templateId;
  res.render(`templates/${templateId}`, { portfolio });
});

module.exports = {
  ImgUpload,
  imageProcessor,
  createPortfolio,
  fetchUserPortfolio
};