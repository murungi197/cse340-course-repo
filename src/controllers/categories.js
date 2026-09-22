import { getAllCategories, getCategoryById } from "../models/categories.js";
import { getProjectsByCategoryId } from "../models/projects.js";

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

export { showCategoriesPage, showCategoryDetailsPage };
