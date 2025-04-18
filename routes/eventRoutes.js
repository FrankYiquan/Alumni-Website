const router = require("express").Router();
const eventsController = require("../controllers/eventsController");

// delete event
router.delete(
    "/:id/delete",
    eventsController.authenticateUser,
    eventsController.deleteEvent,
    eventsController.delete,
    eventsController.redirectView
  );
  
  // Event show
  router.get("/", eventsController.index, eventsController.indexView);
  // Route to show the express interest form
  router.get("/expressInterest/:id", eventsController.showExpressInterestForm);
 // Route to handle express interest form submission
 router.post('/expressInterest/:id', eventsController.expressInterest);
 
 
  
  // create new event
  router.get("/new", eventsController.authenticateUser,eventsController.new);
  router.post("/create", eventsController.authenticateUser, eventsController.validate,eventsController.create, eventsController.redirectView);
  
  // show event after clicking on it + edit
  router.get("/:id", eventsController.show, eventsController.showView);
  router.get("/:id/edit", eventsController.authenticateUser, eventsController.checkUser,eventsController.edit);
  router.put("/:id/update", eventsController.authenticateUser,eventsController.update, eventsController.redirectView);

  module.exports = router;
