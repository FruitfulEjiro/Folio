"use strict";

import { hamburger, dashboardHamburger } from "./hamburger.js";
import { updateUser } from "./updateUser.js";
import { addNewProject, addNewSkill, removeSkill } from "./portfolioForm.js";

const hamburgerIcon = document.querySelector(".hamburger-icon");
const profileHamburger = document.querySelector(".hamburger");
const userForm = document.querySelector(".user-form");
const projectButton = document.getElementById("addProjectButton");
const skillButton = document.getElementById("addSkillButton");
// let removeSkillButton = document.querySelectorAll(".fa-xmark");

if (hamburgerIcon) {
  hamburgerIcon.addEventListener("click", hamburger);
}

if (profileHamburger) {
  profileHamburger.addEventListener("click", dashboardHamburger);
}

if (userForm) {
  userForm.addEventListener("submit", updateUser);
}

if (projectButton) {
  projectButton.addEventListener("click", addNewProject);
}

if (skillButton) {
  skillButton.addEventListener("click", addNewSkill);
}