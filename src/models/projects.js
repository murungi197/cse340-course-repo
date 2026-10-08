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
           project.project_date::text AS date,
           'Community location' AS location,
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
           project.project_date::text AS date,
           'Community location' AS location,
               project.organization_id, organization.name AS organization_name
        FROM public.project AS project
        INNER JOIN public.organization AS organization
            ON project.organization_id = organization.organization_id
        WHERE project.project_id = $1;
    `;

  const result = await db.query(query, [projectId]);

  return result.rows[0];
};

const getVolunteerProjects = async (userId) => {
  const query = `
        SELECT project.project_id, project.title,
               project.project_date::text AS date,
               project.description, organization.name AS organization_name
        FROM public.project_volunteer AS project_volunteer
        INNER JOIN public.project AS project
            ON project.project_id = project_volunteer.project_id
        INNER JOIN public.organization AS organization
            ON organization.organization_id = project.organization_id
        WHERE project_volunteer.user_id = $1
        ORDER BY project.project_date, project.project_id;
    `;

  const result = await db.query(query, [userId]);

  return result.rows;
};

const isUserVolunteering = async (projectId, userId) => {
  const query = `
        SELECT 1
        FROM public.project_volunteer
        WHERE project_id = $1 AND user_id = $2;
    `;

  const result = await db.query(query, [projectId, userId]);

  return result.rows.length > 0;
};

const addProjectVolunteer = async (projectId, userId) => {
  const query = `
        INSERT INTO public.project_volunteer (project_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (project_id, user_id) DO NOTHING;
    `;

  await db.query(query, [projectId, userId]);
};

const removeProjectVolunteer = async (projectId, userId) => {
  const query = `
        DELETE FROM public.project_volunteer
        WHERE project_id = $1 AND user_id = $2;
    `;

  await db.query(query, [projectId, userId]);
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

const createProject = async (
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const query = `
    INSERT INTO public.project (title, description, location, project_date, organization_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING project_id;
  `;

  const result = await db.query(query, [
    title,
    description,
    location,
    date,
    organizationId,
  ]);

  if (result.rows.length === 0) {
    throw new Error("Failed to create project");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log("Created new project with ID:", result.rows[0].project_id);
  }

  return result.rows[0].project_id;
};

const updateProject = async (
  projectId,
  title,
  description,
  location,
  date,
  organizationId,
) => {
  const query = `
    UPDATE public.project
    SET title = $1,
        description = $2,
        location = $3,
        project_date = $4,
        organization_id = $5
    WHERE project_id = $6
    RETURNING project_id;
  `;

  const result = await db.query(query, [
    title,
    description,
    location,
    date,
    organizationId,
    projectId,
  ]);

  if (result.rows.length === 0) {
    throw new Error("Failed to update project");
  }
};

export {
  getAllProjects,
  getProjectsByOrganizationId,
  getUpcomingProjects,
  getProjectDetails,
  getVolunteerProjects,
  isUserVolunteering,
  addProjectVolunteer,
  removeProjectVolunteer,
  getProjectsByCategoryId,
  createProject,
  updateProject,
};
