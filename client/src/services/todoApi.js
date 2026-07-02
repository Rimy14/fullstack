const API_BASE = "/api/todos";
let useLocalStorage = false;

// Default sample tasks to pre-populate local storage so the application is not empty on first launch
const defaultTodos = [];

// Helper to retrieve tasks from local storage
const getLocalTodos = () => {
  const local = localStorage.getItem("todo-app-tasks");
  if (!local) {
    localStorage.setItem("todo-app-tasks", JSON.stringify(defaultTodos));
    return defaultTodos;
  }
  try {
    return JSON.parse(local);
  } catch (e) {
    return defaultTodos;
  }
};

// Helper to save tasks to local storage
const saveLocalTodos = (todos) => {
  localStorage.setItem("todo-app-tasks", JSON.stringify(todos));
};

/**
 * Fetch all todos from the API (or localStorage if API is down)
 */
export const fetchTodos = async () => {
  if (useLocalStorage) {
    return getLocalTodos();
  }

  try {
    const response = await fetch(API_BASE);
    const contentType = response.headers.get("content-type");
    
    // If the response is a 404 page (or any non-JSON content, like Netlify's 404 HTML page)
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      console.warn("⚠️ Backend API not available. Switching to LocalStorage fallback.");
      useLocalStorage = true;
      return getLocalTodos();
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to fetch todos");
    }
    return data.data;
  } catch (err) {
    console.warn("⚠️ Fetch failed. Switching to LocalStorage fallback.", err);
    useLocalStorage = true;
    return getLocalTodos();
  }
};

/**
 * Create a new todo
 */
export const createTodo = async (todoData) => {
  if (useLocalStorage) {
    const todos = getLocalTodos();
    const newTodo = {
      _id: "local-" + Date.now(),
      title: todoData.title.trim(),
      description: todoData.description ? todoData.description.trim() : "",
      done: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    todos.unshift(newTodo);
    saveLocalTodos(todos);
    return newTodo;
  }

  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(todoData),
    });
    
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      useLocalStorage = true;
      return createTodo(todoData);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to create todo");
    }
    return data.data;
  } catch (err) {
    useLocalStorage = true;
    return createTodo(todoData);
  }
};

/**
 * Update a todo's title and/or description
 */
export const updateTodo = async (id, updateData) => {
  if (useLocalStorage) {
    const todos = getLocalTodos();
    const index = todos.findIndex((t) => t._id.toString() === id.toString());
    if (index !== -1) {
      todos[index] = {
        ...todos[index],
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      saveLocalTodos(todos);
      return todos[index];
    }
    throw new Error("Todo not found locally");
  }

  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updateData),
    });
    
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      useLocalStorage = true;
      return updateTodo(id, updateData);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to update todo");
    }
    return data.data;
  } catch (err) {
    useLocalStorage = true;
    return updateTodo(id, updateData);
  }
};

/**
 * Toggle a todo's done status
 */
export const toggleTodoDone = async (id) => {
  if (useLocalStorage) {
    const todos = getLocalTodos();
    const index = todos.findIndex((t) => t._id.toString() === id.toString());
    if (index !== -1) {
      todos[index].done = !todos[index].done;
      todos[index].updatedAt = new Date().toISOString();
      saveLocalTodos(todos);
      return todos[index];
    }
    throw new Error("Todo not found locally");
  }

  try {
    const response = await fetch(`${API_BASE}/${id}/done`, {
      method: "PATCH",
    });
    
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      useLocalStorage = true;
      return toggleTodoDone(id);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to toggle todo status");
    }
    return data.data;
  } catch (err) {
    useLocalStorage = true;
    return toggleTodoDone(id);
  }
};

/**
 * Delete a todo
 */
export const deleteTodo = async (id) => {
  if (useLocalStorage) {
    const todos = getLocalTodos();
    const filtered = todos.filter((t) => t._id.toString() !== id.toString());
    saveLocalTodos(filtered);
    return { success: true };
  }

  try {
    const response = await fetch(`${API_BASE}/${id}`, {
      method: "DELETE",
    });
    
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType || !contentType.includes("application/json")) {
      useLocalStorage = true;
      return deleteTodo(id);
    }
    
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || "Failed to delete todo");
    }
    return data.data;
  } catch (err) {
    useLocalStorage = true;
    return deleteTodo(id);
  }
};
