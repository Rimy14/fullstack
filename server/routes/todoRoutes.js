const express = require("express");
const router = express.Router();
const {
  getAllTodos,
  createTodo,
  updateTodo,
  toggleTodoDone,
  deleteTodo,
} = require("../controllers/todoController");

router.route("/").get(getAllTodos).post(createTodo);

router.route("/:id").put(updateTodo).delete(deleteTodo);

router.route("/:id/done").patch(toggleTodoDone);

module.exports = router;
