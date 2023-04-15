import bodyParser from "body-parser";
import express from "express"; // Importing Express
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";
import routes from "./routes/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();

// Setup views
app.set("view engine", "ejs"); // Setting EJS
app.set("views", path.join(__dirname, "./views"));

app.listen(5500, () => {
  console.log("Server is running on port 5500"); // Running The Server
});

app.use(bodyParser.urlencoded({ extended: true })); // Always use this before route

// Setup public folder
app.use(express.static(path.join(__dirname, "../public"))); //to access folders

// Set session
app.use(
  session({
    secret: "stuti8983",
  })
);

// Copy session data to local variables
app.use((req, res, next) => {
  const { session } = req;
  res.locals.session = session;
  if (session.flash) {
    res.locals.flash = session.flash;
    delete session.flash;
  }

  next();
});

app.use((req, res, next) => {
  if (req.session.uid) {
    if (req.originalUrl === "/login" || req.originalUrl === "/register") {
      res.redirect("/");
    }
    if (
      (req.originalUrl === "/g" || req.originalUrl === "/g2") &&
      req.session.userType !== "Driver"
    ) {
      req.session.flash = {
        type: "danger",
        message:
          "You are not authorized to access this page as you are not a driver",
      };
      res.redirect("/");
    }
  } else {
    if (
      req.originalUrl === "/g" ||
      req.originalUrl === "/g2" ||
      req.originalUrl.startsWith("/dashboard")
    ) {
      req.session.flash = {
        type: "danger",
        message: "You are not logged in! Please login to access the page.",
      };
      res.redirect("/login");
    }
  }

  next();
  return;
});

app.use(routes);
