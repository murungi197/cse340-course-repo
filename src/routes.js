import express from "express";

import { showHomePage } from "./controllers/index.js";
import {
  processEditOrganizationForm,
  processNewOrganizationForm,
  organizationValidation,
  showEditOrganizationForm,
  showNewOrganizationForm,
  showOrganizationsPage,
  showOrganizationPage,
} from "./controllers/organizations.js";
import {
  processEditProjectForm,
  processNewProjectForm,
  projectValidation,
  showEditProjectForm,
  showNewProjectForm,
  showProjectsPage,
  showProjectDetailsPage,
} from "./controllers/projects.js";
import {
  categoryValidation,
  processEditCategoryForm,
  processNewCategoryForm,
  processAssignCategoriesForm,
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  showEditCategoryForm,
  showNewCategoryForm,
} from "./controllers/categories.js";
import { testErrorPage } from "./controllers/errors.js";
import {
  processLoginForm,
  processLogout,
  processUserRegistrationForm,
  requireLogin,
  showDashboard,
  showLoginForm,
  showUserRegistrationForm,
  userRegistrationValidation,
} from "./controllers/users.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/login", showLoginForm);
router.post("/login", processLoginForm);
router.get("/dashboard", requireLogin, showDashboard);
router.get("/logout", processLogout);
router.get("/register", showUserRegistrationForm);
router.post(
  "/register",
  userRegistrationValidation,
  processUserRegistrationForm,
);
router.get("/organizations", showOrganizationsPage);
router.get("/new-organization", showNewOrganizationForm);
router.post(
  "/new-organization",
  organizationValidation,
  processNewOrganizationForm,
);
router.get("/organization/:id", showOrganizationPage);
router.get("/edit-organization/:id", showEditOrganizationForm);
router.post(
  "/edit-organization/:id",
  organizationValidation,
  processEditOrganizationForm,
);
router.get("/projects", showProjectsPage);
router.get("/new-project", showNewProjectForm);
router.post("/new-project", projectValidation, processNewProjectForm);
router.get("/project/:id", showProjectDetailsPage);
router.get("/edit-project/:id", showEditProjectForm);
router.post("/edit-project/:id", projectValidation, processEditProjectForm);
router.get("/categories", showCategoriesPage);
router.get("/new-category", showNewCategoryForm);
router.post("/new-category", categoryValidation, processNewCategoryForm);
router.get("/category/:id", showCategoryDetailsPage);
router.get("/edit-category/:id", showEditCategoryForm);
router.post("/edit-category/:id", categoryValidation, processEditCategoryForm);
router.get("/assign-categories/:projectId", showAssignCategoriesForm);
router.post("/assign-categories/:projectId", processAssignCategoriesForm);
router.get("/project/:projectId/assign-categories", showAssignCategoriesForm);
router.post(
  "/project/:projectId/assign-categories",
  processAssignCategoriesForm,
);
router.get("/test-error", testErrorPage);

export default router;
