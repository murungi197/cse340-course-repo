import db from "./db.js";

const getAllProjects = async () => {
  const query = `
        SELECT project.project_id, project.title, project.description,
               project.project_date::text AS project_date,
               organization.name AS organization_name
        FROM public.project AS project
        INNER JOIN public.organization AS organization
            ON project.organization_id = organization.organization_id
        ORDER BY project.project_date, project.project_id;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getProjectsByOrganizationId = async (organizationId) => {
  const query = `
        SELECT project_id, title, description, project_date::text AS project_date
        FROM public.project
        WHERE organization_id = $1
        ORDER BY project_date, project_id;
    `;

  const result = await db.query(query, [organizationId]);

  return result.rows;
};

const getUpcomingProjects = async (numberOfProjects) => {
  const query = `
        SELECT project.project_id, project.title, project.description,
               project.project_date::text AS date, project.location,
               project.organization_id, organization.name AS organization_name
        FROM public.project AS project
        INNER JOIN public.organization AS organization
            ON project.organization_id = organization.organization_id
        WHERE project.project_date >= CURRENT_DATE
        ORDER BY project.project_date, project.project_id
        LIMIT $1;
    `;

  const result = await db.query(query, [numberOfProjects]);

  return result.rows;
};

const getProjectDetails = async (projectId) => {
  const query = `
        SELECT project.project_id, project.title, project.description,
               project.project_date::text AS date, project.location,
               project.organization_id, organization.name AS organization_name
        FROM public.project AS project
        INNER JOIN public.organization AS organization
            ON project.organization_id = organization.organization_id
        WHERE project.project_id = $1;
    `;

  const result = await db.query(query, [projectId]);

  return result.rows[0];
};

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
        SELECT project.project_id, project.title
        FROM public.project AS project
        INNER JOIN public.project_category AS project_category
            ON project.project_id = project_category.project_id
        WHERE project_category.category_id = $1
        ORDER BY project.project_date, project.project_id;
    `;

  const result = await db.query(query, [categoryId]);

  return result.rows;
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  getProjectsByCategoryId,
};
