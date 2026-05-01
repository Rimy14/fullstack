const API_BASE = "/api/todos";

/**
 * Fetch all todos from the API
 */
export const fetchTodos = async () => {
  const response = await fetch(API_BASE);
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to fetch todos");
  }
  return data.data;
};

/**
 * Create a new todo
 */
export const createTodo = async (todoData) => {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todoData),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to create todo");
  }
  return data.data;
};

/**
 * Update a todo's title and/or description
 */
export const updateTodo = async (id, updateData) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to update todo");
  }
  return data.data;
};

/**
 * Toggle a todo's done status
 */
export const toggleTodoDone = async (id) => {
  const response = await fetch(`${API_BASE}/${id}/done`, {
    method: "PATCH",
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to toggle todo status");
  }
  return data.data;
};

/**
 * Delete a todo
 */
export const deleteTodo = async (id) => {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
  });
  const data = await response.json();
  if (!data.success) {
    throw new Error(data.message || "Failed to delete todo");
  }
  return data.data;
};
