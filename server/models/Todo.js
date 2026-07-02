const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const MongooseTodo = mongoose.model("Todo", todoSchema);

// In-memory fallback database pre-seeded with sample tasks
const memoryTodos = [
  createMemoryTodo({
    _id: "mock-1",
    title: "🚀 Learn React and Node.js",
    description: "Understand full-stack integration and REST APIs.",
    done: true,
    createdAt: new Date(Date.now() - 3600000 * 2), // 2 hours ago
  }),
  createMemoryTodo({
    _id: "mock-2",
    title: "📝 Set up project structure",
    description: "Create folder layout for client and server.",
    done: true,
    createdAt: new Date(Date.now() - 3600000), // 1 hour ago
  }),
  createMemoryTodo({
    _id: "mock-3",
    title: "⚡ Configure deployment and fallback database",
    description: "Implement automated fallback to in-memory database to allow anyone to test.",
    done: false,
    createdAt: new Date(),
  }),
];

// Helper to create a memory todo object with mongoose-like methods (such as .save())
function createMemoryTodo(data) {
  const todo = {
    _id: data._id || new mongoose.Types.ObjectId().toString(),
    title: data.title,
    description: data.description || "",
    done: data.done !== undefined ? data.done : false,
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
  };

  // Add .save() method to match Mongoose document behavior
  Object.defineProperty(todo, "save", {
    value: async function () {
      this.updatedAt = new Date();
      const index = memoryTodos.findIndex((t) => t._id.toString() === this._id.toString());
      if (index === -1) {
        memoryTodos.push(this);
      } else {
        memoryTodos[index] = this;
      }
      return this;
    },
    enumerable: false, // Prevents serialization in JSON responses
    writable: true,
  });

  return todo;
}

// Fallback database operations simulating Mongoose methods
const TodoFallback = {
  find: () => {
    return {
      sort: (sortOption) => {
        // Sort descending by createdAt
        return [...memoryTodos].sort((a, b) => b.createdAt - a.createdAt);
      },
    };
  },
  create: async (data) => {
    const todo = createMemoryTodo(data);
    memoryTodos.push(todo);
    return todo;
  },
  findById: async (id) => {
    const todo = memoryTodos.find((t) => t._id.toString() === id.toString());
    if (!todo) return null;
    return todo;
  },
  findByIdAndUpdate: async (id, updateData, options) => {
    const todo = memoryTodos.find((t) => t._id.toString() === id.toString());
    if (!todo) return null;
    if (updateData.title !== undefined) todo.title = updateData.title;
    if (updateData.description !== undefined) todo.description = updateData.description;
    todo.updatedAt = new Date();
    return todo;
  },
  findByIdAndDelete: async (id) => {
    const index = memoryTodos.findIndex((t) => t._id.toString() === id.toString());
    if (index === -1) return null;
    const deleted = memoryTodos[index];
    memoryTodos.splice(index, 1);
    return deleted;
  },
};

// JS Proxy: Route requests to the real Mongoose Model if MongoDB is connected, or the Fallback Model otherwise
const TodoProxy = new Proxy(MongooseTodo, {
  get(target, prop) {
    if (mongoose.connection.readyState === 1) {
      return Reflect.get(target, prop);
    } else {
      return Reflect.get(TodoFallback, prop);
    }
  },
});

module.exports = TodoProxy;
