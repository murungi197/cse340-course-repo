import {
  getAllOrganizations,
  getOrganizationById,
} from "../views/models/organizations.js";
import { getProjectsByOrganizationId } from "../views/models/projects.js";

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

  response.render("organization", {
    title: organization.name,
    page: "organizations",
    organization,
    projects,
  });
};

export { showOrganizationsPage, showOrganizationPage };
