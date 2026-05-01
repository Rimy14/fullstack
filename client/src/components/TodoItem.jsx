import { useState } from "react";

export default function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || "");
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [editError, setEditError] = useState("");

  const handleSave = async () => {
    if (!editTitle.trim()) {
      setEditError("Title is required");
      return;
    }

    try {
      setEditError("");
      await onEdit(todo._id, {
        title: editTitle.trim(),
        description: editDescription.trim(),
      });
      setIsEditing(false);
    } catch (err) {
      setEditError(err.message);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditError("");
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      // Auto-reset after 3 seconds if not confirmed
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setIsDeleting(true);
    await onDelete(todo._id);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") {
      handleCancel();
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      className={`todo-item ${todo.done ? "done" : ""} ${isDeleting ? "deleting" : ""} ${isEditing ? "editing" : ""}`}
      id={`todo-item-${todo._id}`}
    >
      {isEditing ? (
        <div className="todo-edit-form">
          {editError && (
            <div className="edit-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {editError}
            </div>
          )}
          <input
            className="edit-input"
            type="text"
            value={editTitle}
            onChange={(e) => {
              setEditTitle(e.target.value);
              if (editError) setEditError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="Task title"
            maxLength={200}
            autoFocus
            id={`edit-title-${todo._id}`}
          />
          <textarea
            className="edit-textarea"
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Description (optional)"
            maxLength={1000}
            rows={2}
            id={`edit-desc-${todo._id}`}
          />
          <div className="edit-actions">
            <button className="btn-save" onClick={handleSave} id={`btn-save-${todo._id}`}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Save
            </button>
            <button className="btn-cancel" onClick={handleCancel} id={`btn-cancel-${todo._id}`}>
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="todo-left">
            <button
              className={`checkbox ${todo.done ? "checked" : ""}`}
              onClick={() => onToggle(todo._id)}
              aria-label={todo.done ? "Mark as undone" : "Mark as done"}
              id={`btn-toggle-${todo._id}`}
            >
              {todo.done && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
            <div className="todo-content">
              <h3 className={`todo-title ${todo.done ? "completed" : ""}`}>
                {todo.title}
              </h3>
              {todo.description && (
                <p className={`todo-description ${todo.done ? "completed" : ""}`}>
                  {todo.description}
                </p>
              )}
              <span className="todo-date">
                {formatDate(todo.createdAt)}
                {todo.updatedAt !== todo.createdAt && " · edited"}
              </span>
            </div>
          </div>
          <div className="todo-actions">
            <button
              className="btn-icon btn-edit"
              onClick={() => setIsEditing(true)}
              aria-label="Edit todo"
              title="Edit"
              id={`btn-edit-${todo._id}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button
              className={`btn-icon btn-delete ${confirmDelete ? "confirming" : ""}`}
              onClick={handleDelete}
              aria-label={confirmDelete ? "Confirm delete" : "Delete todo"}
              title={confirmDelete ? "Click again to confirm" : "Delete"}
              id={`btn-delete-${todo._id}`}
            >
              {confirmDelete ? (
                <span className="confirm-text">Delete?</span>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  <line x1="10" y1="11" x2="10" y2="17"/>
                  <line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
