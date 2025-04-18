const router = require("express").Router();

const chatController = require("../controllers/chatController");
const userRoutes = require("./userRoutes"),
  jobRoutes = require("./jobRoutes"),
  eventRoutes = require("./eventRoutes"),
  errorRoutes = require("./errorRoutes"),
  homeRoutes = require("./homeRoutes"),
  apiRoutes = require("./apiRoutes");

router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);
router.use("/events", eventRoutes);
router.use("/", homeRoutes);
router.use("/api", apiRoutes);
router.use("/", errorRoutes);
router.use("/chat", chatController);

module.exports = router;