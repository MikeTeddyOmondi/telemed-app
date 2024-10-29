const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const path = require("node:path");
const morgan = require("morgan");

const {
  PORT,
  DB_HOST,
  DB_PORT,
  DB_USER,
  DB_PASSWORD,
  SESSION_SECRET,
  DB_NAME,
  NODE_ENV,
} = require("./config");
const routes = require("./routes");
const { initialiseDatabase, pool } = require("./database/init");
const { web404Handler, webErrorHandler } = require("./middlewares/errorHandlers");

const app = express();

// Serve our static files: html, css & js
NODE_ENV === "production"
  ? app.use(
      "/static/",
      express.static(path.join(__dirname, "public"), { maxAge: "1h" })
    ) // cache assets
  : app.use("/static/", express.static(path.join(__dirname, "public")));

// Sessions
const sessionStoreOpts = {
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
};
const mysqlSessionStore = MySQLStore(session);
const sessionStore = new mysqlSessionStore(sessionStoreOpts, pool());

sessionStore
  .onReady()
  .then(() => {
    console.log(`[#] Session store is ready!`);
  })
  .catch((err) => {
    console.error(`[!] Error initiating session store ${err.message}`);
  });

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    key: "user_sid",
    secret: SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // valid for 1 day
      secure: NODE_ENV === "production" ?? false,
      httpOnly: NODE_ENV === "production" ? true : false,
    },
  })
);
// Tracing
NODE_ENV === "production" ? app.use(morgan("common")) : app.use(morgan("dev"));

// Mount All Routes
app.use('/', routes);

// UI-specific error handling
app.use(web404Handler);
app.use(webErrorHandler);

(async function () {
  try {
    // Initialising Database
    await initialiseDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[#] ✅ Server is running: http://localhost:${PORT} 🚀🚀🚀`);
    });
  } catch (error) {
    console.error({
      application_error: `[!] ❌ Error starting the application: ${error.message}`,
    });
  }
})();
