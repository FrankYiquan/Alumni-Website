const router = require("express").Router();
const homeController = require("../controllers/homeController");

// routes for navigation bar options
router.get("/", homeController.respondWithHome);
router.get("/home", homeController.respondWithHome);
router.get("/about", homeController.respondWithAbout);
router.get("/contact", homeController.respondWithContact);
router.get("/chat", homeController.chat);

module.exports = router;
