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

export {
  getAllCategories,
  getCategoryById,
  getCategoriesByProjectId,
  getCategoriesByOrganizationId,
};
