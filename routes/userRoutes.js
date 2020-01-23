const router = require("express").Router();
const usersController = require("../controllers/usersController");

router.get("/login", usersController.isLoggedIn, usersController.login);
router.post("/login", usersController.isLoggedIn, usersController.authenticate);
router.get("/logout", usersController.logout, usersController.redirectView);

router.get("/", usersController.index, usersController.indexView);
router.get("/new", usersController.isLoggedIn, usersController.new);
router.post(
  "/create",
  usersController.isLoggedIn,
  usersController.validate,
  usersController.create,
  usersController.redirectView
);

router.get("/:id/edit", usersController.isUsersAccount, usersController.edit);
router.put(
  "/:id/update",
  usersController.isUsersAccount,
  usersController.update,
  usersController.redirectView
);
router.get("/:id", usersController.show, usersController.showView);
router.delete(
  "/:id/delete",
  usersController.isUsersAccount,
  usersController.delete,
  usersController.redirectView
);

router.put(
  "/:id/deleteBooking",
  usersController.isAdmin,
  usersController.deleteBooking,
  usersController.redirectView
);

module.exports = router;
