const router = require("express").Router();
const userRoutes = require("./userRoutes");
const roomRoutes = require("./roomRoutes");
const errorRoutes = require("./errorRoutes");
const homeRoutes = require("./homeRoutes");

router.use("/users", userRoutes);
router.use("/rooms", roomRoutes);
router.use("/", homeRoutes);
router.use("/", errorRoutes);

module.exports = router;
