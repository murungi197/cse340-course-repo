import {
  getProjectDetails,
  getUpcomingProjects,
} from "../views/models/projects.js";
import { getCategoriesByProjectId } from "../views/models/categories.js";

const NUMBER_OF_UPCOMING_PROJECTS = 5;

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

export { showProjectsPage, showProjectDetailsPage };
