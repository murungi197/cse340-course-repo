import {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
  updateOrganization,
} from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";
import { getCategoriesByOrganizationId } from "../models/categories.js";
import { body, validationResult } from "express-validator";

const organizationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Organization name is required.")
    .isLength({ min: 3, max: 150 })
    .withMessage("Organization name must be between 3 and 150 characters.")
    .escape(),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Organization description is required.")
    .isLength({ max: 500 })
    .withMessage("Organization description cannot exceed 500 characters.")
    .escape(),
  body("contactEmail")
    .trim()
    .notEmpty()
    .withMessage("Organization email is required.")
    .isEmail()
    .withMessage("Organization email must be a valid email address.")
    .normalizeEmail(),
];

const showOrganizationsPage = async (request, response) => {
  const organizations = await getAllOrganizations();
  response.render("organizations", {
    title: "Organizations",
    page: "organizations",
    organizations,
  });
};

const showOrganizationPage = async (request, response) => {
  const organizationId = request.params.id;
  const organization = await getOrganizationById(organizationId);
  const projects = await getProjectsByOrganizationId(organizationId);
  const categories = await getCategoriesByOrganizationId(organizationId);

  response.render("organization", {
    title: organization.name,
    page: "organizations",
    organization,
    projects,
    categories,
  });
};

const showNewOrganizationForm = async (request, response) => {
  response.render("new-organization", {
    title: "Add New Organization",
    page: "organizations",
  });
};

const showEditOrganizationForm = async (request, response) => {
  const organizationDetails = await getOrganizationById(request.params.id);

  response.render("edit-organization", {
    title: "Edit Organization",
    page: "organizations",
    organizationDetails,
  });
};

const processNewOrganizationForm = async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    errors.array().forEach(({ msg }) => request.flash("error", msg));
    response.redirect("/new-organization");
    return;
  }

  const { name, description, contactEmail } = request.body;
  const organizationId = await createOrganization(
    name,
    description,
    contactEmail,
    "placeholder-logo.png",
  );

  request.flash("success", `Organization ${name} was created successfully.`);
  response.redirect(`/organization/${organizationId}`);
};

const processEditOrganizationForm = async (request, response) => {
  const errors = validationResult(request);
  const organizationId = request.params.id;

  if (!errors.isEmpty()) {
    errors.array().forEach(({ msg }) => request.flash("error", msg));
    response.redirect(`/edit-organization/${organizationId}`);
    return;
  }

  const { name, description, contactEmail, logoFilename } = request.body;
  await updateOrganization(
    organizationId,
    name,
    description,
    contactEmail,
    logoFilename,
  );

  request.flash("success", "Organization updated successfully!");
  response.redirect(`/organization/${organizationId}`);
};

export {
  showOrganizationsPage,
  showOrganizationPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
  showEditOrganizationForm,
  processEditOrganizationForm,
  organizationValidation,
};
