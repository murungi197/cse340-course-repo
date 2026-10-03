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
  requireRole,
  showDashboard,
  showLoginForm,
  showUsersPage,
  showUserRegistrationForm,
  userRegistrationValidation,
} from "./controllers/users.js";

const router = express.Router();

router.get("/", showHomePage);
router.get("/login", showLoginForm);
router.post("/login", processLoginForm);
router.get("/dashboard", requireLogin, showDashboard);
router.get("/users", requireRole("admin", "/dashboard"), showUsersPage);
router.get("/logout", processLogout);
router.get("/register", showUserRegistrationForm);
router.post(
  "/register",
  userRegistrationValidation,
  processUserRegistrationForm,
);
router.get("/organizations", showOrganizationsPage);
router.get("/new-organization", requireRole("admin"), showNewOrganizationForm);
router.post(
  "/new-organization",
  requireRole("admin"),
  organizationValidation,
  processNewOrganizationForm,
);
router.get("/organization/:id", showOrganizationPage);
router.get(
  "/edit-organization/:id",
  requireRole("admin"),
  showEditOrganizationForm,
);
router.post(
  "/edit-organization/:id",
  requireRole("admin"),
  organizationValidation,
  processEditOrganizationForm,
);
router.get("/projects", showProjectsPage);
router.get("/new-project", requireRole("admin"), showNewProjectForm);
router.post(
  "/new-project",
  requireRole("admin"),
  projectValidation,
  processNewProjectForm,
);
router.get("/project/:id", showProjectDetailsPage);
router.get("/edit-project/:id", requireRole("admin"), showEditProjectForm);
router.post(
  "/edit-project/:id",
  requireRole("admin"),
  projectValidation,
  processEditProjectForm,
);
router.get("/categories", showCategoriesPage);
router.get("/new-category", requireRole("admin"), showNewCategoryForm);
router.post(
  "/new-category",
  requireRole("admin"),
  categoryValidation,
  processNewCategoryForm,
);
router.get("/category/:id", showCategoryDetailsPage);
router.get("/edit-category/:id", requireRole("admin"), showEditCategoryForm);
router.post(
  "/edit-category/:id",
  requireRole("admin"),
  categoryValidation,
  processEditCategoryForm,
);
router.get(
  "/assign-categories/:projectId",
  requireRole("admin"),
  showAssignCategoriesForm,
);
router.post(
  "/assign-categories/:projectId",
  requireRole("admin"),
  processAssignCategoriesForm,
);
router.get(
  "/project/:projectId/assign-categories",
  requireRole("admin"),
  showAssignCategoriesForm,
);
router.post(
  "/project/:projectId/assign-categories",
  requireRole("admin"),
  processAssignCategoriesForm,
);
router.get("/test-error", testErrorPage);

export default router;
