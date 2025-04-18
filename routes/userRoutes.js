const router = require("express").Router();
const usersController = require("../controllers/usersController");

  
  //login user
  router.get("/login", usersController.login);
  router.post("/login", usersController.authenticate);
  router.get(
    "/logout",
    usersController.logout,
    usersController.redirectView
  );
  
  // User show
  router.get("/", usersController.index, usersController.indexView);
  // create new users
  router.get("/new", usersController.new);
  router.post("/create", usersController.validate, usersController.create, usersController.redirectView);
  // show user after clicking on it + edit
  router.get("/:id", usersController.show, usersController.showView);
  router.get("/:id/edit", usersController.edit);
  router.put("/:id/update", usersController.update, usersController.redirectView);
// delete
router.delete(
  "/:id/delete",
  usersController.delete,
  usersController.redirectView
);

  module.exports = router;
