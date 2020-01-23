const router = require("express").Router();
const roomsController = require("../controllers/roomsController");

router.get("/", roomsController.index, roomsController.indexView);

router.get("/new", roomsController.isAdmin, roomsController.new);
router.post(
  "/create",
  roomsController.isAdmin,
  roomsController.create,
  roomsController.redirectView
);

router.get("/:id/edit", roomsController.isAdmin, roomsController.edit);
router.put(
  "/:id/update",
  roomsController.isAdmin,
  roomsController.update,
  roomsController.redirectView
);
router.get("/:id", roomsController.show, roomsController.showView);
router.delete(
  "/:id/delete",
  roomsController.isAdmin,
  roomsController.delete,
  roomsController.redirectView
);

router.get("/:id/book", roomsController.isUser, roomsController.book);

module.exports = router;
