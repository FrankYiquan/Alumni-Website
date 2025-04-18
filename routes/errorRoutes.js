const router = require("express").Router();
const errorController = require("../controllers/errorController");

// Error handlers
router.use(errorController.respondNoResourceFound);
router.use(errorController.respondInternalError);

module.exports = router;
