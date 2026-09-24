import db from "./db.js";

const getAllCategories = async () => {
  const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getCategoryById = async (categoryId) => {
  const query = `
        SELECT category_id, name
        FROM public.category
        WHERE category_id = $1;
    `;

  const result = await db.query(query, [categoryId]);

  return result.rows[0];
};

const createCategory = async (name) => {
  const query = `
        INSERT INTO public.category (name)
        VALUES ($1)
        RETURNING category_id;
    `;

  const result = await db.query(query, [name]);

  return result.rows[0].category_id;
};

const updateCategory = async (categoryId, name) => {
  const query = `
        UPDATE public.category
        SET name = $1
        WHERE category_id = $2;
    `;

  await db.query(query, [name, categoryId]);
};

const getCategoriesByProjectId = async (projectId) => {
  const query = `
        SELECT category.category_id, category.name
        FROM public.category AS category
        INNER JOIN public.project_category AS project_category
            ON category.category_id = project_category.category_id
        WHERE project_category.project_id = $1
        ORDER BY category.name;
    `;

  const result = await db.query(query, [projectId]);

  return result.rows;
};

const getCategoriesByOrganizationId = async (organizationId) => {
  const query = `
        SELECT DISTINCT category.category_id, category.name
        FROM public.category AS category
        INNER JOIN public.project_category AS project_category
            ON category.category_id = project_category.category_id
        INNER JOIN public.project AS project
            ON project_category.project_id = project.project_id
        WHERE project.organization_id = $1
        ORDER BY category.name;
    `;

  const result = await db.query(query, [organizationId]);

  return result.rows;
};

const assignCategoryToProject = async (projectId, categoryId) => {
  const query = `
        INSERT INTO public.project_category (project_id, category_id)
        VALUES ($1, $2);
    `;

  await db.query(query, [projectId, categoryId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
  const deleteQuery = `
        DELETE FROM public.project_category
        WHERE project_id = $1;
    `;

  await db.query(deleteQuery, [projectId]);

  for (const categoryId of categoryIds) {
    await assignCategoryToProject(projectId, categoryId);
  }
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  getCategoriesByProjectId,
  getCategoriesByOrganizationId,
  updateCategoryAssignments,
};
