import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { testConnection } from "./src/models/db.js";
import router from "./src/routes.js";

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
  })
  .catch((error) => {
    console.error("Failed to connect to the database.", error.message);
  });

app.use(router);

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
