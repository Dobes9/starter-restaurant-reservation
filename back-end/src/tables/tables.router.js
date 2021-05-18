const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/").get().post();
router.route("/:table_id/seat").put();

module.exports = router;