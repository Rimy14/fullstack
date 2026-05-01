const Todo = require("../models/Todo");

// @desc    Get all todos
// @route   GET /api/todos
const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: todos.length,
      data: todos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch todos",
      error: error.message,
    });
  }
};

// @desc    Create a new todo
// @route   POST /api/todos
const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const todo = await Todo.create({
      title: title.trim(),
      description: description ? description.trim() : "",
    });

    res.status(201).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to create todo",
      error: error.message,
    });
  }
};

// @desc    Update a todo (title/description)
// @route   PUT /api/todos/:id
const updateTodo = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (title !== undefined && title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title cannot be empty",
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description.trim();

    const todo = await Todo.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid todo ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to update todo",
      error: error.message,
    });
  }
};

// @desc    Toggle todo done status
// @route   PATCH /api/todos/:id/done
const toggleTodoDone = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    todo.done = !todo.done;
    await todo.save();

    res.status(200).json({
      success: true,
      data: todo,
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid todo ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to toggle todo status",
      error: error.message,
    });
  }
};

// @desc    Delete a todo
// @route   DELETE /api/todos/:id
const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {},
      message: "Todo deleted successfully",
    });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(400).json({
        success: false,
        message: "Invalid todo ID",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to delete todo",
      error: error.message,
    });
  }
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  toggleTodoDone,
  deleteTodo,
};
