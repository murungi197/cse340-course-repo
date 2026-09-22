import db from "./db.js";

const getAllOrganizations = async () => {
  const query = `
        SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization;
    `;

  const result = await db.query(query);

  return result.rows;
};

const getOrganizationById = async (organizationId) => {
  const query = `
      SELECT organization_id, name, description, contact_email, logo_filename
      FROM public.organization
      WHERE organization_id = $1;
    `;

  const result = await db.query(query, [organizationId]);

  return result.rows[0];
};

const createOrganization = async (
  name,
  description,
  contactEmail,
  logoFilename,
) => {
  const query = `
    INSERT INTO public.organization (name, description, contact_email, logo_filename)
    VALUES ($1, $2, $3, $4)
    RETURNING organization_id;
  `;

  const result = await db.query(query, [
    name,
    description,
    contactEmail,
    logoFilename,
  ]);

  if (result.rows.length === 0) {
    throw new Error("Failed to create organization");
  }

  if (process.env.ENABLE_SQL_LOGGING === "true") {
    console.log(
      "Created new organization with ID:",
      result.rows[0].organization_id,
    );
  }

  return result.rows[0].organization_id;
};

export { getAllOrganizations, getOrganizationById, createOrganization };
