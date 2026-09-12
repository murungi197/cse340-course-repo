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

export { getAllProjects };
