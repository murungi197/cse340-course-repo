import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (request, response) => {
  response.render("home", { title: "Home", page: "home" });
});

app.get("/organizations", (request, response) => {
  response.render("organizations", {
    title: "Organizations",
    page: "organizations",
  });
});

app.get("/projects", (request, response) => {
  response.render("projects", { title: "Projects", page: "projects" });
});

app.get("/categories", (request, response) => {
  response.render("categories", {
    title: "Categories",
    page: "categories",
  });
});

app.use((request, response) => {
  response.status(404).send("Page not found");
});

app.listen(port, () => {
  console.log(`Service Network listening at http://127.0.0.1:${port}`);
});
