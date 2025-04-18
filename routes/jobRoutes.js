const router = require("express").Router();
const jobsController = require("../controllers/jobsController");

// delete
router.delete(
    "/:id/delete",
    jobsController.authenticateUser,
    jobsController.deleteJob,
    jobsController.delete,
    jobsController.redirectView
  );
  
  // Job show
  router.get("/", jobsController.index, jobsController.indexView);
  
  // create new jobs
  router.get("/new", jobsController.authenticateUser,jobsController.new);
  router.post("/create", jobsController.authenticateUser, jobsController.validate,jobsController.create, jobsController.redirectView);
  
  // show job after clicsking on it + edit
  router.get("/:id", jobsController.show, jobsController.showView);
  router.get("/:id/edit", jobsController.authenticateUser,jobsController.checkUser, jobsController.edit);
  router.put("/:id/update", jobsController.authenticateUser, jobsController.update, jobsController.redirectView);
  
  module.exports = router;
