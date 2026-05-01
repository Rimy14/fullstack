import { useState } from "react";
import TodoItem from "./TodoItem";

export default function TodoList({ todos, onToggle, onEdit, onDelete, loading }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  if (loading) {
    return (
      <div className="loading-state" id="loading-state">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
        </div>
        <p>Loading your tasks...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="empty-state" id="empty-state">
        <div className="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <h3>No tasks yet</h3>
        <p>Create your first task to get started!</p>
      </div>
    );
  }

  const searchLower = search.toLowerCase();
  const searchedTodos = search
    ? todos.filter((t) =>
        t.title.toLowerCase().includes(searchLower) ||
        (t.description && t.description.toLowerCase().includes(searchLower))
      )
    : todos;

  const activeTodos = searchedTodos.filter((t) => !t.done);
  const completedTodos = searchedTodos.filter((t) => t.done);

  const filteredActive = filter === "completed" ? [] : activeTodos;
  const filteredCompleted = filter === "active" ? [] : completedTodos;
  const showEmpty = filteredActive.length === 0 && filteredCompleted.length === 0;

  return (
    <div className="todo-list" id="todo-list">
      <div className="list-stats">
        <span className="stat">
          <span className="stat-count">{activeTodos.length}</span> active
        </span>
        <span className="stat-divider">·</span>
        <span className="stat">
          <span className="stat-count">{completedTodos.length}</span> completed
        </span>
        <span className="stat-divider">·</span>
        <span className="stat">
          <span className="stat-count">{todos.length}</span> total
        </span>
      </div>

      <div className="progress-bar-container" id="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${todos.length > 0 ? (completedTodos.length / todos.length) * 100 : 0}%` }}
        />
      </div>

      <div className="search-bar" id="search-bar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          id="search-input"
        />
        {search && (
          <button className="search-clear" onClick={() => setSearch("")}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        )}
      </div>

      <div className="filter-bar" id="filter-bar">
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
            id={`filter-${f}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {showEmpty && (
        <div className="empty-state" style={{ padding: "2rem" }}>
          <p>No {filter} tasks</p>
        </div>
      )}

      {filteredActive.length > 0 && (
        <div className="todo-section">
          <div className="section-header">
            <span className="section-dot active" />
            <h3>Active Tasks</h3>
          </div>
          <div className="todo-items">
            {filteredActive.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {filteredCompleted.length > 0 && (
        <div className="todo-section">
          <div className="section-header">
            <span className="section-dot completed" />
            <h3>Completed</h3>
          </div>
          <div className="todo-items">
            {filteredCompleted.map((todo) => (
              <TodoItem
                key={todo._id}
                todo={todo}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
