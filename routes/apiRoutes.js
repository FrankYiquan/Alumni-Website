const router = require("express").Router();
const eventsController = require("../controllers/eventsController");
const usersController = require("../controllers/usersController");

//vertify user token
router.use(usersController.verifyToken);

//show all events
router.get("/events", eventsController.index, eventsController.respondJSON);

//join event
router.get("/events/:id/join", eventsController.join, eventsController.respondJSON);

//display error if needed
router.use(eventsController.errorJSON);


module.exports = router;


