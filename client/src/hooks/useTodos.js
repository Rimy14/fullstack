import { useState, useEffect, useCallback } from "react";
import * as todoApi from "../services/todoApi";

export function useTodos() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadTodos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoApi.fetchTodos();
      setTodos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const addTodo = async (todoData) => {
    try {
      setError(null);
      const newTodo = await todoApi.createTodo(todoData);
      setTodos((prev) => [newTodo, ...prev]);
      return newTodo;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const editTodo = async (id, updateData) => {
    // Optimistic update
    const previousTodos = [...todos];
    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id ? { ...todo, ...updateData } : todo
      )
    );

    try {
      setError(null);
      const updated = await todoApi.updateTodo(id, updateData);
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updated : todo))
      );
      return updated;
    } catch (err) {
      // Rollback on error
      setTodos(previousTodos);
      setError(err.message);
      throw err;
    }
  };

  const toggleDone = async (id) => {
    // Optimistic update
    const previousTodos = [...todos];
    setTodos((prev) =>
      prev.map((todo) =>
        todo._id === id ? { ...todo, done: !todo.done } : todo
      )
    );

    try {
      setError(null);
      const updated = await todoApi.toggleTodoDone(id);
      setTodos((prev) =>
        prev.map((todo) => (todo._id === id ? updated : todo))
      );
    } catch (err) {
      // Rollback on error
      setTodos(previousTodos);
      setError(err.message);
    }
  };

  const removeTodo = async (id) => {
    // Optimistic update
    const previousTodos = [...todos];
    setTodos((prev) => prev.filter((todo) => todo._id !== id));

    try {
      setError(null);
      await todoApi.deleteTodo(id);
    } catch (err) {
      // Rollback on error
      setTodos(previousTodos);
      setError(err.message);
    }
  };

  const clearError = () => setError(null);

  return {
    todos,
    loading,
    error,
    addTodo,
    editTodo,
    toggleDone,
    removeTodo,
    clearError,
    refresh: loadTodos,
  };
}
