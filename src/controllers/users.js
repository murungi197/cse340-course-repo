import bcrypt from "bcrypt";
import { body, validationResult } from "express-validator";
import { authenticateUser, createUser } from "../models/users.js";

const userRegistrationValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters.")
    .escape(),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Enter a valid email address.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required."),
];

const showUserRegistrationForm = (request, response) => {
  response.render("register", { title: "Register", page: "register" });
};

const processUserRegistrationForm = async (request, response) => {
  const errors = validationResult(request);

  if (!errors.isEmpty()) {
    errors.array().forEach(({ msg }) => request.flash("error", msg));
    response.redirect("/register");
    return;
  }

  const { name, email, password } = request.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    await createUser(name, email, passwordHash);

    request.flash("success", "Registration successful! Please try to log in.");
    response.redirect("/");
  } catch (error) {
    console.error("Error registering user:", error);
    request.flash(
      "error",
      "An error occurred during registration. Please try again.",
    );
    response.redirect("/register");
  }
};

const showLoginForm = (request, response) => {
  response.render("login", { title: "Login", page: "login" });
};

const requireLogin = (request, response, next) => {
  if (!request.session?.user) {
    request.flash("error", "You must be logged in to access that page.");
    return response.redirect("/login");
  }

  next();
};

const showDashboard = (request, response) => {
  const user = request.session.user;
  response.render("dashboard", {
    title: "Dashboard",
    page: "dashboard",
    name: user.name,
    email: user.email,
  });
};

const processLoginForm = async (request, response) => {
  const { email, password } = request.body;

  try {
    const user = await authenticateUser(email, password);

    if (!user) {
      request.flash("error", "Invalid email or password.");
      response.redirect("/login");
      return;
    }

    await new Promise((resolve, reject) => {
      request.session.regenerate((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });

    request.session.user = user;
    request.flash("success", "Login successful!");

    if (response.locals.NODE_ENV === "development") {
      console.log("User logged in:", user.user_id);
    }

    response.redirect("/dashboard");
  } catch (error) {
    console.error("Error during login:", error);
    request.flash("error", "An error occurred during login. Please try again.");
    response.redirect("/login");
  }
};

const processLogout = async (request, response) => {
  const session = request.session;

  try {
    await new Promise((resolve, reject) => {
      session.destroy((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });

    await new Promise((resolve, reject) => {
      session.regenerate((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      });
    });

    request.flash("success", "Logout successful!");
  } catch (error) {
    console.error("Error during logout:", error);
  }

  response.redirect("/login");
};

export {
  showUserRegistrationForm,
  processUserRegistrationForm,
  userRegistrationValidation,
  showLoginForm,
  processLoginForm,
  processLogout,
  requireLogin,
  showDashboard,
};
