import {
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  updateCategoryAssignments,
} from "../models/categories.js";
import {
  getProjectDetails,
  getProjectsByCategoryId,
} from "../models/projects.js";

const showCategoriesPage = async (request, response) => {
  const categories = await getAllCategories();
  response.render("categories", {
    title: "Categories",
    page: "categories",
    categories,
  });
};

const showCategoryDetailsPage = async (request, response) => {
  const categoryId = request.params.id;
  const category = await getCategoryById(categoryId);
  const projects = await getProjectsByCategoryId(categoryId);

  response.render("category", {
    title: category.name,
    page: "categories",
    category,
    projects,
  });
};

const showAssignCategoriesForm = async (request, response) => {
  const projectId = request.params.projectId;
  const projectDetails = await getProjectDetails(projectId);
  const categories = await getAllCategories();
  const assignedCategories = await getCategoriesByProjectId(projectId);

  response.render("assign-categories", {
    title: "Assign Categories to Project",
    page: "projects",
    projectId,
    projectDetails,
    categories,
    assignedCategories,
  });
};

const processAssignCategoriesForm = async (request, response) => {
  const projectId = request.params.projectId;
  const selectedCategoryIds = request.body.categoryIds || [];
  const categoryIds = Array.isArray(selectedCategoryIds)
    ? selectedCategoryIds
    : [selectedCategoryIds];

  await updateCategoryAssignments(projectId, categoryIds);
  request.flash("success", "Categories updated successfully.");
  response.redirect(`/project/${projectId}`);
};

export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
};
