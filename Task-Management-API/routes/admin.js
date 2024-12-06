const express = require("express");
const router = express.Router();

const {
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
} = require("../controllers/admin");

router.route("/").get(getAllTasks);
router.route("/:id").get(getTask).patch(updateTask).delete(deleteTask);

module.exports = router;
