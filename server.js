const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session");
const path = require("node:path");

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
const router = require("./routes");
const { initialiseDatabase, pool } = require("./database/init");

const app = express();

// Serve our static files: html, css & js
NODE_ENV === "production"
  ? app.use(express.static(path.join(__dirname, "public"), { maxAge: "1h" })) // cache assets
  : app.use(express.static(path.join(__dirname, "public")));

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

app.use("/", router);

// Catch errors
app.use((req, res) => {
  return res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

(async function () {
  try {
    // Initialising Database
    await initialiseDatabase();

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[#] Server listening: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error({
      application_error: `[!] Error starting the application: ${error.message}`,
    });
  }
})();
