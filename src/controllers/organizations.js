import {
  createOrganization,
  getAllOrganizations,
  getOrganizationById,
} from "../models/organizations.js";
import { getProjectsByOrganizationId } from "../models/projects.js";
import { getCategoriesByOrganizationId } from "../models/categories.js";

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

const processNewOrganizationForm = async (request, response) => {
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

export {
  showOrganizationsPage,
  showOrganizationPage,
  showNewOrganizationForm,
  processNewOrganizationForm,
};
