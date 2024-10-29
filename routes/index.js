const router = require("express").Router();

const appRouter = require("./app");
const apiRoutes = require("./apiRoutes");

router.use("/", appRouter) // UI routes
router.use("/api", apiRoutes) // API routes

module.exports = router;
