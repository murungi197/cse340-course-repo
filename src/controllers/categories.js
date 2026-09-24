import {
  createCategory,
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  updateCategory,
  updateCategoryAssignments,
} from "../models/categories.js";
import {
  getProjectDetails,
  getProjectsByCategoryId,
} from "../models/projects.js";
import { body, validationResult } from "express-validator";

const categoryValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Category name must be between 3 and 100 characters.")
    .escape(),
];

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

const showNewCategoryForm = async (request, response) => {
  response.render("new-category", {
    title: "Add New Category",
    page: "categories",
  });
};

const showEditCategoryForm = async (request, response) => {
  const category = await getCategoryById(request.params.id);

  response.render("edit-category", {
    title: "Edit Category",
    page: "categories",
    category,
  });
};

const processNewCategoryForm = async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    errors.array().forEach(({ msg }) => request.flash("error", msg));
    response.redirect("/new-category");
    return;
  }

  const categoryId = await createCategory(request.body.name);
  request.flash("success", "Category created successfully!");
  response.redirect(`/category/${categoryId}`);
};

const processEditCategoryForm = async (request, response) => {
  const errors = validationResult(request);
  const categoryId = request.params.id;

  if (!errors.isEmpty()) {
    errors.array().forEach(({ msg }) => request.flash("error", msg));
    response.redirect(`/edit-category/${categoryId}`);
    return;
  }

  await updateCategory(categoryId, request.body.name);
  request.flash("success", "Category updated successfully!");
  response.redirect(`/category/${categoryId}`);
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
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  categoryValidation,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
};
