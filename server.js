import "dotenv/config";
import express from "express";
import session from "express-session";
import pgSession from "connect-pg-simple";
import path from "node:path";
import { fileURLToPath } from "node:url";
import flash from "./src/middleware/flash.js";
import { testConnection } from "./src/models/db.js";
import router from "./src/routes.js";
import pg from "pg"; // Required to run the automatic setup query

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

const PostgresStore = pgSession(session);

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src", "views"));

app.use(
  session({
    store: new PostgresStore({
      conString: process.env.DB_URL,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30 * 24 * 60 * 60 * 1000, 
      secure: process.env.NODE_ENV === "production", 
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

// --- AUTOMATIC SESSION TABLE SETUP ---
async function initializeSessionTable() {
  const pool = new pg.Pool({ connectionString: process.env.DB_URL });
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        "sid" varchar NOT NULL COLLATE "default",
        "sess" json NOT NULL,
        "expire" timestamp(6) NOT NULL,
        CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
      ) WITH (OIDS=FALSE);
    `);
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
    `);
    console.log("Session table verified/created successfully.");
  } catch (error) {
    console.error("Failed to automatically create session table:", error.message);
  } finally {
    await pool.end();
  }
}
// -------------------------------------

app.use(router);

app.use((request, response) => {
  response.status(404).send("Page not found");
});

app.listen(port, async () => {
  try {
    await testConnection();
    console.log("Database connection established.");
    
    // Automatically provision the session table right after connecting
    await initializeSessionTable(); 
    
    console.log(`Server is running at http://127.0.0.1:${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  } catch (error) {
    console.error("Error during server startup:", error);
  }
});
