import {
  createProject,
  getProjectDetails,
  getUpcomingProjects,
  updateProject,
} from "../models/projects.js";
import { getCategoriesByProjectId } from "../models/categories.js";
import { getAllOrganizations } from "../models/organizations.js";
import { body, validationResult } from "express-validator";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const projectValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required.")
    .isLength({ min: 3, max: 200 })
    .withMessage("Project title must be between 3 and 200 characters.")
    .escape(),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required.")
    .isLength({ max: 1000 })
    .withMessage("Project description cannot exceed 1000 characters.")
    .escape(),
  body("location")
    .trim()
    .notEmpty()
    .withMessage("Project location is required.")
    .isLength({ max: 200 })
    .withMessage("Project location cannot exceed 200 characters.")
    .escape(),
  body("date")
    .trim()
    .notEmpty()
    .withMessage("Project date is required.")
    .isISO8601()
    .withMessage("Project date must be a valid date."),
  body("organizationId")
    .trim()
    .notEmpty()
    .withMessage("Organization is required.")
    .isInt()
    .withMessage("Organization must be valid."),
];

const showProjectsPage = async (request, response) => {
  const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
  response.render("projects", {
    title: "Upcoming Service Projects",
    page: "projects",
    projects,
  });
};

const showProjectDetailsPage = async (request, response) => {
  const projectId = request.params.id;
  const project = await getProjectDetails(projectId);
  const categories = await getCategoriesByProjectId(projectId);

  response.render("project", {
    title: project.title,
    page: "projects",
    project,
    categories,
  });
};

const showNewProjectForm = async (request, response) => {
  const organizations = await getAllOrganizations();

  response.render("new-project", {
    title: "Add New Service Project",
    page: "projects",
    organizations,
  });
};

const showEditProjectForm = async (request, response) => {
  const projectDetails = await getProjectDetails(request.params.id);
  const organizations = await getAllOrganizations();

  response.render("edit-project", {
    title: "Edit Project",
    page: "projects",
    projectDetails,
    organizations,
  });
};

const processNewProjectForm = async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    errors.array().forEach(({ msg }) => request.flash("error", msg));
    response.redirect("/new-project");
    return;
  }

  const { title, description, location, date, organizationId } = request.body;

  try {
    await createProject(title, description, location, date, organizationId);
    request.flash("success", "New service project created successfully!");
    response.redirect("/projects");
  } catch (error) {
    console.error("Error creating new project:", error);
    request.flash("error", "There was an error creating the service project.");
    response.redirect("/new-project");
  }
};

const processEditProjectForm = async (request, response) => {
  const errors = validationResult(request);
  const projectId = request.params.id;

  if (!errors.isEmpty()) {
    errors.array().forEach(({ msg }) => request.flash("error", msg));
    response.redirect(`/edit-project/${projectId}`);
    return;
  }

  const { title, description, location, date, organizationId } = request.body;
  await updateProject(
    projectId,
    title,
    description,
    location,
    date,
    organizationId,
  );

  request.flash("success", "Project updated successfully!");
  response.redirect(`/project/${projectId}`);
};

export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation,
};
