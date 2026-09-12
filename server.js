import { getAllProjects } from "./src/views/models/projects.js";
import { getAllCategories } from "./src/views/models/categories.js";
import { getAllOrganizations } from "./src/views/models/organizations.js";
import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { testConnection } from "./src/views/models/db.js";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "public")));

// Test the database connection
testConnection()
  .then(() => {
    console.log("Database connection established.");
    return getAllProjects();
  })
  .then((projects) => {
    console.log("Projects retrieved from database:", projects);
  })
  .catch((error) => {
    console.error("Failed to connect to the database.", error.message);
  });

app.get("/", (request, response) => {
  response.render("home", { title: "Home", page: "home" });
});

app.get("/organizations", async (request, response) => {
  const organizations = await getAllOrganizations();
  response.render("organizations", {
    title: "Organizations",
    page: "organizations",
    organizations,
  });
});

app.get("/projects", async (request, response) => {
  const projects = await getAllProjects();
  response.render("projects", {
    title: "Projects",
    page: "projects",
    projects,
  });
});

app.get("/categories", async (request, response) => {
  const categories = await getAllCategories();
  response.render("categories", {
    title: "Categories",
    page: "categories",
    categories,
  });
});

app.use((request, response) => {
  response.status(404).send("Page not found");
});

app.listen(port, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
});
