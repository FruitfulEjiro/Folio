"use strict";

export function addNewProject() {
  const projectsContainer = document.getElementById("projectContainer");

  // Create a new project entry div
  const newProjectEntry = document.createElement("div");
  newProjectEntry.classList.add("project-entry", "d-flex", "flex-column", "py-2");
  newProjectEntry.innerHTML = `
  <h3>Project</h3>
  <label for="projectTitle">Project Title:</label>
  <input type="text" name="projectTitle[]" required>

  <label for="projectSummary">Project Summary:</label>
  <textarea name="projectSummary[]" required></textarea>

  <label for="projectUrl">Project Link:</label>
  <input type="url" name="projectUrl[]" required>

  <input type="file" class="mt-3 p-3 border-0" id="projectImage" name="projectImage"  accept="image/*" required>
`;

  // Append the new project entry to the container
  projectsContainer.appendChild(newProjectEntry);
}

export function addNewSkill() {
  const skillsContainer = document.getElementById("skillsContainer");

  // Create a new skill entry div
  const newSkillEntry = document.createElement("div");
  newSkillEntry.classList.add("skill-entry", "d-flex", "flex-column", "py-2");
  newSkillEntry.innerHTML = `
  <h4>Skill</h4><i class="fa-solid fa-xmark"></i>
  <label for="skill">Skill:</label>
  <input type="text" name="skill[]" required>

  <label for="skillPercentage">Percentage:</label>
  <input type="text" name="skillPercentage[]" required>
`;

  // Append the new skill entry to the container
  skillsContainer.appendChild(newSkillEntry);
}

export function removeSkill(e) {
  // console.log(e);
  const skill = e.target.parentElement;

  skill.outerHTML = "";
}
