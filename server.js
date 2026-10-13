import "dotenv/config";
import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple"; // 1. Import the session store
import path from "node:path";
import { fileURLToPath } from "node:url";
import flash from "./src/middleware/flash.js";
import { testConnection } from "./src/models/db.js";
import router from "./src/routes.js";

const requiredEnvironmentVariables = ["DB_URL", "SESSION_SECRET"];
const missingEnvironmentVariables = requiredEnvironmentVariables.filter(
  (variableName) => !process.env[variableName],
);

if (missingEnvironmentVariables.length) {
  throw new Error(
    `Missing required environment variables: ${missingEnvironmentVariables.join(", ")}`,
  );
}

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. Initialize the Postgres store constructor
const PostgresStore = pgSession(session);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(
  session({
    // 3. Configure the session middleware to use Postgres
    store: new PostgresStore({
      conString: process.env.DB_URL, // Reuses your existing DB connection URL
      tableName: "session",          // Matches the SQL table created in Step 2
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days session expiration
      secure: process.env.NODE_ENV === "production", // Ensures cookies are HTTPS only on Render
    },
  }),
);

app.use(flash);
app.use((request, response, next) => {
  response.locals.isLoggedIn = Boolean(request.session?.user);
  response.locals.user = request.session?.user ?? null;
  response.locals.NODE_ENV = process.env.NODE_ENV || "development";
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
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
